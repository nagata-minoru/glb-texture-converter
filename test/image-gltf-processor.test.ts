import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import sharp from 'sharp';
import { processFile, saveFile } from '../src/image-gltf-processor';

const TEXTURE_WIDTH = 64;
const TEXTURE_HEIGHT = 32;
const DATA_URI_HEAD = 'data:application/octet-stream;base64,';

let tmpDir: string;

/**
 * JPEG テクスチャを 1 枚だけ埋め込んだ最小限の glTF の JSON 文字列を作る。
 *
 * @param jpeg - 埋め込む JPEG データ
 * @returns glTF の JSON 文字列
 */
const buildGltf = (jpeg: Buffer): string => {
  return JSON.stringify({
    asset: { version: '2.0' },
    images: [{ mimeType: 'image/jpeg', bufferView: 0 }],
    bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: jpeg.length }],
    buffers: [{
      byteLength: jpeg.length,
      uri: DATA_URI_HEAD + jpeg.toString('base64'),
    }],
  });
};

/**
 * 変換後の glTF オブジェクトからテクスチャ画像のメタデータを取り出す。
 *
 * @param gltf - 変換後の glTF オブジェクト
 * @returns テクスチャ画像のメタデータ
 */
const readTextureMetadata = async (gltf: any): Promise<sharp.Metadata> => {
  const buffer = Buffer.from(gltf.buffers[0].uri.slice(DATA_URI_HEAD.length), 'base64');
  const view = gltf.bufferViews[gltf.images[0].bufferView];
  return sharp(buffer.subarray(view.byteOffset, view.byteOffset + view.byteLength)).metadata();
};

beforeAll(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'glb-texture-converter-'));
  const jpeg = await sharp({
    create: { width: TEXTURE_WIDTH, height: TEXTURE_HEIGHT, channels: 3, background: '#336699' },
  }).jpeg().toBuffer();
  const gltf = buildGltf(jpeg);
  await fs.writeFile(path.join(tmpDir, 'input.gltf'), gltf);
  // GLB スタブは JSON のバイト列を GLB の代わりに扱う
  await fs.writeFile(path.join(tmpDir, 'input.glb'), gltf);
});

afterAll(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe('processFile', () => {
  test('.gltf は scaleRatio に応じてテクスチャが縮小される', async () => {
    // 型定義は Uint8Array だが、.gltf では実際には JSON 文字列が返る
    const data = await processFile(path.join(tmpDir, 'input.gltf'), 0.5) as unknown as string;
    const metadata = await readTextureMetadata(JSON.parse(data));
    expect(metadata.width).toBe(TEXTURE_WIDTH * 0.5);
    expect(metadata.height).toBe(TEXTURE_HEIGHT * 0.5);
  });

  test('.glb は scaleRatio に応じてテクスチャが縮小される', async () => {
    const data = await processFile(path.join(tmpDir, 'input.glb'), 0.25);
    const metadata = await readTextureMetadata(JSON.parse(new TextDecoder().decode(data)));
    expect(metadata.width).toBe(TEXTURE_WIDTH * 0.25);
    expect(metadata.height).toBe(TEXTURE_HEIGHT * 0.25);
  });

  test('scaleRatio が 1 ならサイズは変わらない', async () => {
    const data = await processFile(path.join(tmpDir, 'input.gltf'), 1) as unknown as string;
    const metadata = await readTextureMetadata(JSON.parse(data));
    expect(metadata.width).toBe(TEXTURE_WIDTH);
    expect(metadata.height).toBe(TEXTURE_HEIGHT);
  });

  test('存在しないファイルは reject される', async () => {
    await expect(processFile(path.join(tmpDir, 'missing.gltf'), 0.5)).rejects.toMatchObject({ code: 'ENOENT' });
  });
});

describe('saveFile', () => {
  test('データをファイルに書き出す', async () => {
    const outPath = path.join(tmpDir, 'out.bin');
    const data = new Uint8Array([1, 2, 3, 4]);
    await saveFile(outPath, data);
    expect(new Uint8Array(await fs.readFile(outPath))).toEqual(data);
  });

  test('書き込みに失敗しても例外を投げない', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(saveFile(path.join(tmpDir, 'no-such-dir', 'out.bin'), new Uint8Array([1]))).resolves.toBeUndefined();
    expect(error).toHaveBeenCalledTimes(1);
    error.mockRestore();
  });
});

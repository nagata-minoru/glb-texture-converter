import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

const processFile = vi.fn();
const saveFile = vi.fn();

vi.mock('../src/image-gltf-processor', () => ({
  processFile: (...args: unknown[]) => processFile(...args),
  saveFile: (...args: unknown[]) => saveFile(...args),
}));

/**
 * 指定した引数で main.ts を実行する。main.ts は import 時に実行されるため、都度モジュールを読み込み直す。
 *
 * @param args - コマンドライン引数 (node とスクリプト名は除く)
 */
const runMain = async (args: string[]): Promise<void> => {
  process.argv = ['node', 'main.js', ...args];
  vi.resetModules();
  await import('../src/main');
  // main() は非同期なので、処理が終わるのを待つ
  await new Promise((resolve) => setTimeout(resolve, 0));
};

const originalArgv = process.argv;

beforeEach(() => {
  processFile.mockReset().mockResolvedValue(new Uint8Array([1]));
  saveFile.mockReset().mockResolvedValue(undefined);
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
});

afterEach(() => {
  process.argv = originalArgv;
  vi.restoreAllMocks();
});

describe('main', () => {
  test('引数の数が違うと usage を出して終了コード 1 で終わる', async () => {
    await runMain(['in.glb', 'out.glb']);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Usage'));
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  test.each(['abc', '0', '-1'])('scaleRatio が %s だとエラーで終わる', async (ratio) => {
    await runMain(['in.glb', 'out.glb', ratio]);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('scaleRatio'));
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  test('正しい引数なら processFile の結果を saveFile に渡す', async () => {
    await runMain(['in.glb', 'out.glb', '0.5']);
    expect(processFile).toHaveBeenCalledWith('in.glb', 0.5);
    expect(saveFile).toHaveBeenCalledWith('out.glb', new Uint8Array([1]));
    expect(process.exit).not.toHaveBeenCalled();
  });

  test('processFile が失敗したら終了コード 1 で終わる', async () => {
    processFile.mockRejectedValue(new Error('boom'));
    await runMain(['in.glb', 'out.glb', '0.5']);
    expect(saveFile).not.toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});

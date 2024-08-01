// @ts-expect-error
import { GLTF } from 'https://code4fukui.github.io/GLTF/GLTF.js';
// @ts-expect-error
import { GLB } from 'https://code4fukui.github.io/GLTF/GLB.js';
// @ts-expect-error
import { ImageUtil } from "https://code4fukui.github.io/ImageUtil/ImageUtil.js";

import * as fs from 'node:fs/promises';
import sharp from 'sharp';

interface FileItem {
  filePath: string;
}

interface ImageOptions {
  width: number;
  quality: number;
  colorSpace: 'srgb' | 'display-p3';
}

// TODO: 一時ファイルを使わねばならない。要再生成
const resizeImage = async (inputPath: string, outputPath: string, options: ImageOptions): Promise<void> => {
  debugger
  try {
    await sharp(inputPath)
      .resize({
        width: options.width,
        withoutEnlargement: true, // 画像が指定された幅より大きくならないようにする
      })
      .toFormat('jpeg', { quality: options.quality })
      .withMetadata() // メタデータを保持
      // .toColourspace(options.colorSpace) // カラースペースを設定
      .toFile(outputPath);
    console.log(`Image resized and saved to ${outputPath}`);
  } catch (error) {
    console.error('Error resizing image:', error);
  }
};

const processFile = async (
  item: FileItem,
  name: string,
  imgwidth: number,
  imgquality: number,
  imgsrgb: boolean,
  files): Promise<void> =>
{
  const filePath = item.filePath;
  const bin = new Uint8Array(await fs.readFile(filePath));
  const gltfmode = name.endsWith(".gltf");
  const gltf = gltfmode ? GLTF.parse(bin) : await GLB.decode(bin);

  const img = GLTF.getTexture(gltf);
  const imgw = imgwidth;
  const imgq = imgquality;
  const imgc = imgsrgb ? "srgb" : "display-p3";

  // オプションオブジェクトを作成
  const options: ImageOptions = {
    width: imgw,
    quality: imgq,
    colorSpace: imgc as 'srgb' | 'display-p3'
  };

  const img2 = await resizeImage(img, imgw, imgq, imgc);
  GLTF.setTexture(gltf, img2);

  const data = gltfmode ? GLTF.stringify(gltf) : await GLB.encode(gltf);
  const name2 = name.substring(0, name.length - 3) + "gltf";
  files.push({ name: name2, data });
}

const files = [];
processFile({filePath: 'input.glb'}, 'output.glb', 100, 1, false, files)

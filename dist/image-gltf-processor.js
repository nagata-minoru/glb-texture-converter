import * as fs from 'node:fs/promises';
import sharp from 'sharp';
// @ts-expect-error
import { GLTF } from 'https://code4fukui.github.io/GLTF/GLTF.js';
// @ts-expect-error
import { GLB } from 'https://code4fukui.github.io/GLTF/GLB.js';
/**
 * 画像をリサイズする関数
 *
 * @param {Uint8Array} img - 入力画像データ
 * @param {number} width - リサイズ後の幅
 * @returns {Promise<Uint8Array>} - リサイズされた画像データ
 */
const resizeImage = async (img, width) => {
    const img2 = await sharp(img)
        .resize(width)
        .toBuffer();
    return img2;
};
/**
 * 画像のメタデータを取得する関数
 *
 * @param {Uint8Array} img - 入力画像データ
 * @returns {Promise<{ width: number, height: number }>} - 画像の幅と高さを含むオブジェクト
 */
const getImageMetadata = async (img) => {
    const metadata = await sharp(img).metadata();
    return {
        width: metadata.width || 0,
        height: metadata.height || 0
    };
};
/**
 * ファイルを処理し、GLTFまたはGLB形式に変換する関数
 *
 * @param {string} filePath - 処理するファイル名
 * @param {number} scaleRatio - 画像の縮尺比率
 * @returns {Promise<Uint8Array>} - 変換されたデータ
 */
export const processFile = async (filePath, scaleRatio) => {
    const bin = new Uint8Array(await fs.readFile(filePath));
    const gltfmode = filePath.endsWith(".gltf");
    const gltf = gltfmode ? GLTF.parse(bin) : await GLB.decode(bin);
    const img = GLTF.getTexture(gltf);
    const { width } = await getImageMetadata(img); // 画像の幅を取得
    const img2 = await resizeImage(img, width * scaleRatio);
    GLTF.setTexture(gltf, img2);
    const data = gltfmode ? GLTF.stringify(gltf) : await GLB.encode(gltf);
    return data;
};
/**
 * 変換されたファイルデータを保存する関数
 *
 * @param {string} filePath - 保存するファイルのパス
 * @param {Uint8Array} data - 保存するデータ
 */
export const saveFile = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, data);
        console.log(`File saved to ${filePath}`);
    }
    catch (error) {
        console.error('Error saving file:', error);
    }
};

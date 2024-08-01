// @ts-expect-error
import { GLTF } from 'https://code4fukui.github.io/GLTF/GLTF.js';
// @ts-expect-error
import { GLB } from 'https://code4fukui.github.io/GLTF/GLB.js';
import * as fs from 'node:fs/promises';
import sharp from 'sharp';
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
const processFile = async (filePath, scaleRatio) => {
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
const saveFile = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, data);
        console.log(`File saved to ${filePath}`);
    }
    catch (error) {
        console.error('Error saving file:', error);
    }
};
// コマンドライン引数を解析して処理を実行
const main = async () => {
    const args = process.argv.slice(2);
    if (args.length !== 3) {
        console.error('Usage: node script.js <inputFile> <outputFile> <scaleRatio>');
        process.exit(1);
    }
    const [inputFile, outputFile, scaleRatioStr] = args;
    const scaleRatio = parseFloat(scaleRatioStr);
    if (isNaN(scaleRatio) || scaleRatio <= 0) {
        console.error('Error: scaleRatio must be a positive number.');
        process.exit(1);
    }
    const result = await processFile(inputFile, scaleRatio);
    await saveFile(outputFile, result);
};
main().catch(console.error);

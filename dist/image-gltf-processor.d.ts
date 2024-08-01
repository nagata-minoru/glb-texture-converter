/**
 * ファイルを処理し、GLTFまたはGLB形式に変換する関数
 *
 * @param {string} filePath - 処理するファイル名
 * @param {number} scaleRatio - 画像の縮尺比率
 * @returns {Promise<Uint8Array>} - 変換されたデータ
 */
export declare const processFile: (filePath: string, scaleRatio: number) => Promise<Uint8Array>;
/**
 * 変換されたファイルデータを保存する関数
 *
 * @param {string} filePath - 保存するファイルのパス
 * @param {Uint8Array} data - 保存するデータ
 */
export declare const saveFile: (filePath: string, data: Uint8Array) => Promise<void>;

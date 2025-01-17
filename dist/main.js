import { processFile, saveFile } from "./image-gltf-processor.js";
// コマンドライン引数を解析して処理を実行
const main = async () => {
    try {
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
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
main().catch(console.error);

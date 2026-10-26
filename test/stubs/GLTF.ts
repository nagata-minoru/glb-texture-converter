const head = 'data:application/octet-stream;base64,';

/**
 * 外部モジュール GLTF.js の代替スタブ。data URI に埋め込まれた最初の画像だけを扱う。
 */
export const GLTF = {
  parse: (bin: Uint8Array) => JSON.parse(new TextDecoder().decode(bin)),
  stringify: (gltf: unknown) => JSON.stringify(gltf, null, 2),
  getTexture: (gltf: any) => {
    const buffer = Buffer.from(gltf.buffers[0].uri.slice(head.length), 'base64');
    const view = gltf.bufferViews[gltf.images[0].bufferView];
    return new Uint8Array(buffer.subarray(view.byteOffset, view.byteOffset + view.byteLength));
  },
  setTexture: (gltf: any, img: Uint8Array) => {
    gltf.buffers[0].uri = head + Buffer.from(img).toString('base64');
    gltf.buffers[0].byteLength = img.length;
    gltf.bufferViews[gltf.images[0].bufferView] = { buffer: 0, byteOffset: 0, byteLength: img.length };
    return gltf;
  },
};

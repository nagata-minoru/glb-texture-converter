/**
 * 外部モジュール GLB.js の代替スタブ。GLB の代わりに JSON のバイト列を encode / decode する。
 */
export const GLB = {
  decode: async (bin: Uint8Array) => JSON.parse(new TextDecoder().decode(bin)),
  encode: async (gltf: unknown) => new TextEncoder().encode(JSON.stringify(gltf)),
};

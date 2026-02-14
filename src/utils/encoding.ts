export function toBase64(data: ArrayBuffer): string {
  return Buffer.from(new Uint8Array(data)).toString("base64");
}

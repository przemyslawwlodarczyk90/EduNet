export function ipToInt(ip: string): number | null {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return null;
  let result = 0;
  for (const part of parts) {
    if (!/^\d+$/.test(part)) return null;
    const octet = Number(part);
    if (octet < 0 || octet > 255) return null;
    result = (result << 8) | octet;
  }
  return result >>> 0;
}

export function intToIp(value: number): string {
  const v = value >>> 0;
  return [(v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff].join(".");
}

export function cidrToMask(prefixLength: number): number {
  if (prefixLength <= 0) return 0;
  if (prefixLength >= 32) return 0xffffffff >>> 0;
  return (0xffffffff << (32 - prefixLength)) >>> 0;
}

export function toBinaryString(value: number): string {
  return (value >>> 0).toString(2).padStart(32, "0");
}

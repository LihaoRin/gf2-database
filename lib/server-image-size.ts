import { promises as fs } from "node:fs";
import path from "node:path";

type ImageSize = {
  width: number;
  height: number;
};

const imageSizeCache = new Map<string, Promise<ImageSize | null>>();

function getPublicImagePath(src: string) {
  const normalizedSrc = decodeURIComponent(src.replace(/^\/+/, ""));
  return path.join(process.cwd(), "public", normalizedSrc);
}

async function readPngSize(filePath: string) {
  const handle = await fs.open(filePath, "r");

  try {
    const buffer = Buffer.alloc(24);
    await handle.read(buffer, 0, buffer.length, 0);

    const pngSignature = "89504e470d0a1a0a";
    if (buffer.subarray(0, 8).toString("hex") !== pngSignature) {
      return null;
    }

    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20)
    };
  } finally {
    await handle.close();
  }
}

async function readJpegSize(filePath: string) {
  const buffer = await fs.readFile(filePath);

  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }

  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    const blockLength = buffer.readUInt16BE(offset + 2);

    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7)
      };
    }

    offset += 2 + blockLength;
  }

  return null;
}

async function readImageSize(src: string) {
  const filePath = getPublicImagePath(src);

  try {
    const pngSize = await readPngSize(filePath);
    if (pngSize) {
      return pngSize;
    }

    const jpegSize = await readJpegSize(filePath);
    if (jpegSize) {
      return jpegSize;
    }
  } catch {
    return null;
  }

  return null;
}

export async function getImageSize(src: string) {
  const cached = imageSizeCache.get(src);

  if (cached) {
    return cached;
  }

  const pending = readImageSize(src);
  imageSizeCache.set(src, pending);
  return pending;
}

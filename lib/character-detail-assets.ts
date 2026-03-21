import fs from "node:fs/promises";
import path from "node:path";
import type { CharacterDetailGalleryGroup } from "@/lib/types";

const { imageSize } = require("next/dist/compiled/image-size") as {
  imageSize: (filePath: string) => { width?: number; height?: number };
};

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);
const DETAIL_IMAGE_ROOT = path.join(process.cwd(), "public", "images", "details");

function isImageFile(fileName: string) {
  return IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase());
}

function extractOrder(fileName: string) {
  const stem = path.parse(fileName).name;
  const numeric = Number(stem);
  return Number.isFinite(numeric) ? numeric : Number.MAX_SAFE_INTEGER;
}

function sortImageNames(a: string, b: string) {
  const orderDiff = extractOrder(a) - extractOrder(b);
  if (orderDiff !== 0) {
    return orderDiff;
  }

  return a.localeCompare(b, "ja");
}

function toPublicPath(...segments: string[]) {
  return `/${segments.map((segment) => encodeURIComponent(segment)).join("/")}`;
}

function getGroupSortKey(folderName: string): [number, number, string] {
  if (folderName === "図鑑") {
    return [0, 0, folderName];
  }

  const skinMatch = /^Skin(\d+)$/i.exec(folderName);
  if (skinMatch) {
    return [1, Number(skinMatch[1]), folderName];
  }

  if (folderName === "他の参考画像") {
    return [2, 0, folderName];
  }

  if (folderName === "武器") {
    return [3, 0, folderName];
  }

  return [4, 0, folderName];
}

function sortGroupNames(a: string, b: string) {
  const [groupA, orderA, textA] = getGroupSortKey(a);
  const [groupB, orderB, textB] = getGroupSortKey(b);

  if (groupA !== groupB) {
    return groupA - groupB;
  }

  if (orderA !== orderB) {
    return orderA - orderB;
  }

  return textA.localeCompare(textB, "ja");
}

export async function getCharacterDetailAssets(characterId: number): Promise<{
  galleries: CharacterDetailGalleryGroup[];
  weaponImages: string[];
}> {
  const characterDir = path.join(DETAIL_IMAGE_ROOT, String(characterId));

  try {
    const entries = await fs.readdir(characterDir, { withFileTypes: true });
    const folderNames = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort(sortGroupNames);

    const galleries: CharacterDetailGalleryGroup[] = [];
    let weaponImages: string[] = [];

    for (const folderName of folderNames) {
      const folderPath = path.join(characterDir, folderName);
      const imageNames = (await fs.readdir(folderPath, { withFileTypes: true }))
        .filter((entry) => entry.isFile() && isImageFile(entry.name))
        .map((entry) => entry.name)
        .sort(sortImageNames);

      if (imageNames.length === 0) {
        continue;
      }

      const imagePaths = imageNames.map((fileName) =>
        toPublicPath("images", "details", String(characterId), folderName, fileName)
      );
      const imageEntries = imageNames.map((fileName, index) => {
        const filePath = path.join(folderPath, fileName);
        const size = imageSize(filePath);

        return {
          src: imagePaths[index],
          width: size.width ?? 0,
          height: size.height ?? 0
        };
      });

      if (folderName === "武器") {
        weaponImages = imageEntries.map((entry) => entry.src);
        continue;
      }

      galleries.push({
        title: folderName,
        folderName,
        images: imageEntries
      });
    }

    return {
      galleries,
      weaponImages
    };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return {
        galleries: [],
        weaponImages: []
      };
    }

    throw error;
  }
}

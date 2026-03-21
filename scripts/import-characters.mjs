import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, "..", "data", "characters.csv");
const jsonPath = path.join(__dirname, "..", "data", "characters.json");
const imagesDir = path.join(__dirname, "..", "public", "images");

const requiredHeaders = ["id", "name_zh", "name_ja", "name_en", "image"];
const imageExtensions = ["png", "webp", "jpg", "jpeg"];

function parseCsv(text) {
  const rows = [];
  let currentRow = [];
  let currentField = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentField);
      currentField = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }

      currentRow.push(currentField);
      currentField = "";

      if (currentRow.some((field) => field.length > 0)) {
        rows.push(currentRow);
      }

      currentRow = [];
      continue;
    }

    currentField += char;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((field) => field.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function toRecord(headers, row, rowNumber) {
  if (row.length !== headers.length) {
    throw new Error(
      `Row ${rowNumber} has ${row.length} columns, expected ${headers.length}.`
    );
  }

  return Object.fromEntries(
    headers.map((header, index) => [header, row[index].trim()])
  );
}

function assertHeaders(headers) {
  const missingHeaders = requiredHeaders.filter(
    (header) => !headers.includes(header)
  );

  if (missingHeaders.length > 0) {
    throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`);
  }
}

function isBlankRow(row) {
  return Object.values(row).every((value) => value === "");
}

function isPublishReady(row) {
  const requiredForPublish = ["id", "name_zh"];

  return requiredForPublish.every((field) => row[field] !== "");
}

async function resolveImagePath(rowImage, numericId) {
  if (rowImage) {
    return rowImage;
  }

  for (const extension of imageExtensions) {
    const filename = `${numericId}.${extension}`;

    try {
      await fs.access(path.join(imagesDir, filename));
      return `/images/${filename}`;
    } catch {
      continue;
    }
  }

  return `/images/${numericId}.webp`;
}

async function toCharacter(row, rowNumber) {
  const numericId = Number(row.id);

  if (!Number.isInteger(numericId)) {
    throw new Error(`Row ${rowNumber} has invalid numeric id.`);
  }

  return {
    id: numericId,
    image: await resolveImagePath(row.image, numericId),
    name: {
      zh: row.name_zh,
      ja: row.name_ja,
      en: row.name_en
    }
  };
}

async function main() {
  const csvText = await fs.readFile(csvPath, "utf8");
  const rows = parseCsv(csvText);

  if (rows.length < 2) {
    throw new Error("characters.csv must include a header row and at least one data row.");
  }

  const [headers, ...dataRows] = rows;
  assertHeaders(headers);

  const draftRows = [];
  const characters = [];

  for (const [index, row] of dataRows.entries()) {
    const record = toRecord(headers, row, index + 2);

    if (isBlankRow(record)) {
      continue;
    }

    if (!isPublishReady(record)) {
      draftRows.push(index + 2);
      continue;
    }

    characters.push(await toCharacter(record, index + 2));
  }

  await fs.writeFile(jsonPath, `${JSON.stringify(characters, null, 2)}\n`, "utf8");
  console.log(`Imported ${characters.length} characters into ${path.relative(process.cwd(), jsonPath)}.`);

  if (draftRows.length > 0) {
    console.warn(
      `Skipped ${draftRows.length} draft rows without full data: ${draftRows.join(", ")}.`
    );
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

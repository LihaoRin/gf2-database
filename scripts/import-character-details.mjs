import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, "..", "data", "character-details.csv");
const jsonPath = path.join(__dirname, "..", "data", "character-details.json");

const requiredHeaders = [
  "id",
  "profile_title",
  "archive_code",
  "faction",
  "role_label",
  "illustrator",
  "voice_actor",
  "height",
  "theme_color",
  "birthplace",
  "combat_style",
  "status_note",
  "overview",
  "weapon_name",
  "weapon_name_zh",
  "weapon_name_en",
  "weapon_image",
  "weapon_description",
  "equipment_note"
];

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
  return row.id !== "";
}

function toDetail(row, rowNumber) {
  const numericId = Number(row.id);

  if (!Number.isInteger(numericId)) {
    throw new Error(`Row ${rowNumber} has invalid numeric id.`);
  }

  return {
    id: numericId,
    profileTitle: row.profile_title,
    archiveCode: row.archive_code,
    faction: row.faction,
    roleLabel: row.role_label,
    illustrator: row.illustrator,
    voiceActor: row.voice_actor,
    height: row.height,
    themeColor: row.theme_color,
    birthplace: row.birthplace,
    combatStyle: row.combat_style,
    statusNote: row.status_note,
    overview: row.overview,
    weaponName: row.weapon_name,
    weaponNameZh: row.weapon_name_zh,
    weaponNameEn: row.weapon_name_en,
    weaponImage: row.weapon_image,
    weaponDescription: row.weapon_description,
    equipmentNote: row.equipment_note
  };
}

async function main() {
  const csvText = await fs.readFile(csvPath, "utf8");
  const rows = parseCsv(csvText);

  if (rows.length < 2) {
    throw new Error("character-details.csv must include a header row and at least one data row.");
  }

  const [headers, ...dataRows] = rows;
  assertHeaders(headers);

  const draftRows = [];
  const details = [];

  for (const [index, row] of dataRows.entries()) {
    const record = toRecord(headers, row, index + 2);

    if (isBlankRow(record)) {
      continue;
    }

    if (!isPublishReady(record)) {
      draftRows.push(index + 2);
      continue;
    }

    details.push(toDetail(record, index + 2));
  }

  await fs.writeFile(jsonPath, `${JSON.stringify(details, null, 2)}\n`, "utf8");
  console.log(`Imported ${details.length} character detail rows into ${path.relative(process.cwd(), jsonPath)}.`);

  if (draftRows.length > 0) {
    console.warn(
      `Skipped ${draftRows.length} draft detail rows: ${draftRows.join(", ")}.`
    );
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

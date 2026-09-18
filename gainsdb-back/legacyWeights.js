import { createReadStream } from "fs";
import { createInterface } from "readline";

const fileName = "Legacy_Weights.csv";
const filePath = "./" + fileName;

async function processCsv(filePath) {
  const fileStream = createReadStream(filePath);

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity, // Recognizes all instances of CR LF (\r\n) as a single line break
  });

  let headers = [];
  const results = [];
  let isFirstLine = true;

  for await (const line of rl) {
    // Split the line by commas (basic CSV parsing)
    const row = line.split(",");

    if (isFirstLine) {
      headers = row.map((header) => header.trim());
      isFirstLine = false;
      continue;
    }

    // Map the row values to their respective headers
    const rowObject = {};
    headers.forEach((header, index) => {
      rowObject[header] = row[index] ? row[index].trim() : null;
    });

    results.push(rowObject);
  }

  return results;
}

//!
function normalizeData(data) {
  return data;
}

//!
function seedLegacyWeight(data) {
  return data;
}

processCsv(filePath)
  .then((data) => {
    console.log(data);
    const normalizedData = normalizeData(data);
    seedLegacyWeight(normalizedData);
  })
  .catch((err) => console.error("Error reading file:", err));

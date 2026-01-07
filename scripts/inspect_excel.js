

import pkg from 'xlsx';
const { readFile, utils } = pkg;
import * as path from 'path';

const filePath = path.join(process.cwd(), 'data', 'oliebollen-toernooi-schema.xlsx');

console.log(`Reading file: ${filePath}`);

try {
    const workbook = readFile(filePath);

    workbook.SheetNames.forEach(sheetName => {
        console.log(`\n--- SHEET: ${sheetName} ---`);
        const worksheet = workbook.Sheets[sheetName];
        const data = utils.sheet_to_json(worksheet, { header: 1, limit: 10 });
        console.log(JSON.stringify(data, null, 2));
    });
} catch (e) {
    console.error("Error reading file:", e);
    // Fallback if import style was the issue
    import('xlsx').then(module => {
        console.log("Module keys:", Object.keys(module));
        if (module.default && module.default.readFile) {
            console.log("Found readFile on default");
            const workbook = module.default.readFile(filePath);
            workbook.SheetNames.forEach(sheetName => {
                console.log(`\n--- SHEET: ${sheetName} ---`);
                const worksheet = workbook.Sheets[sheetName];
                const data = module.default.utils.sheet_to_json(worksheet, { header: 1, limit: 10 });
                console.log(JSON.stringify(data, null, 2));
            });
        }
    });
}


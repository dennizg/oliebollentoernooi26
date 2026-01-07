
import pkg from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const { readFile, utils } = pkg;
const filePath = path.join(process.cwd(), 'data', 'oliebollen-toernooi-schema.xlsx');
const outputPath = path.join(process.cwd(), 'src', 'data', 'mockData.js');

console.log(`Reading file: ${filePath}`);
const workbook = readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rawData = utils.sheet_to_json(worksheet, { header: 1 });

// Skip header (row 0)
const rows = rawData.slice(1);

const matches = [];
const teamsPerSport = {
    basketbal: new Set(),
    volleybal: new Set(),
    floorball: new Set()
};

const sportsConfig = [
    { name: 'basketbal', colIndex: 3 },
    { name: 'volleybal', colIndex: 6 },
    { name: 'floorball', colIndex: 9 }
];

const excelTimeToHHMM = (serial) => {
    if (!serial) return '00:00';
    const totalSeconds = Math.round(serial * 86400);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

let matchIdCounter = 1;

rows.forEach((row) => {
    const timeSerial = row[0];
    const timeStr = excelTimeToHHMM(timeSerial);

    // Stop if no time (end of list likely)
    if (!timeSerial) return;

    sportsConfig.forEach(sport => {
        const matchStr = row[sport.colIndex];
        if (!matchStr) return;

        // Check for finals
        const isFinal = matchStr.toLowerCase().includes('finale');
        let type = isFinal ? 'final' : 'group';
        let roundName = isFinal ? matchStr : 'Poulewedsrtijd';

        // Parse Teams
        // Format usually: "1A - 1B1" or "1A - 1B1 (P-A)"
        // Remove content in parenthesis
        const cleanMatchStr = matchStr.replace(/\(.*\)/, '').trim();

        if (isFinal) {
            matches.push({
                id: `generated-${matchIdCounter++}`,
                sport: sport.name,
                team1: 'TBD',
                team2: 'TBD',
                score1: null,
                score2: null,
                status: 'scheduled',
                time: timeStr,
                type: 'final',
                round: matchStr // Keep full name like "Grote Finale"
            });
            return;
        }

        const parts = cleanMatchStr.split(' - ');
        if (parts.length === 2) {
            const team1 = parts[0].trim();
            const team2 = parts[1].trim();

            teamsPerSport[sport.name].add(team1);
            teamsPerSport[sport.name].add(team2);

            matches.push({
                id: `match-${matchIdCounter++}`,
                sport: sport.name,
                team1,
                team2,
                score1: null,
                score2: null,
                status: 'scheduled',
                time: timeStr,
                type: 'group',
                round: roundName
            });
        }
    });
});

// Generate Teams Structure
const TEAMS = {
    basketbal: Array.from(teamsPerSport.basketbal).map(t => ({ id: t, name: t, classId: t.substring(0, 2) })),
    volleybal: Array.from(teamsPerSport.volleybal).map(t => ({ id: t, name: t, classId: t.substring(0, 2) })),
    floorball: Array.from(teamsPerSport.floorball).map(t => ({ id: t, name: t, classId: t.substring(0, 2) }))
};

// Static Data
const CLASSES = [
    { id: '1A', name: 'Klas 1A', color: 'var(--color-class-1a)' },
    { id: '1B', name: 'Klas 1B', color: 'var(--color-class-1b)' },
    { id: '1C', name: 'Klas 1C', color: 'var(--color-class-1c)' },
    { id: '1D', name: 'Klas 1D', color: 'var(--color-class-1d)' },
];

const SPORTS = [
    { id: 'basketbal', name: 'Basketbal', color: 'var(--color-sport-basketbal)' },
    { id: 'volleybal', name: 'Volleybal', color: 'var(--color-sport-volleybal)' },
    { id: 'floorball', name: 'Floorball', color: 'var(--color-sport-floorball)' },
];

// Content to write
const fileContent = `
/**
 * GENERATED DATA from oliebollen-toernooi-schema.xlsx
 */

export const CLASSES = ${JSON.stringify(CLASSES, null, 2)};

export const SPORTS = ${JSON.stringify(SPORTS, null, 2)};

export const TEAMS = ${JSON.stringify(TEAMS, null, 2)};

export const INITIAL_MATCHES = ${JSON.stringify(matches, null, 2)};
`;

console.log(`Writing ${matches.length} matches and teams to ${outputPath}`);
fs.writeFileSync(outputPath, fileContent);

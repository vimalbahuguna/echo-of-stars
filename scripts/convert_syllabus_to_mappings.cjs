const fs = require('fs');
const path = require('path');

// Input syllabus text file
const inputPath = path.resolve(__dirname, '../supabase/.temp/sos_astro_academy.txt');
// Output directory for generated mapping files
const outDir = path.resolve(__dirname, '../supabase/.temp/mappings');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function levelKeyFromNumber(n) {
  if (n === 1) return 'foundation';
  if (n === 2) return 'practitioner';
  if (n === 3) return 'professional';
  if (n === 4) return 'master';
  return null;
}

function normKey(s) {
  return s
    .toLowerCase()
    .replace(/["'`]/g, '')
    .replace(/[()]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSyllabus(text) {
  const lines = text.split(/\r?\n/);
  let currentLevel = null;
  let currentLevelKey = null;
  let currentMonthStart = null;
  let currentMonthEnd = null;
  let currentWeekStart = null;
  let currentWeekEnd = null;
  let currentWeekTitle = '';
  let capturingTopics = false;

  const acc = {
    foundation: [],
    practitioner: [],
    professional: [],
    master: [],
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    // Detect level header
    const levelMatch = line.match(/LEVEL\s+(\d+):/i);
    if (levelMatch) {
      currentLevel = parseInt(levelMatch[1], 10);
      currentLevelKey = levelKeyFromNumber(currentLevel);
      currentMonthStart = null;
      currentMonthEnd = null;
      currentWeekStart = null;
      currentWeekEnd = null;
      capturingTopics = false;
      continue;
    }

    // Detect month line (supports single or range like 4-5)
    const monthMatch = line.match(/^Month\s+(\d+)(?:-(\d+))?:/i);
    if (monthMatch) {
      currentMonthStart = parseInt(monthMatch[1], 10);
      currentMonthEnd = monthMatch[2] ? parseInt(monthMatch[2], 10) : currentMonthStart;
      capturingTopics = false;
      continue;
    }

    // Detect week block line: Week 13-16: Title
    const weekMatch = line.match(/^Week\s+(\d+)-(\d+):\s*(.+)$/i);
    if (weekMatch) {
      currentWeekStart = parseInt(weekMatch[1], 10);
      currentWeekEnd = parseInt(weekMatch[2], 10);
      currentWeekTitle = weekMatch[3].trim();
      capturingTopics = false;
      continue;
    }

    // Start topics capture
    if (/^Topics:/i.test(line)) {
      capturingTopics = true;
      continue;
    }

    // Stop topics capture when a different section begins
    if (/^(Practical:|Time Allocation:|Week\s+\d+-\d+:|Month\s+\d+)/i.test(line)) {
      capturingTopics = false;
      // do not continue; allow outer loop to process new header lines on next iterations
    }

    if (capturingTopics && currentLevelKey) {
      const bulletMatch = line.match(/^[•\-]\s*(.+)$/);
      if (bulletMatch) {
        const topic = bulletMatch[1].trim();
        if (!topic) continue;
        const topic_key = normKey(topic);
        const month_number = currentMonthStart || null;
        const record = {
          language: 'en',
          certification_level: currentLevelKey,
          month_number,
          week_start: currentWeekStart || null,
          week_end: currentWeekEnd || null,
          topic_key,
          topic_text: topic,
          lesson_id: null,
          lesson_slug: null,
          course_id: null,
          source_week_title: currentWeekTitle,
        };
        acc[currentLevelKey].push(record);
      }
    }
  }

  return acc;
}

function toCsv(records) {
  const headers = [
    'language',
    'certification_level',
    'month_number',
    'week_start',
    'week_end',
    'topic_key',
    'topic_text',
    'lesson_id',
    'lesson_slug',
    'course_id',
    'source_week_title',
  ];
  const rows = records.map((r) =>
    headers
      .map((h) => (r[h] ?? ''))
      .map((v) => {
        const s = String(v);
        if (s.includes('"') || s.includes(',') || s.includes('\n')) {
          return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
      })
      .join(',')
  );
  return headers.join(',') + '\n' + rows.join('\n');
}

function main() {
  ensureDir(outDir);
  if (!fs.existsSync(inputPath)) {
    console.error('Input syllabus file not found:', inputPath);
    process.exit(1);
  }
  const text = fs.readFileSync(inputPath, 'utf8');
  const acc = parseSyllabus(text);

  for (const [level, records] of Object.entries(acc)) {
    const jsonPath = path.join(outDir, `${level}.json`);
    const csvPath = path.join(outDir, `${level}.csv`);
    fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2), 'utf8');
    fs.writeFileSync(csvPath, toCsv(records), 'utf8');
    console.log(`Wrote ${records.length} records for ${level} to:`);
    console.log(' -', jsonPath);
    console.log(' -', csvPath);
  }

  console.log('Done. Generated mapping files at:', outDir);
}

main();
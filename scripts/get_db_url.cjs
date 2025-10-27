const fs = require('fs');
const path = require('path');

function getEnvFile() {
  const candidates = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '.env.local'),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {}
  }
  return null;
}

function extractDbUrl(envContent) {
  const m = envContent.match(/^SUPABASE_DB_URL=(.*)$/m);
  if (!m) return null;
  let v = m[1].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  return v;
}

const envPath = getEnvFile();
if (!envPath) {
  console.error('No .env file found with SUPABASE_DB_URL');
  process.exit(1);
}
const envContent = fs.readFileSync(envPath, 'utf8');
const url = extractDbUrl(envContent);
if (!url) {
  console.error('SUPABASE_DB_URL not found in .env');
  process.exit(1);
}
process.stdout.write(url);
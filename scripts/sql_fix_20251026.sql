-- Inspect duplicates
SELECT version, name, status, inserted_at
FROM supabase_migrations.schema_migrations
WHERE version = '20251026'
ORDER BY inserted_at;

-- Delete the reverted duplicate to clear mismatch
DELETE FROM supabase_migrations.schema_migrations
WHERE version = '20251026' AND status = 'reverted';

-- Verify cleanup
SELECT version, name, status, inserted_at
FROM supabase_migrations.schema_migrations
WHERE version = '20251026'
ORDER BY inserted_at;
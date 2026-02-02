-- Create migrations tracking table to prevent re-running migrations
CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Record already executed migrations
INSERT INTO migrations (name) VALUES
  ('001_init.sql'),
  ('002_seed.sql')
ON CONFLICT (name) DO NOTHING;


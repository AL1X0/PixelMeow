-- Table: pixels
CREATE TABLE IF NOT EXISTS pixels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    x INTEGER NOT NULL CHECK (x >= 0 AND x < 500),
    y INTEGER NOT NULL CHECK (y >= 0 AND y < 500),
    color VARCHAR(7) NOT NULL,
    user_id VARCHAR NOT NULL,
    user_name VARCHAR NOT NULL DEFAULT 'Anonymous',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast retrieval
CREATE INDEX IF NOT EXISTS pixels_xy_idx ON pixels(x, y);

-- Leaderboard View
DROP VIEW IF EXISTS leaderboard;
CREATE OR REPLACE VIEW leaderboard AS
SELECT MAX(user_name) as user_name, COUNT(*) AS pixel_count
FROM pixels
GROUP BY user_id
ORDER BY pixel_count DESC
LIMIT 10;

-- Table: user_cooldowns
CREATE TABLE IF NOT EXISTS user_cooldowns (
    user_id VARCHAR PRIMARY KEY,
    last_placed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger for 10-second cooldown
CREATE OR REPLACE FUNCTION check_cooldown() RETURNS trigger AS $$
DECLARE
    last_time TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT last_placed_at INTO last_time FROM user_cooldowns WHERE user_id = NEW.user_id;

    IF last_time IS NOT NULL AND (now() - last_time) < interval '10 seconds' THEN
        RAISE EXCEPTION 'Cooldown active. Please wait 10 seconds.';
    END IF;

    -- Update or insert the last placed time
    INSERT INTO user_cooldowns (user_id, last_placed_at)
    VALUES (NEW.user_id, now())
    ON CONFLICT (user_id) DO UPDATE SET last_placed_at = now();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_cooldown ON pixels;
CREATE TRIGGER enforce_cooldown
BEFORE INSERT ON pixels
FOR EACH ROW EXECUTE PROCEDURE check_cooldown();

-- Enable Row Level Security (RLS)
ALTER TABLE pixels ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cooldowns ENABLE ROW LEVEL SECURITY;

-- Enable Supabase Realtime for pixels table
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE pixels;

-- Setup RLS Policies 
-- Since we use Firebase for Auth instead of Supabase Auth, the Supabase 'anon' key 
-- will be used for all requests. We must allow 'anon' role to insert/select, 
-- but we rely on the Frontend to enforce the Firebase user_id payload.

DROP POLICY IF EXISTS "Pixels are viewable by everyone" ON pixels;
CREATE POLICY "Pixels are viewable by everyone" ON pixels FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert pixels" ON pixels;
DROP POLICY IF EXISTS "Anyone can insert pixels" ON pixels;
CREATE POLICY "Anyone can insert pixels" ON pixels FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Cooldowns are viewable by everyone" ON user_cooldowns;
CREATE POLICY "Cooldowns are viewable by everyone" ON user_cooldowns FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can trigger cooldowns" ON user_cooldowns;
DROP POLICY IF EXISTS "Anyone can trigger cooldowns" ON user_cooldowns;
CREATE POLICY "Anyone can trigger cooldowns" ON user_cooldowns FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update cooldowns" ON user_cooldowns;
DROP POLICY IF EXISTS "Anyone can update cooldowns" ON user_cooldowns;
CREATE POLICY "Anyone can update cooldowns" ON user_cooldowns FOR UPDATE USING (true);

-- Create GIN indexes for full-text search on posts
CREATE INDEX IF NOT EXISTS "posts_content_gin_idx" ON "posts" USING gin(to_tsvector('english', content));

-- Create GIN indexes for full-text search on users
CREATE INDEX IF NOT EXISTS "users_username_gin_idx" ON "users" USING gin(to_tsvector('english', username));
CREATE INDEX IF NOT EXISTS "users_displayName_gin_idx" ON "users" USING gin(to_tsvector('english', "displayName"));

-- Create GIN index for user bio search (optional but useful)
CREATE INDEX IF NOT EXISTS "users_bio_gin_idx" ON "users" USING gin(to_tsvector('english', bio));

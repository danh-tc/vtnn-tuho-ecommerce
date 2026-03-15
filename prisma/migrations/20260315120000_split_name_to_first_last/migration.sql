-- Split name into first_name and last_name
-- Add columns with temporary defaults to handle existing rows
ALTER TABLE "users" ADD COLUMN "first_name" TEXT NOT NULL DEFAULT '';
ALTER TABLE "users" ADD COLUMN "last_name" TEXT NOT NULL DEFAULT '';

-- Migrate existing data: put full name into first_name, leave last_name empty
UPDATE "users" SET "first_name" = "name", "last_name" = '';

-- Drop the old name column
ALTER TABLE "users" DROP COLUMN "name";

-- Remove the temporary defaults
ALTER TABLE "users" ALTER COLUMN "first_name" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "last_name" DROP DEFAULT;

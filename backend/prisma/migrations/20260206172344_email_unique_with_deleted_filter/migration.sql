-- Drop the existing unique constraint on email
DROP INDEX "User_email_key";

-- Create a new unique index that only applies to non-deleted users
-- This allows deleted users' emails to be reused for new registrations
CREATE UNIQUE INDEX "User_email_key" ON "User"("email") WHERE "deletedAt" IS NULL;

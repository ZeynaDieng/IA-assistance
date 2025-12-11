-- Migration: Update assistantName from "Sama" to "Zeii"
UPDATE "UserPreferences"
SET "assistantName" = 'Zeii'
WHERE "assistantName" = 'Sama' OR "assistantName" IS NULL;

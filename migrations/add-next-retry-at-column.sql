-- Migration: Add next_retry_at column to form_submissions table
-- This column is required for the bulletproof registration system's exponential backoff feature
-- Date: 2025-11-12

-- Add the next_retry_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'form_submissions' 
    AND column_name = 'next_retry_at'
  ) THEN
    ALTER TABLE form_submissions 
    ADD COLUMN next_retry_at timestamp;
    
    RAISE NOTICE 'Column next_retry_at added successfully';
  ELSE
    RAISE NOTICE 'Column next_retry_at already exists';
  END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'form_submissions' 
AND column_name = 'next_retry_at';

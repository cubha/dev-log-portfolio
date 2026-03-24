-- Create inquiries table for contact messages
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  reply TEXT NULL,
  replied_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view public inquiries
CREATE POLICY "Anyone can view public inquiries"
  ON public.inquiries
  FOR SELECT
  USING (is_public = true);

-- Policy: Anyone can insert inquiries
CREATE POLICY "Anyone can insert inquiries"
  ON public.inquiries
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can update their own inquiries (password verification handled in app)
CREATE POLICY "Anyone can update inquiries"
  ON public.inquiries
  FOR UPDATE
  USING (true);

-- Policy: Users can delete their own inquiries (password verification handled in app)
CREATE POLICY "Anyone can delete inquiries"
  ON public.inquiries
  FOR DELETE
  USING (true);

-- Add index for performance
CREATE INDEX inquiries_created_at_idx ON public.inquiries(created_at DESC);
CREATE INDEX inquiries_is_public_idx ON public.inquiries(is_public);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_inquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inquiries_timestamp
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_inquiries_updated_at();

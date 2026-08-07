-- Create blog_posts table for TechBlog feature (Phase 11)
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published posts
CREATE POLICY "Published posts are public"
  ON public.blog_posts
  FOR SELECT
  USING (status = 'published');

-- Policy: Author can read all own posts (including drafts)
CREATE POLICY "Author can read own posts"
  ON public.blog_posts
  FOR SELECT
  USING (auth.uid() = author_id);

-- Policy: Author can insert posts
CREATE POLICY "Author can insert posts"
  ON public.blog_posts
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Policy: Author can update own posts
CREATE POLICY "Author can update own posts"
  ON public.blog_posts
  FOR UPDATE
  USING (auth.uid() = author_id);

-- Policy: Author can delete own posts
CREATE POLICY "Author can delete own posts"
  ON public.blog_posts
  FOR DELETE
  USING (auth.uid() = author_id);

-- Indexes
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_status_published_at ON public.blog_posts(status, published_at DESC);
CREATE INDEX idx_blog_posts_author_id ON public.blog_posts(author_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_timestamp
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

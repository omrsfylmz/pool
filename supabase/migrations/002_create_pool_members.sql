-- Create pool_members table
CREATE TABLE IF NOT EXISTS public.pool_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pool_id UUID REFERENCES public.pools(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(pool_id, user_id)
);

-- Enable RLS
ALTER TABLE public.pool_members ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view pool members" ON public.pool_members
  FOR SELECT USING (true);

CREATE POLICY "Users can join pools" ON public.pool_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave pools" ON public.pool_members
  FOR DELETE USING (auth.uid() = user_id);

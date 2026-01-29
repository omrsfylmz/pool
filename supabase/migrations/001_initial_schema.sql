-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_animal TEXT NOT NULL,
  avatar_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create pools table
CREATE TABLE IF NOT EXISTS public.pools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  voting_duration_minutes INTEGER NOT NULL DEFAULT 60,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create food_options table
CREATE TABLE IF NOT EXISTS public.food_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pool_id UUID REFERENCES public.pools(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create votes table
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pool_id UUID REFERENCES public.pools(id) ON DELETE CASCADE NOT NULL,
  food_option_id UUID REFERENCES public.food_options(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(pool_id, user_id)
);

-- Create medals table
CREATE TABLE IF NOT EXISTS public.medals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT,
  unlock_criteria JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_medals table
CREATE TABLE IF NOT EXISTS public.user_medals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  medal_id UUID REFERENCES public.medals(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, medal_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_medals ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Pools policies
CREATE POLICY "Users can view all pools" ON public.pools
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create pools" ON public.pools
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Pool creators can update their pools" ON public.pools
  FOR UPDATE USING (auth.uid() = creator_id);

-- Food options policies
CREATE POLICY "Users can view all food options" ON public.food_options
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create food options" ON public.food_options
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Food option creators can delete their options" ON public.food_options
  FOR DELETE USING (auth.uid() = creator_id);

-- Votes policies
CREATE POLICY "Users can view votes for active pools" ON public.votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert votes" ON public.votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON public.votes
  FOR DELETE USING (auth.uid() = user_id);

-- Medals policies
CREATE POLICY "Users can view all medals" ON public.medals
  FOR SELECT USING (true);

-- User medals policies
CREATE POLICY "Users can view all user medals" ON public.user_medals
  FOR SELECT USING (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  random_animal TEXT;
  animal_name TEXT;
  animals TEXT[] := ARRAY['🦁', '🐼', '🦊', '🐨', '🦒', '🐻', '🐯', '🐸', '🦉', '🐺'];
  animal_names TEXT[] := ARRAY['Lion', 'Panda', 'Fox', 'Koala', 'Giraffe', 'Bear', 'Tiger', 'Frog', 'Owl', 'Wolf'];
  random_index INTEGER;
BEGIN
  -- Select a random animal
  random_index := floor(random() * array_length(animals, 1) + 1)::INTEGER;
  random_animal := animals[random_index];
  animal_name := animal_names[random_index];

  INSERT INTO public.profiles (id, email, full_name, avatar_animal, avatar_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    random_animal,
    'Anonymous ' || animal_name
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some default medals
INSERT INTO public.medals (name, icon, description, unlock_criteria) VALUES
  ('Burger Monster', 'hamburger', 'Vote for burgers 10 times', '{"type": "vote_count", "food_type": "burger", "count": 10}'),
  ('Sushi Sensei', 'fish', 'Eat at sushi restaurants 5 times', '{"type": "visit_count", "food_type": "sushi", "count": 5}'),
  ('Salad Sage', 'leaf', 'Choose healthy options 15 times', '{"type": "vote_count", "food_type": "salad", "count": 15}'),
  ('Pizza Party', 'pizza-slice', 'Vote for pizza 8 times', '{"type": "vote_count", "food_type": "pizza", "count": 8}')
ON CONFLICT DO NOTHING;

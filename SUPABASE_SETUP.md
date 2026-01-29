# Supabase Setup Instructions

## Step 1: Install Dependencies

Run this command in your project directory:

```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

Or if using Expo:

```bash
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

## Step 2: Run Database Migration

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Click on your project: `gfmasydzclkijhynlmdw`
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
6. Paste it into the SQL editor
7. Click **Run** to execute the migration

This will create all the necessary tables, policies, and triggers.

## Step 3: Verify Database Setup

After running the migration, verify in the **Table Editor**:
- ✅ `profiles` table exists
- ✅ `pools` table exists
- ✅ `food_options` table exists
- ✅ `votes` table exists
- ✅ `medals` table exists (with 4 default medals)
- ✅ `user_medals` table exists

## Step 4: Configure OAuth (Optional)

### Google OAuth
1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Enable **Google** provider
3. Add your OAuth credentials from Google Cloud Console

### Apple OAuth
1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Enable **Apple** provider
3. Add your OAuth credentials from Apple Developer

## Step 5: Test the App

1. Start your app: `npm start` or `npx expo start`
2. Try signing up with email/password
3. Check Supabase dashboard → **Authentication** → **Users** to see the new user
4. Check **Table Editor** → **profiles** to see the auto-created profile with animal avatar

## Troubleshooting

### "Cannot find module" errors
Make sure you've run the npm install command and restarted your development server.

### "Invalid API key" errors
Double-check that your `.env` file has the correct Supabase URL and anon key.

### Database errors
Make sure you've run the SQL migration script in the Supabase dashboard.

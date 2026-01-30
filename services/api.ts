import { supabase } from "../lib/supabase";

// ============================================
// POOL OPERATIONS
// ============================================

export interface Pool {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  voting_duration_minutes: number;
  ends_at: string;
  status: "active" | "ended";
  created_at: string;
  join_code: string;
}

// Helper function to generate unique 6-character join code
function generateJoinCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createPool(
  title: string,
  description: string,
  durationMinutes: number
) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const endsAt = new Date();
  
  // Handle fractional minutes (e.g., 0.1667 for 10 seconds)
  if (durationMinutes < 1) {
    // Convert to seconds and add
    const seconds = Math.round(durationMinutes * 60);
    endsAt.setSeconds(endsAt.getSeconds() + seconds);
  } else {
    endsAt.setMinutes(endsAt.getMinutes() + durationMinutes);
  }

  // Store as integer (round up fractional minutes to 1)
  const storageDuration = durationMinutes < 1 ? 1 : Math.round(durationMinutes);

  // Generate unique join code
  let joinCode = generateJoinCode();
  let isUnique = false;
  
  // Ensure code is unique (retry if collision)
  while (!isUnique) {
    const { data: existing } = await supabase
      .from('pools')
      .select('id')
      .eq('join_code', joinCode)
      .single();
    
    if (!existing) {
      isUnique = true;
    } else {
      joinCode = generateJoinCode();
    }
  }

  const { data, error } = await supabase
    .from("pools")
    .insert({
      creator_id: user.id,
      title,
      description,
      voting_duration_minutes: storageDuration,
      ends_at: endsAt.toISOString(),
      status: "active",
      join_code: joinCode,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Pool;
}

export async function getActivePool() {
  const { data, error } = await supabase
    .from("pools")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
  return data as Pool | null;
}

/**
 * Find a pool by its join code
 */
export async function getPoolByJoinCode(joinCode: string): Promise<Pool | null> {
  const { data, error } = await supabase
    .from('pools')
    .select('*')
    .eq('join_code', joinCode.toUpperCase())
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error finding pool by join code:', error);
    throw error;
  }

  return data as Pool;
}

export async function getPastPolls(limit: number = 10) {
  const { data, error } = await supabase
    .from("pools")
    .select("*")
    .eq("status", "ended")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Pool[];
}

export async function endPool(poolId: string) {
  const { error } = await supabase
    .from("pools")
    .update({ status: "ended" })
    .eq("id", poolId);

  if (error) throw error;
}

// ============================================
// FOOD OPTION OPERATIONS
// ============================================

export interface FoodOption {
  id: string;
  pool_id: string;
  creator_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export async function addFoodOption(
  poolId: string,
  name: string,
  description: string
) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("food_options")
    .insert({
      pool_id: poolId,
      creator_id: user.id,
      name,
      description,
    })
    .select()
    .single();

  if (error) throw error;
  return data as FoodOption;
}

export async function getFoodOptions(poolId: string) {
  const { data, error } = await supabase
    .from("food_options")
    .select("*")
    .eq("pool_id", poolId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as FoodOption[];
}

export async function deleteFoodOption(optionId: string) {
  const { error } = await supabase
    .from("food_options")
    .delete()
    .eq("id", optionId);

  if (error) throw error;
}

// ============================================
// VOTE OPERATIONS
// ============================================

export interface Vote {
  id: string;
  pool_id: string;
  food_option_id: string;
  user_id: string;
  created_at: string;
}

export async function castVote(poolId: string, foodOptionId: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  // Delete existing vote for this pool (if any)
  await supabase.from("votes").delete().eq("pool_id", poolId).eq("user_id", user.id);

  // Insert new vote
  const { data, error } = await supabase
    .from("votes")
    .insert({
      pool_id: poolId,
      food_option_id: foodOptionId,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Vote;
}

export async function removeVote(poolId: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("votes")
    .delete()
    .eq("pool_id", poolId)
    .eq("user_id", user.id);

  if (error) throw error;
}

export async function getVoteResults(poolId: string) {
  const { data, error } = await supabase
    .from("votes")
    .select(
      `
      id,
      food_option_id,
      user_id,
      profiles:user_id (avatar_animal)
    `
    )
    .eq("pool_id", poolId);

  if (error) throw error;

  // Group votes by food option
  const votesByOption: Record<
    string,
    { count: number; voters: string[] }
  > = {};

  data.forEach((vote: any) => {
    if (!votesByOption[vote.food_option_id]) {
      votesByOption[vote.food_option_id] = { count: 0, voters: [] };
    }
    votesByOption[vote.food_option_id].count++;
    votesByOption[vote.food_option_id].voters.push(vote.profiles.avatar_animal);
  });

  return votesByOption;
}

export async function getUserVote(poolId: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("pool_id", poolId)
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as Vote | null;
}

export async function getVotesForPool(poolId: string) {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("pool_id", poolId);

  if (error) throw error;
  return data as Vote[];
}

// ============================================
// PROFILE OPERATIONS
// ============================================

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_animal: string;
  avatar_name: string;
  created_at: string;
  updated_at: string;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

// ============================================
// MEDAL OPERATIONS
// ============================================

export interface Medal {
  id: string;
  name: string;
  icon: string;
  description: string | null;
  unlock_criteria: any;
  created_at: string;
}

export interface UserMedal {
  id: string;
  user_id: string;
  medal_id: string;
  earned_at: string;
  medal: Medal;
}

export async function getUserMedals(userId: string) {
  const { data, error } = await supabase
    .from("user_medals")
    .select(
      `
      *,
      medal:medals (*)
    `
    )
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });

  if (error) throw error;
  return data as UserMedal[];
}

export async function getAllMedals() {
  const { data, error } = await supabase
    .from("medals")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Medal[];
}

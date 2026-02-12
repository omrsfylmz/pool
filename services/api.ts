import { supabase } from "../lib/supabase";
import { stopPoolLiveActivity } from "./LiveActivityService";

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

  // Add creator to pool members automatically
  if (data) {
    await joinPoolMember(data.id);
  }

  return data as Pool;
}


/**
 * Join a pool as a member
 */
export async function joinPoolMember(poolId: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  // Check if already a member
  const { data: existing } = await supabase
    .from("pool_members")
    .select("id")
    .eq("pool_id", poolId)
    .eq("user_id", user.id)
    .single();

  if (existing) return;

  const { error } = await supabase
    .from("pool_members")
    .insert({
      pool_id: poolId,
      user_id: user.id
    });

  if (error) throw error;
}

/**
 * Get active pool for the current user (created by them or joined by them)
 */
export async function getActivePool(userId: string) {
  const now = new Date().toISOString();
  
  // 1. Get pools created by user
  const { data: createdPools } = await supabase
    .from("pools")
    .select("*")
    .eq("creator_id", userId)
    .eq("status", "active")
    .gt("ends_at", now)
    .order("created_at", { ascending: false })
    .limit(1);

  // 2. Get pools user is a member of
  const { data: memberPools } = await supabase
    .from("pool_members")
    .select("pool_id, pools(*)")
    .eq("user_id", userId);

  let joinedPools: Pool[] = [];
  if (memberPools && memberPools.length > 0) {
    // Filter manually for active status since it's a join
    joinedPools = memberPools
      .map((mp: any) => mp.pools)
      .filter((p: Pool) => 
        p.status === "active" && 
        new Date(p.ends_at) > new Date()
      );
  }

  // Combine and find the most recent one
  const allPools = [...(createdPools || []), ...joinedPools];
  
  if (allPools.length === 0) return null;

  // Sort by creation date descending
  allPools.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  return allPools[0];
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

export async function getPastPolls(userId: string, limit: number = 10) {
  // Get pools user is a member of (including ones they created)
  const { data: joined } = await supabase
    .from("pool_members")
    .select("pool_id")
    .eq("user_id", userId);

  if (!joined || joined.length === 0) return [];

  const poolIds = joined.map(p => p.pool_id);

  // Fetch pools with creator profile
  const { data: pools } = await supabase
    .from("pools")
    .select(`
      *,
      creator:creator_id (
        avatar_animal
      )
    `)
    .in("id", poolIds)
    .eq("status", "ended")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!pools) return [];

  // 4. Fetch avatars for each pool
  const poolsWithData = await Promise.all(pools.map(async (pool: any) => {
    const { data: members } = await supabase
      .from("pool_members")
      .select(`
        profiles (
          avatar_animal
        )
      `)
      .eq("pool_id", pool.id)
      .limit(3);

    const memberAvatars = members?.map((m: any) => m.profiles?.avatar_animal).filter(Boolean) || [];
    
    // Add creator avatar if available and not already in list
    const creatorAvatar = pool.creator?.avatar_animal;
    const allAvatars = creatorAvatar ? [creatorAvatar, ...memberAvatars] : memberAvatars;
    // Unique avatars
    const uniqueAvatars = [...new Set(allAvatars)].slice(0, 3);

    return {
      ...pool,
      participant_avatars: uniqueAvatars.length > 0 ? uniqueAvatars : ["👤"]
    };
  }));

  return poolsWithData;
}

/**
 * Leave a pool (effectively deleting it from the user's history/dashboard)
 */
export async function leavePool(poolId: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("pool_members")
    .delete()
    .eq("pool_id", poolId)
    .eq("user_id", user.id);

  if (error) throw error;
}



export async function updatePushToken(token: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;

  const { error } = await supabase
    .from("profiles")
    .update({ expo_push_token: token })
    .eq("id", user.id);

  if (error) {
     console.error("Error updating push token:", error);
     throw error;
  }

}

export async function deleteAccount() {
  const { error } = await supabase.rpc('delete_user');
  if (error) throw error;
}

export async function sendPoolCompletionNotification(poolId: string) {
  try {

    // 1. Get pool details
    const { data: pool } = await supabase
      .from("pools")
      .select("title")
      .eq("id", poolId)
      .single();

    if (!pool) return;

    // 2. Get all participants
    const { data: members } = await supabase
      .from("pool_members")
      .select("user_id")
      .eq("pool_id", poolId);

    if (!members || members.length === 0) return;

    // 3. Get push tokens for these users
    const memberIds = members.map(m => m.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("expo_push_token")
      .in("id", memberIds)
      .not("expo_push_token", "is", null);

    if (!profiles || profiles.length === 0) return;

    // 4. Send notifications
    const tokens = profiles.map(p => p.expo_push_token).filter(Boolean);
    
    // Prepare notifications
    const notifications = tokens.map(token => ({
      to: token,
      sound: 'default',
      title: "Pool Complete! 🏁",
      body: `"${pool.title}" is complete. Check the results!`,
      data: { url: `/winner?poolId=${poolId}` },
    }));

    // Send in batches (Expo limit is 100)
    const chunks = [];
    for (let i = 0; i < notifications.length; i += 100) {
      chunks.push(notifications.slice(i, i + 100));
    }

    for (const chunk of chunks) {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chunk),
      });
    }

  } catch (error) {
    console.error("Error sending completion notifications:", error);
  }
}

export async function endPool(poolId: string) {
  // Get all votes for this pool
  const { data: votes } = await supabase
    .from("votes")
    .select("food_option_id")
    .eq("pool_id", poolId);

  // Count votes per option
  const voteCounts: Record<string, number> = {};
  votes?.forEach((vote) => {
    voteCounts[vote.food_option_id] = (voteCounts[vote.food_option_id] || 0) + 1;
  });

  // Find winner (option with most votes)
  let winnerId: string | null = null;
  let maxVotes = 0;
  for (const [optionId, count] of Object.entries(voteCounts)) {
    if (count > maxVotes) {
      maxVotes = count;
      winnerId = optionId;
    }
  }

  // Update pool with winner and ended status
  const { data, error } = await supabase
    .from("pools")
    .update({ 
      status: "ended",
      winner_id: winnerId 
    })
    .eq("id", poolId)
    .eq("status", "active") // Guard against race conditions
    .select();

  if (error) throw error;

  // Only send notifications if we were the one who effectively ended the pool
  if (data && data.length > 0) {
    // Stop the Dynamic Island Live Activity with completion message
    stopPoolLiveActivity('Voting has ended! Tap to see results.');
    await sendPoolCompletionNotification(poolId);
  }
}

/**
 * Check for expiried active pools and end them (Lazy Expiration)
 * This ensures notifications are sent even if the app was closed when the pool ended
 */
export async function checkAndEndExpiredPools(userId: string) {
  try {
    const now = new Date().toISOString();
    
    // 1. Find all active pools involving this user that have expired
    
    // Get pools created by user
    const { data: createdPools } = await supabase
      .from("pools")
      .select("id")
      .eq("creator_id", userId)
      .eq("status", "active")
      .lte("ends_at", now);

    // Get pools user is a member of
    const { data: memberPools } = await supabase
      .from("pool_members")
      .select("pool_id, pools!inner(id, status, ends_at)")
      .eq("user_id", userId)
      .eq("pools.status", "active")
      .lte("pools.ends_at", now);

    // Combine pool IDs
    const poolIdsToProcess = new Set<string>();
    
    createdPools?.forEach(p => poolIdsToProcess.add(p.id));
    
    memberPools?.forEach((mp: any) => {
      // The inner join filter might return the structure differently depending on supabase client version,
      // but typically with !inner and filtering on relation, we get the hits.
      if (mp.pools) {
        poolIdsToProcess.add(mp.pools.id);
      }
    });



    if (poolIdsToProcess.size === 0) {

      return;
    }



    // 2. End each pool
    // We process sequentially to avoid overwhelming the client/connection although parallel would be faster
    for (const poolId of poolIdsToProcess) {
      await endPool(poolId);
    }
  } catch (error) {
    console.error("Error checking expired pools:", error);
  }
}

// ============================================
// MEDAL SYSTEM
// ============================================

export interface FoodMedal {
  icon: string;
  name: string;
  wins: number;
  totalPools: number;
  percentage: number;
}

export async function getUserMedals(userId: string): Promise<FoodMedal[]> {
  // Get all pools user participated in
  const { data: userPools } = await supabase
    .from("pool_members")
    .select("pool_id")
    .eq("user_id", userId);

  if (!userPools || userPools.length === 0) {
    return [];
  }

  const poolIds = userPools.map((p) => p.pool_id);

  // Get winners from those pools
  const { data: pools } = await supabase
    .from("pools")
    .select(`
      winner_id,
      food_options!pools_winner_id_fkey (
        icon,
        name
      )
    `)
    .in("id", poolIds)
    .eq("status", "ended")
    .not("winner_id", "is", null);

  if (!pools || pools.length === 0) {
    return [];
  }

  // Count wins by icon (exclude utensils)
  const medalCounts: Record<string, { name: string; wins: number }> = {};

  pools.forEach((pool: any) => {
    const foodOption = pool.food_options;
    if (foodOption && foodOption.icon && foodOption.icon !== "silverware-fork-knife") {
      if (!medalCounts[foodOption.icon]) {
        medalCounts[foodOption.icon] = { name: foodOption.name, wins: 0 };
      }
      medalCounts[foodOption.icon].wins++;
    }
  });

  // Convert to array and calculate percentages
  const totalPools = pools.length;
  const medals: FoodMedal[] = Object.entries(medalCounts).map(([icon, data]) => ({
    icon,
    name: data.name,
    wins: data.wins,
    totalPools,
    percentage: Math.round((data.wins / totalPools) * 100),
  }));

  // Sort by wins (descending)
  return medals.sort((a, b) => b.wins - a.wins);
}

// ============================================
// ACHIEVEMENT MEDALS
// ============================================

export interface AchievementMedal {
  id: string;
  achievement_type: string;
  food_icon: string;
  food_name: string | null;
  earned_at: string;
  metadata?: any;
}

export async function getUserAchievements(userId: string): Promise<AchievementMedal[]> {
  try {
    const { data, error } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false });

    if (error) {
      // If table doesn't exist yet, return empty array
      if (error.code === 'PGRST205' || error.code === '42P01') {

        return [];
      }
      throw error;
    }
    return (data || []) as AchievementMedal[];
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
}

export async function awardAchievement(
  userId: string,
  achievementType: string,
  foodIcon: string = "star",
  foodName: string | null = null,
  metadata: any = null
) {
  try {
    const { data, error } = await supabase
      .from("user_achievements")
      .insert({
        user_id: userId,
        achievement_type: achievementType,
        food_icon: foodIcon,
        food_name: foodName,
        metadata,
      })
      .select()
      .single();

    if (error) throw error;
    return data as AchievementMedal;
  } catch (error) {
    console.error('Error awarding achievement:', error);
    throw error;
  }
}

// Award newcomer badge to new users
export async function awardNewcomerBadge(userId: string) {
  try {
    // Check if user already has the badge
    const { data: existing } = await supabase
      .from("user_achievements")
      .select("id")
      .eq("user_id", userId)
      .eq("achievement_type", "newcomer")
      .single();

    if (existing) {
      return; // Already has the badge
    }

    // Award the badge
    await awardAchievement(userId, "newcomer", "user-plus", "Welcome to FoodPool!");
  } catch (error) {
    console.error('Error awarding newcomer badge:', error);
  }
}

export async function checkAchievement(
  userId: string,
  achievementType: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_achievements")
    .select("id")
    .eq("user_id", userId)
    .eq("achievement_type", achievementType)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return !!data;
}

// Check and award "first win" achievements after pool ends
export async function checkAndAwardFirstWinAchievements(
  userId: string,
  winnerIcon: string,
  winnerName: string
): Promise<void> {
  // Skip default icon
  if (winnerIcon === 'utensils') return;

  const achievementType = `first_${winnerIcon.replace('-', '_')}_win`;
  
  // Check if user already has this achievement
  const hasAchievement = await checkAchievement(userId, achievementType);
  
  if (!hasAchievement) {
    await awardAchievement(userId, achievementType, winnerIcon, winnerName);
  }
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
  icon?: string;
  created_at: string;
}

export async function addFoodOption(
  poolId: string,
  name: string,
  description: string,
  icon?: string
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
      icon: icon || 'silverware-fork-knife',
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

export async function clonePoolOptions(oldPoolId: string, newPoolId: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  // 1. Get old pool options
  const start = Date.now();
  const options = await getFoodOptions(oldPoolId);
  
  if (!options || options.length === 0) return;

  // 2. Prepare new options
  const newOptions = options.map(opt => ({
    pool_id: newPoolId,
    creator_id: user.id, // The new pool creator owns these copies
    name: opt.name,
    description: opt.description,
    icon: opt.icon,
  }));

  // 3. Insert new options
  const { error } = await supabase
    .from("food_options")
    .insert(newOptions);

  if (error) {
    console.error("Error cloning options:", error);
    throw error;
  }
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

// Get pool results with vote counts and food options
export interface PoolResult {
  pool: Pool;
  results: Array<{
    id: string;
    name: string;
    description: string | null;
    icon: string;
    voteCount: number;
    avatars: string[];
    rank: number;
    isWinner: boolean;
  }>;
  totalVotes: number;
}

export async function getPoolResults(poolId: string): Promise<PoolResult> {
  // Get pool details
  const { data: pool, error: poolError } = await supabase
    .from("pools")
    .select("*")
    .eq("id", poolId)
    .single();

  if (poolError) throw poolError;

  // Get food options with vote counts
  const { data: foodOptions, error: foodError } = await supabase
    .from("food_options")
    .select("*")
    .eq("pool_id", poolId);

  if (foodError) throw foodError;

  // Get all votes for this pool with user profiles
  const { data: votes, error: votesError } = await supabase
    .from("votes")
    .select(`
      food_option_id,
      profiles:user_id (
        avatar_animal
      )
    `)
    .eq("pool_id", poolId);

  if (votesError) throw votesError;

  // Count votes per option and collect avatars
  const voteCounts: Record<string, number> = {};
  const voteAvatars: Record<string, string[]> = {};

  votes?.forEach((vote: any) => {
    const optionId = vote.food_option_id;
    voteCounts[optionId] = (voteCounts[optionId] || 0) + 1;
    
    // Collect avatar
    if (vote.profiles?.avatar_animal) {
      if (!voteAvatars[optionId]) voteAvatars[optionId] = [];
      voteAvatars[optionId].push(vote.profiles.avatar_animal);
    }
  });

  // Build results array
  const results = foodOptions.map((option) => ({
    id: option.id,
    name: option.name,
    description: option.description,
    icon: option.icon,
    voteCount: voteCounts[option.id] || 0,
    avatars: voteAvatars[option.id] || [], // Pass raw helper strings, UI will map them
    rank: 0, // Will be calculated below
    isWinner: pool.winner_id === option.id,
  }));

  // Sort by vote count (descending)
  results.sort((a, b) => b.voteCount - a.voteCount);

  // Assign ranks
  results.forEach((result, index) => {
    result.rank = index + 1;
  });

  return {
    pool: pool as Pool,
    results,
    totalVotes: votes?.length || 0,
  };
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

// Update user profile
export const updateProfile = async (
  userId: string, 
  updates: { full_name?: string; avatar_url?: string; avatar_animal?: string }
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ============================================
// MEDAL OPERATIONS (Legacy - can be removed)
// ============================================


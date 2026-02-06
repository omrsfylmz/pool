import { Session, User } from "@supabase/supabase-js";
import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { awardNewcomerBadge, checkAndEndExpiredPools, updatePushToken } from "../services/api";
import { registerForPushNotificationsAsync } from "../services/NotificationService";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithApple: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.log("Error getting session:", error.message);
        // If refresh token is invalid, ensure we are signed out and redirect
        if (error.message.includes("Refresh Token") || error.message.includes("refresh_token")) {
           supabase.auth.signOut();
           router.replace("/");
           setLoading(false);
           return;
        }
      }

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Run lazy expiration check on initial load
      if (session?.user) {
        checkAndEndExpiredPools(session.user.id);
      }
    });


    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Auth state changed: ${event}`);
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setLoading(false);
        router.replace("/");
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Register for push notifications if logged in
      if (session?.user) {
        try {
          const token = await registerForPushNotificationsAsync();
          if (token) {
            await updatePushToken(token);
          }
          
          // Check for any expired pools that need to be finalized (lazy expiration)
          // This ensures notifications are sent for pools that ended while app was closed
          await checkAndEndExpiredPools(session.user.id);

        } catch (error) {
          console.error("Error configuring push notifications:", error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    // Award newcomer badge to new user
    if (!error && data.user) {
      try {
        await awardNewcomerBadge(data.user.id);
      } catch (badgeError) {
        console.error('Error awarding newcomer badge:', badgeError);
        // Don't fail signup if badge award fails
      }
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    return { error };
  };

  const signInWithApple = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

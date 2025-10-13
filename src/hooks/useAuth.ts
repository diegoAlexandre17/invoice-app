import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../supabase/client";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener el usuario actual
    const getCurrentUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error getting current user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Obtener usuario inicial
    getCurrentUser();

    // Limpiar suscripción
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signOut,
  };
};

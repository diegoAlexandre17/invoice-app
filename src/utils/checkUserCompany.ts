import { supabase } from "@/supabase/client";
import type { Customers } from "@/views/customers/types";

/**
 * Verifica si un usuario está relacionado con una empresa
 * @param userId - ID del usuario de Supabase
 * @returns Promise que resuelve a true si está relacionado, false si no
 */
export async function checkUserCompany(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('company')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (error) {
      console.error('Error checking user company:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking user company:', error);
    return false;
  }
}

/**
 * Obtiene los datos de la empresa asociada a un usuario
 * @param userId - ID del usuario de Supabase
 * @returns Promise que resuelve a los datos de la empresa o null si no tiene empresa
 */
export async function getUserCompany(userId: string): Promise<Customers | null> {
  try {
    const { data, error } = await supabase
      .from('company')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error getting user company:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting user company:', error);
    return null;
  }
}

/**
 * Verifica si un usuario tiene una empresa asociada (alias de checkUserCompany)
 * @param userId - ID del usuario de Supabase
 * @returns Promise que resuelve a true si tiene empresa, false si no
 */
export async function hasUserCompany(userId: string): Promise<boolean> {
  return await checkUserCompany(userId);
}

/**
 * Verifica si el usuario autenticado actual está relacionado con una empresa
 * @returns Promise que resuelve a true si tiene empresa, false si no
 */
export async function getCurrentUserCompany(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    return await checkUserCompany(user.id);
  } catch (error) {
    console.error('Error getting current user company:', error);
    return false;
  }
}

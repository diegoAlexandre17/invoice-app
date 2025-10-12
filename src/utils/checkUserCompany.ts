import { supabase } from "@/supabase/client";

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

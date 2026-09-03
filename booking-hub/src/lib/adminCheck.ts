import { supabase } from './supabaseClient';

export async function isAdmin(email: string): Promise<boolean> {
  if (!email) return false;

  const { data, error } = await supabase
    .from('admin_config')
    .select('*')
    .eq('sender_email', email)
    .single();

  if (error || !data) {
    return false;
  }

  return true;
}

export async function getCurrentUserEmail(): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user.email || null;
}

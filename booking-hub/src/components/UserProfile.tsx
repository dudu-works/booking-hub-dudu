import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface User {
  email: string | undefined;
  user_metadata?: {
    avatar_url?: string;
    name?: string;
  };
}

interface UserProfileProps {
  onLogout?: () => void;
}

export function UserProfile({ onLogout }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user as User || null);
      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as User || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout?.();
  };

  if (loading) {
    return <div className="text-sm text-gray-600">로딩 중...</div>;
  }

  if (!user?.email) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {user.user_metadata?.avatar_url && (
        <img
          src={user.user_metadata.avatar_url}
          alt="프로필"
          className="w-8 h-8 rounded-full border-2 border-gray-300"
        />
      )}
      <div className="text-right">
        <div className="text-sm font-semibold text-gray-800">{user.user_metadata?.name || user.email}</div>
        <div className="text-xs text-gray-500">{user.email}</div>
      </div>
      <button
        onClick={handleLogout}
        className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
      >
        로그아웃
      </button>
    </div>
  );
}

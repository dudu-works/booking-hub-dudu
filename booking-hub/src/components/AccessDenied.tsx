import { supabase } from '../lib/supabaseClient';

export function AccessDenied() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-12 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">접근 거부</h1>
        <p className="text-gray-600 mb-6">
          이 서비스는 승인된 관리자만 접근할 수 있습니다.
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-700 transition"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

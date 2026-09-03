import { supabase } from '../lib/supabaseClient';

export function LoginPage() {
  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });

    if (error) {
      console.error('Google 로그인 실패:', error);
      alert('로그인 실패: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-12 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">예약 관리 허브</h1>
        <p className="text-gray-600 text-center mb-8">Google 계정으로 로그인하세요</p>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4m0-4v0" />
          </svg>
          Google로 로그인
        </button>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            admin_config에 등록된 이메일만 관리자 기능에 접근할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

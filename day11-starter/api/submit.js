// Vercel 서버리스 함수 - "선생님 신청하기" 지원서를 Supabase에 저장한다.
// 키는 코드에 쓰지 않는다. Vercel 환경변수(SUPABASE_URL, SUPABASE_ANON_KEY)에서 읽는다.
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const t0 = Date.now();

  if (req.method !== "POST") return res.status(405).json({ error: "POST만 받습니다" });

  const { name, contact, level, availability, experience, motivation } = req.body || {};
  if (!name || !contact || !level || !availability) {
    console.log(JSON.stringify({ event: "submit", ok: false, duration_ms: Date.now() - t0 }));
    return res.status(400).json({ error: "name, contact, level, availability가 필요합니다" });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  const { error } = await supabase
    .from("applications")
    .insert({ name, contact, level, availability, experience: experience || null, motivation: motivation || null });

  if (error) {
    console.log(JSON.stringify({ event: "submit", ok: false, duration_ms: Date.now() - t0 }));
    return res.status(500).json({ error: error.message });
  }

  // 처리 시간을 구조화 로그로 남긴다 - Vercel Logs 탭에서 duration_ms로 응답 시간을 읽을 수 있다.
  console.log(JSON.stringify({ event: "submit", ok: true, duration_ms: Date.now() - t0 }));
  return res.status(200).json({ ok: true });
}

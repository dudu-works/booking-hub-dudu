// Vercel 서버리스 함수 - applications 목록을 읽고 필터링해 반환한다.
// contact는 절대 보내지 않는다 (보안).
// name은 첫 글자만 남기고 나머지는 **로 가린다 (개인정보 보호).
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const t0 = Date.now();

  if (req.method !== "GET") return res.status(405).json({ error: "GET만 받습니다" });

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  const { data, error } = await supabase
    .from("applications")
    .select("id, name, subject, motivation, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(JSON.stringify({ event: "list", ok: false, duration_ms: Date.now() - t0 }));
    return res.status(500).json({ error: error.message });
  }

  // name 가공: 첫 글자만 남기고 나머지는 **로 가리기
  const masked = data.map(row => ({
    id: row.id,
    name: row.name.length > 0 ? row.name[0] + "*".repeat(row.name.length - 1) : "",
    subject: row.subject,
    motivation: row.motivation,
    created_at: row.created_at
  }));

  console.log(JSON.stringify({ event: "list", ok: true, count: masked.length, duration_ms: Date.now() - t0 }));
  return res.status(200).json({ ok: true, data: masked });
}

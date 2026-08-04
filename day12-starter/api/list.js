// Vercel 서버리스 함수 - sales 목록을 읽고 반환한다.
// buyer_name은 첫 글자만 남기고 나머지는 *로 가린다 (개인정보 보호).
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const t0 = Date.now();

  if (req.method !== "GET") return res.status(405).json({ error: "GET만 받습니다" });

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  const { data, error } = await supabase
    .from("sales")
    .select("id, buyer_name, product, quantity, price_per_unit, total_price, purchased_at")
    .order("purchased_at", { ascending: false });

  if (error) {
    console.log(JSON.stringify({ event: "list", ok: false, duration_ms: Date.now() - t0 }));
    return res.status(500).json({ error: error.message });
  }

  // buyer_name 가공: 첫 글자만 남기고 나머지는 *로 가리기
  const masked = data.map(row => ({
    id: row.id,
    buyer_name: row.buyer_name.length > 0 ? row.buyer_name[0] + "*".repeat(row.buyer_name.length - 1) : "",
    product: row.product,
    quantity: row.quantity,
    price_per_unit: row.price_per_unit,
    total_price: row.total_price,
    purchased_at: row.purchased_at
  }));

  console.log(JSON.stringify({ event: "list", ok: true, count: masked.length, revenue: masked.reduce((sum, row) => sum + row.total_price, 0), duration_ms: Date.now() - t0 }));
  return res.status(200).json({ ok: true, data: masked });
}

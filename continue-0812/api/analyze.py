import json
import os
from http.server import BaseHTTPRequestHandler

from google import genai

MODEL = "gemini-3.5-flash-lite"
MAX_LEN = 500

PROMPT = """다음 고객 피드백을 분석하여 아래 형식으로 정확하게 답변해주세요. API 키는 절대 출력하지 마세요.

피드백: {feedback}

[응답 형식]
유형: 버그 / 기능 요청 / 문의 중 하나
긴급도: 높음 / 중간 / 낮음 중 하나
판단 이유: 한 문장
다음 행동: PM이 해야 할 행동 한 문장
"""

FIELDS = {
    "유형": "type",
    "긴급도": "urgency",
    "판단 이유": "reason",
    "다음 행동": "action",
}


def mask(text, secret):
    """오류 메시지에 API 키가 섞여 나가는 것을 차단한다."""
    if secret and secret in text:
        return text.replace(secret, "[REDACTED]")
    return text


def parse(text):
    """Gemini 응답을 4개 필드로 분해한다. 실패한 줄은 무시한다."""
    parsed = {}
    for line in text.splitlines():
        if ":" not in line:
            continue
        label, _, value = line.partition(":")
        key = FIELDS.get(label.strip().lstrip("*# ").strip())
        if key:
            parsed[key] = value.strip()
    return parsed


def classify(feedback):
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        return 500, {"error": "서버에 GOOGLE_API_KEY가 설정되지 않았습니다."}

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=MODEL,
            contents=PROMPT.format(feedback=feedback),
        )
    except Exception as e:
        return 502, {"error": "API 호출 실패: " + mask(str(e), api_key)}

    raw = (response.text or "").strip()
    if not raw:
        return 502, {"error": "API가 빈 응답을 반환했습니다."}

    return 200, {"raw": raw, "fields": parse(raw)}


class handler(BaseHTTPRequestHandler):
    def _send(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        length = int(self.headers.get("content-length") or 0)
        if length > 10000:
            self._send(413, {"error": "요청이 너무 큽니다."})
            return

        try:
            data = json.loads(self.rfile.read(length) or b"{}")
        except (ValueError, UnicodeDecodeError):
            self._send(400, {"error": "잘못된 요청 형식입니다."})
            return

        feedback = str(data.get("feedback", "")).strip()
        if not feedback:
            self._send(400, {"error": "피드백을 입력해주세요"})
            return
        if len(feedback) > MAX_LEN:
            self._send(400, {"error": f"피드백은 {MAX_LEN}자 이내로 입력해주세요."})
            return

        status, payload = classify(feedback)
        self._send(status, payload)

    def do_GET(self):
        self._send(405, {"error": "POST로 요청해주세요."})

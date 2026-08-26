# 화면설계서 - 식당 예약 (RSV-001)

`wireframe.md`의 6층 프레임(기능 / UI / Logic / Data / API / Deploy)으로 `ui.png` 화면을 기술한다.

## 0. 화면 개요

| 항목 | 값 |
|---|---|
| 화면 ID | RSV-001 |
| 화면명 | 식당 예약 |
| 한 줄 목적 | 지역과 취향을 골라 오늘 갈 식당을 예약한다 |
| 진입 경로 | 서비스 첫 화면 (단일 페이지) |
| 이탈 경로 | 예약하기 성공 시 요약 표시, 화면 이동 없음 |
| 화면 구성 | 히어로 1개 + 예약 카드 1개 (섹션 2개, 입력 요소 8개) |

---

## 1. 히어로 영역

### ① 대제목
```
   무슨 서비스인지 한 줄로 알린다. "좋은 식사는 좋은 자리에서."
   UI      <h1>. 세리프(명조) 계열, 2줄 강제 개행, 좌측 정렬. 페이지 최대 크기 텍스트
   Logic   없음. 상호작용 없는 정적 문구
   Data    없음 (하드코딩 문자열)
   API     없음
   Deploy  정적 HTML. 웹폰트 CDN 차단 시 시스템 명조로 대체
```

### ② 서브카피
```
   이 화면에서 무엇을 하면 되는지 알려준다.
   UI      <p>. 본문 크기, 회색(#6b6a63), 대제목 바로 아래
   Logic   없음
   Data    없음
   API     없음
   Deploy  정적 HTML
```

---

## 2. 카드 헤더

### ③ 카드 제목 + 안내문
```
   지금 채우는 것이 예약 정보라는 걸 알린다.
   UI      <h2>"식당 예약" + <p>"방문 정보를 간단히 남겨주세요."
   Logic   없음
   Data    없음
   API     없음
   Deploy  정적 HTML
```

### ④ 필수 입력 표시
```
   별표가 붙은 칸은 비우면 안 된다고 미리 알린다.
   UI      카드 우측 상단 <span>. 주황(#c96a3a), 작은 글씨. 각 라벨의 * 와 색을 맞춘다
   Logic   없음 (라벨의 * 와 시각적으로만 연결)
   Data    없음
   API     없음
   Deploy  정적 HTML
```

---

## 3. VISIT DETAILS 섹션

### ⑤ 섹션 라벨
```
   아래 다섯 칸이 "방문 정보" 묶음임을 구분한다.
   UI      <h3>. 대문자 VISIT DETAILS, 초록(#2f5d43), letter-spacing 넓게, 작은 크기
   Logic   없음
   Data    없음
   API     없음
   Deploy  정적 HTML
```

### ⑥ 지역
```
   어느 동네에서 식당을 찾을지 고른다.
   UI      <select> 드롭다운. 2열 그리드 왼쪽. 기본 표시 "선택하세요". 옵션 5개
           (강남, 홍대, 이태원, 성수, 여의도)
   Logic   change -> formData.region 갱신 -> validate() 재실행 -> 하단 상태문구 갱신
   Data    region / string / mutable / 기본값 ""
   API     없음 (옵션 하드코딩. 서버에서 받을 경우 GET /api/regions)
   Deploy  정적 HTML
```

### ⑦ 종류
```
   무슨 음식을 먹을지 고른다.
   UI      <select>. 2열 그리드 오른쪽. 기본 표시 "선택하세요". 옵션 5개
           (한식, 일식, 중식, 양식, 카페)
   Logic   change -> formData.cuisine 갱신 -> validate()
   Data    cuisine / string / mutable / 기본값 ""
   API     없음
   Deploy  정적 HTML
```

### ⑧ 가격대
```
   1인당 얼마까지 쓸지 고른다.
   UI      <select>. 2열 그리드 왼쪽. 옵션 4개
           (1만원 이하, 1만 - 2만원, 2만 - 3만원, 3만원 이상)
   Logic   change -> formData.price 갱신 -> validate()
   Data    price / string / mutable / 기본값 ""
   API     없음
   Deploy  정적 HTML
```

### ⑨ 예약 인원
```
   몇 명이 갈지 적는다.
   UI      <input type="number">. 2열 그리드 오른쪽. placeholder "1 - 20명"
   Logic   input -> formData.people 갱신 -> validate()
           범위 밖(1 미만 또는 20 초과)이면 미충족으로 처리하고 테두리를 붉게 표시
   Data    people / number|"" / mutable / 기본값 "" (min 1, max 20)
   API     없음
   Deploy  정적 HTML
```

### ⑩ 예약 시간
```
   몇 시에 갈지 고른다.
   UI      <input type="time">. 카드 가로 전체 1열. 우측에 시계 아이콘.
           값이 없으면 브라우저가 시:분 빈 형태로 그린다
   Logic   change -> formData.time 갱신 -> validate()
   Data    time / string ("HH:MM") / mutable / 기본값 ""
   API     없음
   Deploy  정적 HTML. time 위젯 모양은 브라우저마다 다르다(아이콘 위치 차이)
```

---

## 4. TABLE PREFERENCES 섹션

### ⑪ 섹션 라벨
```
   아래 세 칸이 "좌석 취향" 묶음임을 구분한다.
   UI      <h3>. 대문자 TABLE PREFERENCES, 초록, letter-spacing 넓게
   Logic   없음
   Data    없음
   API     없음
   Deploy  정적 HTML
```

### ⑫ 취향 체크박스 3개 (야외석 / 주차 / 인터넷)
```
   있으면 좋은 조건을 고른다. 안 골라도 예약은 된다.
   UI      <input type="checkbox"> + <label>을 테두리 있는 박스로 감싼 카드형.
           3열 그리드. 체크 시 테두리와 배경이 초록 톤으로 바뀐다
   Logic   change -> prefs 배열에 값 추가 또는 제거. 필수 검사에는 넣지 않는다
   Data    prefs / string[] / append+remove / 기본값 []
           append 인 이유: 세 개를 동시에 고를 수 있어 이전 선택이 남아야 한다
           (region 같은 mutable 칸은 새 값이 이전 값을 지운다)
   API     없음
   Deploy  정적 HTML
```

---

## 5. 하단 액션

### ⑬ 예약하기 버튼
```
   지금까지 고른 조건으로 예약을 넣는다.
   UI      <button>. 검정 배경(#1f1f1d), 흰 글씨, 라벨 "예약하기" + 오른쪽 화살표
   Logic   click -> validate()
           - 미충족 있음: 해당 칸 테두리를 붉게, 첫 미충족 칸으로 포커스 이동,
             상태문구를 "지역, 예약 시간을 채워주세요." 형태로 교체
           - 전부 충족: 예약 요약 블록을 버튼 아래에 표시하고 버튼을 완료 상태로 잠금
   Data    읽기 전용으로 formData 전체를 참조
   API     없음 (실제 서비스라면 POST /api/reservations, body = formData)
   Deploy  정적 HTML. 서버 연동 시 HTTPS 필수, CORS 허용 도메인 등록 필요
```

### ⑭ 상태 문구
```
   지금 예약을 넣을 수 있는 상태인지 알려준다.
   UI      버튼 오른쪽 <p>. 회색. 초기값 "입력 내용을 확인해 주세요."
   Logic   validate() 결과에 따라 문구 교체
           미충족 n개 -> "필수 항목 n개가 비어 있어요."
           전부 충족  -> "예약할 준비가 되었어요."
           제출 성공  -> "예약이 접수되었어요."
   Data    없음 (validate() 결과에서 매번 계산)
   API     없음
   Deploy  정적 HTML
```

---

## 6. Data 슬롯 정리

예약이 성립하려면 아래 5개 슬롯이 전부 차야 한다. prefs는 비어 있어도 된다.

| 슬롯 | 이름 | 타입 | 변경성 | 기본값 | 필수 |
|---|---|---|---|---|---|
| 지역 | region | string | mutable | "" | O |
| 종류 | cuisine | string | mutable | "" | O |
| 가격대 | price | string | mutable | "" | O |
| 인원 | people | number \| "" | mutable | "" | O (1-20) |
| 시간 | time | string "HH:MM" | mutable | "" | O |
| 취향 | prefs | string[] | append | [] | X |

이 슬롯 표가 화면을 챗봇이나 음성으로 바꿔도 그대로 남는 부분이다. 바뀌는 것은 UI 층뿐이다.

---

## 7. 화면 전체 Deploy

| 항목 | 값 |
|---|---|
| 배포 형태 | 정적 HTML 1개 파일 (index.html), 빌드 없음 |
| HTTPS | 현재 기능만으로는 불필요. 서버 전송을 붙이면 필수 |
| 외부 키 | 없음 |
| 도메인 등록 | 없음 |
| 외부 의존 | Google Fonts (Nanum Myeongjo, Noto Sans KR). 차단 시 시스템 폰트로 대체되며 기능은 그대로 동작 |
| file:// 직접 열기 | 동작함 (fetch, geolocation 등 차단되는 API를 쓰지 않는다) |

---

## 8. 자가 점검 (지역 select 기준)

```
[기능]    이 요소는 (어느 동네에서 식당을 찾을지 고르게) 한다.
[UI]      (select) 태그를 쓰고, (기본값이 "선택하세요"인 드롭다운) 처럼 보인다.
[Logic]   (옵션을 고르) 하면 (formData.region이 그 값으로 바뀌고 상태문구가 갱신) 된다.
[Data]    (region) 이름 / (string) 타입 / (mutable) / 기본값 ("")
[API]     (없음)
[Deploy]  (정적)
```

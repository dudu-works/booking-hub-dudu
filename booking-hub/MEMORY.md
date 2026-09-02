# booking-hub 프로젝트 트랙

## 상태
- **현재**: Day 32 완성 프로젝트, 새 세션 시작 (260902)
- **다음**: S1 시작 준비 - 뼈대 켜기 및 연결 테스트

## 트랙 정리
- [Day 32 가이드](file:///Users/user/dev/booking-hub/00_START_HERE.md) - S1 ~ S4 순차 진행
- S1: 프로젝트 생성 + Supabase 연결 (현재 위치)
- S2: 예약 목록 + 추가 폼
- S3: 상태 토글 + 지도 + 집계
- S4: 탭 조립 + 자가점검

## 핵심 파일
| 파일 | 용도 |
|---|---|
| `10_S1_프로젝트_생성_Supabase_연결.md` | S1 가이드 |
| `_table.sql` | bookings 테이블 SQL |
| `.env.example` | 환경변수 템플릿 |
| `check.mjs` | 연결 검증 (`node check.mjs`) |

## 진행 상황
- [x] npm install (완료 - 54 packages)
- [x] dev 서버 실행 (localhost:5173 실행 중)
- [x] .env 파일 생성 (`.env.example` 복사됨)
- [ ] Supabase 테이블 생성 (`_table.sql` SQL Editor에서 실행)
- [ ] API 키 복사 (`.env`에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [ ] 연결 검증 (`node check.mjs` → "키 OK" + "표 OK" 확인)

## S1 체크리스트 [4/4] ✓ 완료
1. [x] 뼈대가 돈다 - 브라우저에 앱 보임 ✓
2. [x] Tailwind 작동 - 파란 글자 "연결 테스트" 보임 ✓
3. [x] Supabase 테이블 - bookings 테이블 + 칼럼 9개 생성 ✓
4. [x] 연결 검증 - `node check.mjs` → 키 OK + 표 OK ✓

## 최종 상태: Day 32 완료 ✓

**S1**: 프로젝트 생성 + Supabase 연결 [4/4] ✓
**S2**: 예약 목록 + 추가 폼 [3/3] ✓
**S3**: 상태 토글 + 지도 + 집계 [3/3] ✓
**S4**: 탭 조립 [2/2] ✓

**구현된 5대 기능**:
1. Intent 1: 목록 조회 (BookingTable)
2. Intent 2: 예약 추가 (BookingForm)
3. Intent 3: 상태 변경 (토글 버튼)
4. Intent 4: 위치 확인 (지도 링크)
5. Intent 5: 집계 (StatCards)

**배포**:
- dev: localhost:5173 (npm run dev)
- prod: localhost:8080 (프로덕션 빌드)

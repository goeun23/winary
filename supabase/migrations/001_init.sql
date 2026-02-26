-- ============================================================
-- winary 초기 스키마
-- ============================================================

-- 커스텀 와인 (마스터 JSON에 없는 사용자 등록 와인)
CREATE TABLE custom_wines (
  wine_id       SERIAL PRIMARY KEY,
  wine_nm       TEXT NOT NULL,
  wine_nm_kr    TEXT NOT NULL DEFAULT '',
  wine_area     TEXT NOT NULL DEFAULT '',
  wine_category TEXT NOT NULL,
  wine_abv      NUMERIC(4,1) NOT NULL DEFAULT 0,
  wine_prc      NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 리뷰
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wine_id     INTEGER NOT NULL,
  is_custom   BOOLEAN NOT NULL DEFAULT FALSE,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body        SMALLINT NOT NULL CHECK (body BETWEEN 1 AND 5),
  sweetness   SMALLINT NOT NULL CHECK (sweetness BETWEEN 1 AND 5),
  acidity     SMALLINT NOT NULL CHECK (acidity BETWEEN 1 AND 5),
  tannin      SMALLINT NOT NULL CHECK (tannin BETWEEN 1 AND 5),
  comment     TEXT NOT NULL DEFAULT '',
  nickname    TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_wine_id ON reviews(wine_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- 익명 수정 토큰 (service role 전용 — anon 직접 접근 불가)
CREATE TABLE review_tokens (
  review_id   UUID PRIMARY KEY REFERENCES reviews(id) ON DELETE CASCADE,
  token       TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL
);

-- ============================================================
-- RLS 정책
-- ============================================================

ALTER TABLE custom_wines ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_tokens ENABLE ROW LEVEL SECURITY;

-- custom_wines: 누구나 읽기/쓰기 가능
CREATE POLICY "custom_wines_select" ON custom_wines FOR SELECT USING (true);
CREATE POLICY "custom_wines_insert" ON custom_wines FOR INSERT WITH CHECK (true);

-- reviews: 누구나 읽기/쓰기 가능, 수정/삭제는 Edge Function 경유
CREATE POLICY "reviews_select" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (true);

-- review_tokens: 완전 비공개 (service role만 접근)
-- → RLS 정책 없음 = anon/authenticated 접근 차단

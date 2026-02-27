-- ============================================================
-- wine_overrides: JSON 와인 데이터 수정 제보 테이블
-- 유저가 잘못된 와인 정보를 제보하면 이 테이블에 upsert됨.
-- getWineById가 JSON 원본에 override를 병합하여 반환함.
-- ============================================================

CREATE TABLE wine_overrides (
  wine_id       INTEGER PRIMARY KEY,
  wine_nm       TEXT,
  wine_nm_kr    TEXT,
  wine_area     TEXT,
  wine_category TEXT,
  wine_abv      NUMERIC(4,1),
  wine_prc      NUMERIC(10,2),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE wine_overrides ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기 가능
CREATE POLICY "wine_overrides_select" ON wine_overrides FOR SELECT USING (true);
-- 누구나 신규 제보 등록 가능
CREATE POLICY "wine_overrides_insert" ON wine_overrides FOR INSERT WITH CHECK (true);
-- 기존 제보 수정 가능 (같은 wine_id에 재제보)
CREATE POLICY "wine_overrides_update" ON wine_overrides FOR UPDATE USING (true) WITH CHECK (true);

/**
 * wine-info.json 로컬 데이터 구조
 */
export interface WineInfoLocal {
  WINE_ID: number
  WINE_NM: string // 영문 이름
  WINE_NM_KR: string // 한글 이름
  WINE_AREA: string // 생산지
  WINE_CATEGORY: string // 카테고리 (RED, WHITE, CHAMP, DESSERT 등)
  WINE_ABV: number // 알코올 도수
  WINE_PRC: number // 가격
}

/**
 * 와인의 기본적인 정보를 정의하는 인터페이스입니다.
 */
export interface WineInfo {
  id: string
  name: string // 와인 이름 (예: 샤토 마고)
  vintage: string // 생산 연도
  region: string // 생산지 (예: Bordeaux, France)
  color: string // 와인 종류 (API에서는 color로 제공됨)
  score: number // GWS 스코어
}

/**
 * Global Wine Score API 응답 인터페이스
 */
export interface GWSResponse {
  count: number
  next: string | null
  previous: string | null
  results: GWSResult[]
}

export interface GWSResult {
  wine: string
  vintage: string
  score: number
  color: string
  region: string
  wine_id: number
  wine_slug: string
  appellation: string
  appellation_slug: string
  country: string
  classification: string | null
  type: string
}

/**
 * 와인 리뷰 작성 시 사용되는 데이터 인터페이스입니다.
 */
export interface WineReview {
  rating: number // 평점 (1~5)
  body: number // 바디감 (1~5)
  tannant: number // 탄닌 (1~5)
  sweetness: number // 당도 (1~5)
  acid: number // 산도 (1~5)
  comment: string // 리뷰 내용
  tags: string[] // 선택된 특징 태그 (예: '과일향', '오크향')
}

export const WINE_CATEGORIES = ["RED", "WHITE", "CHAMP", "DESSERT"] as const

export const CATEGORY_LABELS = {
  RED: "레드",
  WHITE: "화이트",
  CHAMP: "스파클링",
  DESSERT: "디저트",
}

export const CATEGORY_COLORS = {
  RED: { bg: "#fff0f0", text: "#ff4d4f" },
  WHITE: { bg: "#fffbe6", text: "#d4a017" },
  CHAMP: { bg: "#f0f7ff", text: "#3182f6" },
  DESSERT: { bg: "#faf0ff", text: "#9b59b6" },
}

export const WINE_AREA = [
  "Italy",
  "Australia",
  "Mexico",
  "California",
  "Chile",
  "France",
  "Portugal",
]

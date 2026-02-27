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
  reviewCount?: number // 리뷰 개수
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

/**
 * 와인 카테고리 키 정의 (코드 내에서 문자열 하드코딩 방지용)
 */
export const WINE_TYPE = {
  RED: "RED",
  WHITE: "WHITE",
  SPARKLING: "SPARKLING",
  ROSE: "ROSE",
  DESSERT: "DESSERT",
  CHAMP: "CHAMP",
} as const

export type WineCategory = keyof typeof WINE_TYPE

/**
 * 와인 카테고리 구성 (색상, 라벨, 설명 등)
 */
export const WINE_CATEGORY_CONFIG: Record<
  WineCategory,
  {
    label: string
    color: string
    icon: string
  }
> = {
  [WINE_TYPE.RED]: {
    label: "레드",
    color: "#ff4d4f",
    icon: "/images/RED_ICON.png",
  },
  [WINE_TYPE.WHITE]: {
    label: "화이트",
    color: "#d4a017",
    icon: "/images/WHITE_ICON.png",
  },
  [WINE_TYPE.SPARKLING]: {
    label: "스파클링",
    color: "#3182f6",
    icon: "/images/SPARKLING_ICON.png",
  },
  [WINE_TYPE.ROSE]: {
    label: "로제",
    color: "#e8899e",
    icon: "/images/ROSE_ICON.png",
  },
  [WINE_TYPE.DESSERT]: {
    label: "디저트",
    color: "#9b59b6",
    icon: "/images/ROSE_ICON.png",
  },
  [WINE_TYPE.CHAMP]: {
    label: "샴페인",
    color: "#9b59b6",
    icon: "/images/CHAMP_ICON.png",
  },
}

export const WINE_CATEGORIES = Object.values(WINE_TYPE)

/**
 * 하위 호환성을 위한 헬퍼 객체 (기존 라벨 및 색상 참조용)
 */
export const CATEGORY_LABELS = Object.fromEntries(
  Object.entries(WINE_CATEGORY_CONFIG).map(([key, config]) => [
    key,
    config.label,
  ]),
) as Record<WineCategory, string>

export const WINE_AREA = [
  "France",
  "Italy",
  "Spain",
  "USA",
  "Chile",
  "Australia",
  "Argentina",
  "Portugal",
  "Germany",
  "New Zealand",
  "South Africa",
  "Others",
] as const

/**
 * 영문 와인 타입(Red, White 등)을 한글 카테고리 키로 매핑하는 헬퍼 객체
 */
export const WINE_TYPE_MAP: Record<string, WineCategory> = {
  Red: "RED",
  White: "WHITE",
  Rosé: "ROSE",
  Sparkling: "SPARKLING",
  Dessert: "DESSERT",
  "Dessert Wine": "DESSERT",
}

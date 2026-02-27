/**
 * Supabase / 로컬 스토리지 서비스에서 공통으로 사용하는 로컬 리뷰 타입
 */
export interface LocalReview {
  id: string
  wineId: number
  rating: number
  body: number
  sweetness: number
  acidity: number
  tannin: number
  comment: string
  nickname: string
  votes: number
  createdAt: string
}

/**
 * 리뷰 편집 권한 토큰 (localStorage 저장용)
 */
export interface ReviewToken {
  reviewId: string
  token: string
  expiresAt: string
}

/**
 * 저장된 리뷰 항목을 정의하는 인터페이스입니다.
 * 리뷰 목록(최근 리뷰)과 상세 페이지에서 공통으로 사용합니다.
 */
export interface ReviewItem {
  id: string
  wineId: number
  wineName: string
  wineRegion: string
  wineType: "Red" | "White" | "Rosé" | "Sparkling"
  vintage: number
  rating: number
  body: number
  tannin: number
  sweetness: number
  acidity: number
  comment: string
  tags: string[]
  imageUrl: string
  nickname: string
  createdAt: string
}

/**
 * 리뷰 댓글 항목을 정의하는 인터페이스입니다.
 */
export interface CommentItem {
  id: string
  reviewId: string
  nickname: string
  avatarEmoji: string
  content: string
  createdAt: string
}

/**
 * 리뷰 등록 시 사용하는 폼 데이터 인터페이스
 */
export interface ReviewFormData {
  wineName: string
  wineRegion: string
  wineType: "Red" | "White" | "Rosé" | "Sparkling"
  wineAbv: number
  vintage: number
  rating: number
  body: number
  tannin: number
  sweetness: number
  acidity: number
  comment: string
  tags: string[]
}

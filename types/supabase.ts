import type { ReviewItem, CommentItem } from "./review"

/**
 * Supabase reviews 테이블의 snake_case 컬럼 구조
 */
export interface ReviewRow {
  id: string
  wine_name: string
  wine_region: string
  wine_type: "Red" | "White" | "Rosé" | "Sparkling"
  wine_abv: number
  vintage: number
  rating: number
  body: number
  tannin: number
  sweetness: number
  acidity: number
  comment: string
  tags: string[]
  image_url: string
  created_at: string
}

/**
 * Supabase ReviewRow(snake_case) → ReviewItem(camelCase) 변환
 */
export function toReviewItem(row: ReviewRow): ReviewItem {
  return {
    id: row.id,
    wineName: row.wine_name,
    wineRegion: row.wine_region,
    wineType: row.wine_type,
    vintage: row.vintage,
    rating: row.rating,
    body: row.body,
    tannin: row.tannin,
    sweetness: row.sweetness,
    acidity: row.acidity,
    comment: row.comment,
    tags: row.tags,
    imageUrl: row.image_url,
    createdAt: row.created_at.slice(0, 10),
  }
}

/**
 * Supabase comments 테이블의 snake_case 컬럼 구조
 */
export interface CommentRow {
  id: string
  review_id: string
  nickname: string
  avatar_emoji: string
  content: string
  created_at: string
}

/**
 * Supabase CommentRow(snake_case) → CommentItem(camelCase) 변환
 */
export function toCommentItem(row: CommentRow): CommentItem {
  return {
    id: row.id,
    reviewId: row.review_id,
    nickname: row.nickname,
    avatarEmoji: row.avatar_emoji,
    content: row.content,
    createdAt: row.created_at.slice(0, 16).replace("T", " "),
  }
}

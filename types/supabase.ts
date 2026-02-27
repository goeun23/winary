import type { ReviewItem, CommentItem } from "./review"
import type { WineInfoLocal } from "./wine"

/**
 * Supabase reviews 테이블의 실제 스키마 (001_init.sql 기준)
 */
export interface ReviewRow {
  id: string
  wine_id: number
  is_custom: boolean
  rating: number
  body: number
  tannin: number
  sweetness: number
  acidity: number
  comment: string
  nickname: string
  created_at: string
}

/**
 * ReviewRow(DB) + WineInfoLocal(로컬/커스텀) → ReviewItem(UI) 변환
 */
export function toReviewItem(
  row: ReviewRow,
  wine?: WineInfoLocal | null,
): ReviewItem {
  return {
    id: row.id,
    wineId: row.wine_id,
    wineName: wine?.WINE_NM_KR || wine?.WINE_NM || `와인 #${row.wine_id}`,
    wineRegion: wine?.WINE_AREA || "",
    wineType: wine ? (wine.WINE_CATEGORY as any) : "RED",
    vintage: 0,
    rating: row.rating,
    body: row.body,
    tannin: row.tannin,
    sweetness: row.sweetness,
    acidity: row.acidity,
    comment: row.comment,
    nickname: row.nickname,
    tags: [],
    imageUrl: "",
    createdAt: row.created_at.slice(0, 10),
  }
}

/**
 * Supabase comments 테이블 스키마 (향후 확장용)
 */
export interface CommentRow {
  id: string
  review_id: string
  nickname: string
  avatar_emoji: string
  content: string
  created_at: string
}

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

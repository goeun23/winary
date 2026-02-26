import { createClient } from "@/lib/supabase/client"
import type { ReviewFormData, ReviewItem, CommentItem } from "@/types/review"
import { toReviewItem, toCommentItem } from "@/types/supabase"

const AVATAR_EMOJIS = [
  "🍷",
  "🥂",
  "🍇",
  "🍾",
  "🫧",
  "🌿",
  "🍒",
  "🍊",
  "🌸",
  "💜",
]

/**
 * 리뷰를 Supabase에 저장합니다.
 */
export async function submitReview(data: ReviewFormData): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("reviews").insert({
    wine_name: data.wineName,
    wine_region: data.wineRegion,
    wine_type: data.wineType,
    wine_abv: data.wineAbv,
    vintage: data.vintage,
    rating: data.rating,
    body: data.body,
    tannin: data.tannin,
    sweetness: data.sweetness,
    acidity: data.acidity,
    comment: data.comment,
    tags: data.tags,
    image_url: "",
  })
  if (error) throw error
}

/**
 * 최근 리뷰 목록을 Supabase에서 가져옵니다. (클라이언트용)
 */
export async function fetchReviews(): Promise<ReviewItem[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20)
  if (error) throw error
  return (data ?? []).map(toReviewItem)
}

/**
 * 댓글을 Supabase에 저장합니다.
 */
export async function submitComment(
  reviewId: string,
  nickname: string,
  content: string,
): Promise<void> {
  const supabase = createClient()
  const avatarEmoji =
    AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)]
  const { error } = await supabase.from("comments").insert({
    review_id: reviewId,
    nickname,
    avatar_emoji: avatarEmoji,
    content,
  })
  if (error) throw error
}

/**
 * 특정 리뷰의 댓글 목록을 Supabase에서 가져옵니다. (클라이언트용)
 */
export async function fetchComments(reviewId: string): Promise<CommentItem[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("review_id", reviewId)
    .order("created_at", { ascending: true })
  if (error) throw error
  return (data ?? []).map(toCommentItem)
}

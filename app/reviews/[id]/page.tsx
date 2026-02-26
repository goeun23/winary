import { createClient } from "@/lib/supabase/server"
import { toReviewItem, toCommentItem } from "@/types/supabase"
import { MOCK_REVIEWS, MOCK_COMMENTS } from "@/data/mockReviews"
import ReviewDetailPage from "@/components/ReviewDetailPage"
import { notFound } from "next/navigation"
import type { CommentItem } from "@/types/review"

interface ReviewDetailRouteProps {
  params: Promise<{ id: string }>
}

export default async function ReviewDetailRoute({
  params,
}: ReviewDetailRouteProps) {
  const { id } = await params

  // mock 데이터에서 먼저 확인 (Supabase 미설정 대비)
  const mockReview = MOCK_REVIEWS.find((r) => r.id === id)
  const mockComments = MOCK_COMMENTS.filter((c) => c.reviewId === id)

  try {
    const supabase = await createClient()

    // 리뷰 + 댓글 병렬 fetch
    const [reviewRes, commentsRes] = await Promise.all([
      supabase.from("reviews").select("*").eq("id", id).single(),
      supabase
        .from("comments")
        .select("*")
        .eq("review_id", id)
        .order("created_at", { ascending: true }),
    ])

    if (!reviewRes.error && reviewRes.data) {
      const comments: CommentItem[] =
        !commentsRes.error && commentsRes.data
          ? commentsRes.data.map(toCommentItem)
          : []
      return (
        <ReviewDetailPage
          review={toReviewItem(reviewRes.data)}
          initialComments={comments}
        />
      )
    }
  } catch {
    // Supabase 미설정 시 mock 데이터 사용
  }

  if (mockReview) {
    return (
      <ReviewDetailPage review={mockReview} initialComments={mockComments} />
    )
  }

  notFound()
}

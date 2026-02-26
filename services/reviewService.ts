/**
 * Supabase 기반 리뷰 서비스
 * reviewLocalService.ts와 동일한 인터페이스를 유지합니다.
 */
import { supabase } from "../lib/supabase"
import type { LocalReview, ReviewToken } from "../types/review"
import type { WineInfoLocal } from "../types/wine"
import { generateNickname } from "./reviewLocalService"
import { searchLocalWines } from "./wineLocalService"

const TOKENS_KEY = "winary_review_tokens"

// ─── Tokens (localStorage 유지) ─────────────────────────────

const getTokens = (): ReviewToken[] => {
  try {
    return JSON.parse(localStorage.getItem(TOKENS_KEY) ?? "[]")
  } catch {
    return []
  }
}

const saveTokens = (tokens: ReviewToken[]) => {
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))
}

export const getMyToken = (reviewId: string): ReviewToken | null =>
  getTokens().find((t) => t.reviewId === reviewId) ?? null

export const canEdit = (reviewId: string): boolean => {
  const token = getMyToken(reviewId)
  if (!token) return false
  return new Date(token.expiresAt) > new Date()
}

// ─── DB Row → LocalReview 변환 ───────────────────────────────

const toLocalReview = (row: {
  id: string
  wine_id: number
  rating: number
  body: number
  sweetness: number
  acidity: number
  tannin: number
  comment: string
  nickname: string
  created_at: string
}): LocalReview => ({
  id: row.id,
  wineId: row.wine_id,
  rating: row.rating,
  body: row.body,
  sweetness: row.sweetness,
  acidity: row.acidity,
  tannin: row.tannin,
  comment: row.comment,
  nickname: row.nickname,
  votes: 0,
  createdAt: row.created_at,
})

// ─── Reviews ─────────────────────────────────────────────────

/** 특정 와인의 리뷰를 최신순으로 반환 */
export const getReviews = async (wineId: number): Promise<LocalReview[]> => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("wine_id", wineId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []).map(toLocalReview)
}

/** 리뷰 생성 → 토큰 발급 */
export const createReview = async (
  wineId: number,
  rating: number,
  body: number,
  sweetness: number,
  acidity: number,
  tannin: number,
  comment: string,
  isCustom = false,
): Promise<{ review: LocalReview; token: string }> => {
  const nickname = generateNickname()

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      wine_id: wineId,
      is_custom: isCustom,
      rating,
      body,
      sweetness,
      acidity,
      tannin,
      comment,
      nickname,
    })
    .select()
    .single()

  if (error) throw error
  const review = toLocalReview(data)

  // 토큰 localStorage 저장
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()
  const tokens = getTokens()
  tokens.push({ reviewId: review.id, token, expiresAt })
  saveTokens(tokens)

  return { review, token }
}

/** 리뷰 수정 (Edge Function 경유 → 서버 토큰 검증) */
export const updateReview = async (
  reviewId: string,
  token: string,
  rating: number,
  body: number,
  sweetness: number,
  acidity: number,
  tannin: number,
  comment: string,
): Promise<boolean> => {
  const { data, error } = await supabase.functions.invoke("update-review", {
    body: { reviewId, token, rating, body, sweetness, acidity, tannin, comment },
  })

  if (error) return false
  return data?.success === true
}

// ─── Custom Wines ─────────────────────────────────────────────

const toWineInfoLocal = (row: {
  wine_id: number
  wine_nm: string
  wine_nm_kr: string
  wine_area: string
  wine_category: string
  wine_abv: number
  wine_prc: number
}): WineInfoLocal => ({
  WINE_ID: row.wine_id,
  WINE_NM: row.wine_nm,
  WINE_NM_KR: row.wine_nm_kr,
  WINE_AREA: row.wine_area,
  WINE_CATEGORY: row.wine_category,
  WINE_ABV: row.wine_abv,
  WINE_PRC: row.wine_prc,
})

export const getCustomWines = async (): Promise<WineInfoLocal[]> => {
  const { data, error } = await supabase.from("custom_wines").select("*")
  if (error) throw error
  return (data ?? []).map(toWineInfoLocal)
}

export const saveCustomWine = async (wine: WineInfoLocal): Promise<WineInfoLocal> => {
  // 이미 존재하면 그대로 반환
  const { data: existing } = await supabase
    .from("custom_wines")
    .select("*")
    .eq("wine_nm", wine.WINE_NM)
    .maybeSingle()

  if (existing) return toWineInfoLocal(existing)

  const { data, error } = await supabase
    .from("custom_wines")
    .insert({
      wine_nm: wine.WINE_NM,
      wine_nm_kr: wine.WINE_NM_KR,
      wine_area: wine.WINE_AREA,
      wine_category: wine.WINE_CATEGORY,
      wine_abv: wine.WINE_ABV,
      wine_prc: wine.WINE_PRC,
    })
    .select()
    .single()

  if (error) throw error
  return toWineInfoLocal(data)
}

export const getCustomWineById = async (wineId: number): Promise<WineInfoLocal | null> => {
  const { data } = await supabase
    .from("custom_wines")
    .select("*")
    .eq("wine_id", wineId)
    .maybeSingle()
  return data ? toWineInfoLocal(data) : null
}

/** JSON + Supabase custom 통합 검색 */
export const searchAllWines = async (query: string, limit = 5): Promise<WineInfoLocal[]> => {
  const jsonResults = await searchLocalWines(query, limit)

  const { data } = await supabase
    .from("custom_wines")
    .select("*")
    .or(`wine_nm.ilike.%${query}%,wine_nm_kr.ilike.%${query}%`)
    .limit(limit)

  const customResults = (data ?? []).map(toWineInfoLocal)
  return [...jsonResults, ...customResults].slice(0, limit)
}

/** 댓글 등록 (comments 테이블 미구현 → 클라이언트 낙관적 업데이트만 사용) */
export const submitComment = async (
  _reviewId: string,
  _nickname: string,
  _content: string,
): Promise<void> => {
  // 향후 comments 테이블 추가 시 구현
}

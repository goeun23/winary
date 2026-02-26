import type { LocalReview, ReviewToken } from "../types/review"
import type { WineInfoLocal } from "../types/wine"
import { searchLocalWines } from "./wineLocalService"

const REVIEWS_KEY = "winary_reviews"
const TOKENS_KEY = "winary_review_tokens"
const CUSTOM_WINES_KEY = "winary_custom_wines"
const VOTES_KEY = "winary_votes"

// 닉네임 생성
const ADJECTIVES = [
  "행복한", "용감한", "신중한", "화려한", "유쾌한", "조용한", "활발한",
  "따뜻한", "달콤한", "섬세한", "우아한", "포근한", "상쾌한", "은은한",
  "풍부한", "깔끔한", "여유로운", "설레는", "깊은", "향기로운",
]
const NOUNS = [
  "소믈리에", "와인러버", "테이스터", "미식가", "와인홀릭", "탐험가",
  "와인킹", "와인퀸", "포도향기", "와인마니아", "포도밭지기", "와인여행자",
]

export const generateNickname = (): string => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  return `${adj} ${noun}`
}

// 브라우저 fingerprint (익명 중복 투표 방지용)
const getFingerprint = (): string => {
  const stored = localStorage.getItem("winary_fp")
  if (stored) return stored
  const fp = Math.random().toString(36).slice(2) + Date.now().toString(36)
  localStorage.setItem("winary_fp", fp)
  return fp
}

const generateId = (): string =>
  Math.random().toString(36).slice(2) + Date.now().toString(36)

// ─── Reviews ────────────────────────────────────────────────

const getAllReviews = (): LocalReview[] => {
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_KEY) ?? "[]")
  } catch {
    return []
  }
}

const saveAllReviews = (reviews: LocalReview[]) => {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews))
}

/** 특정 와인의 리뷰를 최신순으로 반환 */
export const getReviews = (wineId: number): LocalReview[] => {
  return getAllReviews()
    .filter((r) => r.wineId === wineId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

/** 리뷰 생성 → token 발급 */
export const createReview = (
  wineId: number,
  rating: number,
  body: number,
  sweetness: number,
  acidity: number,
  tannin: number,
  comment: string,
): { review: LocalReview; token: string } => {
  const review: LocalReview = {
    id: generateId(),
    wineId,
    rating,
    body,
    sweetness,
    acidity,
    tannin,
    comment,
    votes: 0,
    nickname: generateNickname(),
    createdAt: new Date().toISOString(),
  }

  const allReviews = getAllReviews()
  allReviews.push(review)
  saveAllReviews(allReviews)

  const token = generateId()
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString() // +1h
  const tokens = getTokens()
  tokens.push({ reviewId: review.id, token, expiresAt })
  saveTokens(tokens)

  return { review, token }
}

/** 리뷰 수정 (토큰 검증 후) */
export const updateReview = (
  reviewId: string,
  token: string,
  rating: number,
  body: number,
  sweetness: number,
  acidity: number,
  tannin: number,
  comment: string,
): boolean => {
  const tokenEntry = getTokens().find(
    (t) => t.reviewId === reviewId && t.token === token,
  )
  if (!tokenEntry) return false
  if (new Date(tokenEntry.expiresAt) < new Date()) return false

  const allReviews = getAllReviews()
  const idx = allReviews.findIndex((r) => r.id === reviewId)
  if (idx === -1) return false

  allReviews[idx] = { ...allReviews[idx], rating, body, sweetness, acidity, tannin, comment }
  saveAllReviews(allReviews)
  return true
}

/** 리뷰 투표 (fingerprint 기반 중복 방지) */
export const voteReview = (reviewId: string): boolean => {
  const fp = getFingerprint()
  const votes: Record<string, string[]> = JSON.parse(
    localStorage.getItem(VOTES_KEY) ?? "{}",
  )
  const voters = votes[reviewId] ?? []
  if (voters.includes(fp)) return false // 이미 투표함

  votes[reviewId] = [...voters, fp]
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes))

  const allReviews = getAllReviews()
  const idx = allReviews.findIndex((r) => r.id === reviewId)
  if (idx !== -1) {
    allReviews[idx].votes += 1
    saveAllReviews(allReviews)
  }
  return true
}

/** 이미 투표했는지 여부 */
export const hasVoted = (reviewId: string): boolean => {
  const fp = getFingerprint()
  const votes: Record<string, string[]> = JSON.parse(
    localStorage.getItem(VOTES_KEY) ?? "{}",
  )
  return (votes[reviewId] ?? []).includes(fp)
}

// ─── Tokens ─────────────────────────────────────────────────

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

/** 내 토큰 가져오기 */
export const getMyToken = (reviewId: string): ReviewToken | null => {
  return getTokens().find((t) => t.reviewId === reviewId) ?? null
}

/** 수정 가능 여부 (토큰 유효 + 1시간 이내) */
export const canEdit = (reviewId: string): boolean => {
  const token = getMyToken(reviewId)
  if (!token) return false
  return new Date(token.expiresAt) > new Date()
}

// ─── Custom Wines ────────────────────────────────────────────

export const getCustomWines = (): WineInfoLocal[] => {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_WINES_KEY) ?? "[]")
  } catch {
    return []
  }
}

export const saveCustomWine = (wine: WineInfoLocal): WineInfoLocal => {
  const wines = getCustomWines()
  // 이미 있으면 그대로 반환
  const existing = wines.find((w) => w.WINE_ID === wine.WINE_ID)
  if (existing) return existing
  wines.push(wine)
  localStorage.setItem(CUSTOM_WINES_KEY, JSON.stringify(wines))
  return wine
}

export const getCustomWineById = (wineId: number): WineInfoLocal | null => {
  return getCustomWines().find((w) => w.WINE_ID === wineId) ?? null
}

/** JSON + custom 통합 검색 (유사 와인 체크용) */
export const searchAllWines = async (query: string, limit = 5): Promise<WineInfoLocal[]> => {
  const jsonResults = await searchLocalWines(query, limit)
  const customResults = getCustomWines().filter(
    (w) =>
      w.WINE_NM.toLowerCase().includes(query.toLowerCase()) ||
      w.WINE_NM_KR.includes(query),
  )
  return [...jsonResults, ...customResults].slice(0, limit)
}

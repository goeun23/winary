import type { ReviewItem } from "@/types/review"
import type { CommentItem } from "@/types/review"

/**
 * 목(mock) 리뷰 데이터
 * Supabase 연동 전 임시 사용 / 개발 폴백용
 */
export const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: "review-1",
    wineName: "맥윌리엄스 마운트 플레전트 와인스",
    wineRegion: "호주",
    wineType: "Red",
    vintage: 2019,
    rating: 4,
    body: 4,
    tannin: 3,
    sweetness: 2,
    acidity: 3,
    comment:
      "진한 베리향과 부드러운 탄닌이 조화로워요. 스테이크랑 같이 먹으면 최고! 오크 숙성에서 오는 바닐라 느낌도 살짝 나서 여운이 깊게 남았어요.",
    tags: ["Cherry", "Vanilla", "Oak"],
    imageUrl:
      "https://images.unsplash.com/photo-1510850477530-ce740d041d6a?auto=format&fit=crop&q=80&w=400",
    createdAt: "2026-02-23",
  },
  {
    id: "review-2",
    wineName: "카파르조 BDM 라 까사 2019",
    wineRegion: "이탈리아",
    wineType: "Red",
    vintage: 2019,
    rating: 5,
    body: 5,
    tannin: 4,
    sweetness: 1,
    acidity: 4,
    comment:
      "브루넬로 디 몬탈치노의 정수를 느낄 수 있는 와인이에요. 체리와 가죽향이 복합적으로 어우러지고, 긴 여운이 인상적이었어요. 특별한 날에 다시 마시고 싶은 와인!",
    tags: ["Cherry", "Leather", "Tobacco"],
    imageUrl:
      "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&q=80&w=400",
    createdAt: "2026-02-22",
  },
  {
    id: "review-3",
    wineName: "펜폴즈 베이비 그랜지",
    wineRegion: "바로사밸리",
    wineType: "Red",
    vintage: 2020,
    rating: 4,
    body: 4,
    tannin: 4,
    sweetness: 2,
    acidity: 3,
    comment:
      "과일향이 풍부하면서도 구조감이 탄탄한 와인. 블랙베리와 자두 향이 매력적이고, 오크 뉘앙스가 좋아요. 가성비 좋은 시라즈를 찾는다면 추천!",
    tags: ["Blackberry", "Oak", "Vanilla"],
    imageUrl:
      "https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?auto=format&fit=crop&q=80&w=400",
    createdAt: "2026-02-20",
  },
]

/**
 * 목(mock) 댓글 데이터
 * Supabase 연동 전 임시 사용 / 개발 폴백용
 */
export const MOCK_COMMENTS: CommentItem[] = [
  {
    id: "comment-1",
    reviewId: "review-1",
    nickname: "와인초보",
    avatarEmoji: "🍷",
    content:
      "저도 이 와인 마셔봤는데 정말 맛있었어요! 스테이크 페어링 꿀팁 감사해요 😊",
    createdAt: "2026-02-23 14:30",
  },
  {
    id: "comment-2",
    reviewId: "review-1",
    nickname: "소믈리에지망생",
    avatarEmoji: "🥂",
    content:
      "오크 숙성 느낌이 좋다니, 바로사밸리 시라즈도 한번 드셔보세요. 비슷한 느낌인데 좀 더 스파이시해요.",
    createdAt: "2026-02-24 09:15",
  },
  {
    id: "comment-3",
    reviewId: "review-2",
    nickname: "이탈리아덕후",
    avatarEmoji: "🇮🇹",
    content:
      "브루넬로 디 몬탈치노 진짜 좋죠! 가격대가 있지만 그만한 값을 하는 것 같아요.",
    createdAt: "2026-02-22 18:45",
  },
  {
    id: "comment-4",
    reviewId: "review-2",
    nickname: "레드와인러버",
    avatarEmoji: "❤️",
    content: "5점 만점이라니 꼭 마셔봐야겠어요. 어디서 구매하셨나요?",
    createdAt: "2026-02-23 11:20",
  },
  {
    id: "comment-5",
    reviewId: "review-2",
    nickname: "와인메이트",
    avatarEmoji: "🍇",
    content: "가죽향이라니 흥미롭네요. 디캔팅은 얼마나 하셨나요?",
    createdAt: "2026-02-24 16:00",
  },
  {
    id: "comment-6",
    reviewId: "review-3",
    nickname: "가성비왕",
    avatarEmoji: "💰",
    content: "펜폴즈 베이비 그랜지 가성비 정말 좋죠! 저도 자주 사먹어요 👍",
    createdAt: "2026-02-21 20:30",
  },
]

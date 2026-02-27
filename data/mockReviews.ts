import type { ReviewItem } from "@/types/review"
import type { CommentItem } from "@/types/review"

/**
 * 목(mock) 리뷰 데이터
 * Supabase 연동 전 임시 사용 / 개발 폴백용
 */
export const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: "review-1",
    wineId: 0,
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
    nickname: "와이너리",
    createdAt: "2026-02-23",
  },
  {
    id: "review-2",
    wineId: 0,
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
    nickname: "와이너리",
    createdAt: "2026-02-22",
  },
  {
    id: "review-3",
    wineId: 0,
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
    nickname: "와이너리",
    createdAt: "2026-02-20",
  },
  {
    id: "review-4",
    wineId: 0,
    wineName: "돈나푸가타 안씰리아",
    wineRegion: "시칠리아",
    wineType: "White",
    vintage: 2022,
    rating: 4,
    body: 3,
    tannin: 1,
    sweetness: 2,
    acidity: 4,
    comment:
      "상큼한 시트러스 향과 흰 꽃의 아로마가 일품이에요. 해산물 요리와 아주 잘 어울리는 깨끗하고 상쾌한 화이트 와인입니다.",
    tags: ["Citrus", "White Flower", "Mineral"],
    imageUrl:
      "https://images.unsplash.com/photo-1559154661-bc4f954f9a0d?auto=format&fit=crop&q=80&w=400",
    nickname: "와이너리",
    createdAt: "2026-02-25",
  },
  {
    id: "review-5",
    wineId: 0,
    wineName: "모엣 샹동 임페리얼",
    wineRegion: "샹파뉴",
    wineType: "Sparkling",
    vintage: 0,
    rating: 5,
    body: 3,
    tannin: 1,
    sweetness: 2,
    acidity: 5,
    comment:
      "역시 실망시키지 않는 품질. 고운 기포와 사과, 배의 상큼함, 그리고 구운 빵의 풍미가 조화로워요. 축하할 일이 있을 때 필수!",
    tags: ["Apple", "Pear", "Brioche"],
    imageUrl:
      "https://images.unsplash.com/photo-1594498653385-d5172c532c00?auto=format&fit=crop&q=80&w=400",
    nickname: "와이너리",
    createdAt: "2026-02-24",
  },
]

import { createClient } from "@/supabase/server"
import { toReviewItem, type ReviewRow } from "@/types/supabase"
import { MOCK_REVIEWS } from "@/data/mockReviews"
import HomeView from "@/components/HomeView"
import { readFileSync } from "fs"
import { join } from "path"
import type { WineInfoLocal } from "@/types/wine"
import type { Metadata } from "next"
function loadLocalWineMap(): Map<number, WineInfoLocal> {
  try {
    const filePath = join(process.cwd(), "data", "wine-info.json")
    const wines = JSON.parse(readFileSync(filePath, "utf-8")) as WineInfoLocal[]
    return new Map(wines.map((w) => [w.WINE_ID, w]))
  } catch {
    return new Map()
  }
}

export const metadata: Metadata = {
  title: "와이너리",
  description: "우리만 아는 와인 리뷰",
}

async function getRecentReviews(
  supabase: any,
  localWineMap: Map<number, WineInfoLocal>,
) {
  try {
    const { data: reviewsData, error: reviewsError } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    if (reviewsError || !reviewsData || reviewsData.length === 0) {
      return MOCK_REVIEWS
    }

    // 커스텀 와인 일괄 조회
    const customWineIds = Array.from(
      new Set(
        reviewsData.filter((r: any) => r.is_custom).map((r: any) => r.wine_id),
      ),
    )

    let customWineMap = new Map<number, WineInfoLocal>()
    if (customWineIds.length > 0) {
      const { data: customWines } = await supabase
        .from("custom_wines")
        .select("*")
        .in("wine_id", customWineIds)
      if (customWines) {
        customWines.forEach((w: any) =>
          customWineMap.set(w.wine_id, {
            WINE_ID: w.wine_id,
            WINE_NM: w.wine_nm,
            WINE_NM_KR: w.wine_nm_kr,
            WINE_AREA: w.wine_area,
            WINE_CATEGORY: w.wine_category,
            WINE_ABV: w.wine_abv,
            WINE_PRC: w.wine_prc,
          }),
        )
      }
    }

    return (reviewsData as ReviewRow[]).map((row) => {
      const wine = row.is_custom
        ? customWineMap.get(row.wine_id)
        : localWineMap.get(row.wine_id)
      return toReviewItem(row, wine)
    })
  } catch (err) {
    console.error("Error fetching recent reviews:", err)
    return MOCK_REVIEWS
  }
}

async function getRecommendedWines(
  supabase: any,
  localWineMap: Map<number, WineInfoLocal>,
) {
  try {
    const { data: wineIdsWithReviews, error: idsError } = await supabase
      .from("reviews")
      .select("wine_id, is_custom")

    if (idsError || !wineIdsWithReviews) return []

    const uniqueWines = Array.from(
      new Set(
        wineIdsWithReviews.map((w: any) => `${w.wine_id}:${w.is_custom}`),
      ),
    ).map((s: any) => {
      const [id, custom] = (s as string).split(":")
      return { id: parseInt(id), isCustom: custom === "true" }
    })

    // Math.random() 대신 날짜 기반 시드로 결정론적 선택 (hydration mismatch 방지)
    const d = new Date()
    const dateSeed =
      d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
    const selected = [...uniqueWines]
      .sort((a, b) => ((a.id * dateSeed) % 997) - ((b.id * dateSeed) % 997))
      .slice(0, 2)
    const recommendedWines: WineInfoLocal[] = []

    for (const item of selected) {
      // 해당 와인의 리뷰 개수 계산
      const reviewCount = wineIdsWithReviews.filter(
        (w: any) => w.wine_id === item.id && w.is_custom === item.isCustom,
      ).length

      if (item.isCustom) {
        const { data: cw } = await supabase
          .from("custom_wines")
          .select("*")
          .eq("wine_id", item.id)
          .maybeSingle()
        if (cw) {
          recommendedWines.push({
            WINE_ID: cw.wine_id,
            WINE_NM: cw.wine_nm,
            WINE_NM_KR: cw.wine_nm_kr,
            WINE_AREA: cw.wine_area,
            WINE_CATEGORY: cw.wine_category,
            WINE_ABV: cw.wine_abv,
            WINE_PRC: cw.wine_prc,
            reviewCount,
          })
        }
      } else {
        const lw = localWineMap.get(item.id)
        if (lw) {
          recommendedWines.push({
            ...lw,
            reviewCount,
          })
        }
      }
    }
    return recommendedWines
  } catch (err) {
    console.error("Error fetching recommended wines:", err)
    return []
  }
}

export default async function HomePage() {
  const supabase = await createClient()
  const localWineMap = loadLocalWineMap()

  const [reviews, recommendedWines] = await Promise.all([
    getRecentReviews(supabase, localWineMap),
    getRecommendedWines(supabase, localWineMap),
  ])

  return <HomeView reviews={reviews} recommendedWines={recommendedWines} />
}

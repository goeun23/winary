import { createClient } from "@/supabase/server"
import { toReviewItem, type ReviewRow } from "@/types/supabase"
import { MOCK_REVIEWS } from "@/data/mockReviews"
import MainPage from "@/components/MainPage"
import { readFileSync } from "fs"
import { join } from "path"
import type { WineInfoLocal } from "@/types/wine"

function loadLocalWineMap(): Map<number, WineInfoLocal> {
  try {
    const filePath = join(process.cwd(), "data", "wine-info.json")
    const wines = JSON.parse(readFileSync(filePath, "utf-8")) as WineInfoLocal[]
    return new Map(wines.map((w) => [w.WINE_ID, w]))
  } catch {
    return new Map()
  }
}

export default async function HomePage() {
  let reviews = MOCK_REVIEWS

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20)

    if (!error && data && data.length > 0) {
      const localWineMap = loadLocalWineMap()

      // 커스텀 와인 일괄 조회
      const customWineIds = data.filter((r) => r.is_custom).map((r) => r.wine_id)
      let customWineMap = new Map<number, WineInfoLocal>()
      if (customWineIds.length > 0) {
        const { data: customWines } = await supabase
          .from("custom_wines")
          .select("*")
          .in("wine_id", customWineIds)
        if (customWines) {
          customWines.forEach((w) =>
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

      reviews = (data as ReviewRow[]).map((row) => {
        const wine = row.is_custom
          ? customWineMap.get(row.wine_id)
          : localWineMap.get(row.wine_id)
        return toReviewItem(row, wine)
      })
    }
  } catch {
    // Supabase 미설정 시 mock 데이터 사용
  }

  return <MainPage reviews={reviews} />
}

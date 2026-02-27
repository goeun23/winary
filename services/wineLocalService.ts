import type { WineInfoLocal } from "../types/wine"
import wineData from "../data/wine-info.json"
const allWines = wineData as WineInfoLocal[]
/**
 * 로컬 wine-info.json에서 와인을 검색합니다.
 * 클라이언트 번들 크기를 줄이기 위해 API Route를 통해 서버에서 검색합니다.
 */
export const searchLocalWines = (
  query: string,
  limit = 20,
): WineInfoLocal[] => {
  if (!query.trim()) return []

  const lowerQuery = query.toLowerCase().trim()

  const results: WineInfoLocal[] = []
  for (const wine of allWines) {
    if (
      wine.WINE_NM.toLowerCase().includes(lowerQuery) ||
      wine.WINE_NM_KR.includes(query.trim())
    ) {
      results.push(wine)
      if (results.length >= limit) break
    }
  }

  return results
}

export const getLocalWineById = (wineId: number): WineInfoLocal | null => {
  return allWines.find((w) => w.WINE_ID === wineId) || null
}

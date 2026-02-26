import type { GWSResponse, GWSResult } from "../types/wine"

const BASE_URL = "https://api.globalwinescore.com/globalwinescores/"
// 실제 서비스에서는 환경변수로 관리해야 합니다.
const API_TOKEN = "64413f4864147610091d3187c3202956cf535492"

/**
 * 와인 검색 API 호출 함수
 */
export const searchWines = async (query: string): Promise<GWSResult[]> => {
  if (!query) return []

  try {
    const response = await fetch(
      `${BASE_URL}?wine=${encodeURIComponent(query)}&limit=10`,
      {
        headers: {
          Authorization: `Token ${API_TOKEN}`,
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data: GWSResponse = await response.json()
    return data.results
  } catch (error) {
    console.error("Failed to fetch wines:", error)
    return []
  }
}

import { NextRequest, NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"
import type { WineInfoLocal } from "@/types/wine"

// 서버 메모리에 한 번만 로드 (Node.js 모듈 캐시 활용)
let wineCache: WineInfoLocal[] | null = null

function getWineData(): WineInfoLocal[] {
  if (!wineCache) {
    const filePath = join(process.cwd(), "data", "wine-info.json")
    wineCache = JSON.parse(readFileSync(filePath, "utf-8")) as WineInfoLocal[]
  }
  return wineCache
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") ?? ""
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 50)

  if (!query.trim()) {
    return NextResponse.json([])
  }

  const allWines = getWineData()
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

  return NextResponse.json(results)
}

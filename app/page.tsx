import { createClient } from "@/lib/supabase/server"
import { toReviewItem } from "@/types/supabase"
import { MOCK_REVIEWS } from "@/data/mockReviews"
import MainPage from "@/components/MainPage"

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
      reviews = data.map(toReviewItem)
    }
  } catch {
    // Supabase 미설정 시 mock 데이터 사용
  }

  return <MainPage reviews={reviews} />
}

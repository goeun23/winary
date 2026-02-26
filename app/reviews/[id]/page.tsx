import PageHeader from "@/components/PageHeader"
import type { WineInfoLocal } from "@/types/wine"
import type { LocalReview } from "@/types/review"

interface ReviewDetailRouteProps {
  wine: WineInfoLocal
  onBack: () => void
  onSubmit: () => void
  editReview?: LocalReview
  editToken?: string
}

const ReviewWritePage = ({
  onBack,

  editReview,
}: ReviewDetailRouteProps) => {
  const isEditMode = !!editReview

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        paddingBottom: "100px",
        fontFamily: "Pretendard, -apple-system, sans-serif",
      }}
    >
      <PageHeader
        title={isEditMode ? "리뷰 수정" : "맛과 생각 기록"}
        onBack={onBack}
        backgroundColor="rgba(249, 250, 251, 0.85)"
      />
    </div>
  )
}

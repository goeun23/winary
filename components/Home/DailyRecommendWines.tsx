import { WineInfoLocal } from "@/types/wine"
import Text from "../common/Text"
import WineTypeBadge from "../common/WineTypeBadge"

type DailyRecommendWinesProps = {
  recommendedWines: WineInfoLocal[]
  handleWineDetailClick?: (wineId: number) => void
}
const DailyRecommendWines = ({
  recommendedWines,
  handleWineDetailClick,
}: DailyRecommendWinesProps) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        padding: "0 20px",
      }}
    >
      {recommendedWines.map((item) => (
        <div
          onClick={() => handleWineDetailClick?.(item.WINE_ID)}
          key={item.WINE_ID}
          style={{
            backgroundColor: "var(--adaptiveGrey50)",
            borderRadius: "16px",
            overflow: "hidden",
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            <img
              src={`/images/${item.WINE_CATEGORY}_ICON.png`}
              alt={item.WINE_ID.toString()}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "14px",
                backgroundColor: "#fff",
              }}
            />
          </div>
          <div style={{ padding: "0 14px 14px 14px" }}>
            <div>
              <Text
                typography="t7"
                fontWeight="600"
                style={{
                  color: "var(--adaptiveGrey800)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {item.WINE_NM_KR}({item.WINE_NM})
              </Text>
            </div>
            <Text
              typography="t7"
              fontWeight="600"
              style={{
                color: "var(--adaptiveGrey900)",
                fontSize: "11px",
              }}
            >
              {item.reviewCount}건의 리뷰 |{" "}
              <WineTypeBadge wineType={item.WINE_CATEGORY} /> | {item.WINE_ABV}%
            </Text>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DailyRecommendWines

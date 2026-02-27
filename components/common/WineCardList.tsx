import React from "react"
import { WineInfoLocal } from "@/types/wine"
import ListRow from "@/components/common/List/ListRow"
import Text from "./Text"
import RightArrow from "./RightArrow"
import WineIcon from "./WineIcon"
import WineTypeBadge from "./WineTypeBadge"

type WineCardListProps = {
  results: WineInfoLocal[]
  onSelectWine?: (wine: WineInfoLocal) => void
}

const WineCardList = ({ results, onSelectWine }: WineCardListProps) => {
  return (
    <>
      {results.map((wine) => {
        return (
          <div key={wine.WINE_ID} className="wine-item">
            <ListRow
              left={<WineIcon wineType={wine.WINE_CATEGORY} />}
              contents={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <Text typography="t6" fontWeight="bold">
                    {wine.WINE_NM}
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <WineTypeBadge wineType={wine.WINE_CATEGORY} />
                    <span style={{ color: "var(--adaptiveGrey300)" }}>|</span>
                    <Text typography="st2" color="var(--adaptiveGrey500)">
                      {wine.WINE_AREA} | {`${wine.WINE_ABV}%`}
                    </Text>
                  </div>
                </div>
              }
              onClick={() => onSelectWine && onSelectWine(wine)}
              right={<RightArrow />}
            />
          </div>
        )
      })}
    </>
  )
}

export default WineCardList

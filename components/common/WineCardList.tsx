import React from "react"
import { WineInfoLocal } from "@/types/wine"
import { Badge, ListRow, Text } from "@toss/tds-mobile"

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
                <ListRow.Texts
                  type="2RowTypeA"
                  top={wine.WINE_NM}
                  bottom={
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <WineTypeBadge wineType={wine.WINE_CATEGORY} />|{" "}
                      {wine.WINE_AREA} | {`${wine.WINE_ABV}%`}
                    </span>
                  }
                />
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

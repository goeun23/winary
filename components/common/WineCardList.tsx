import React from "react"
import { CATEGORY_COLORS, CATEGORY_LABELS, WineInfoLocal } from "@/types/wine"
import { Badge, ListRow, Text } from "@toss/tds-mobile"

import RightArrow from "./RightArrow"

type WineCardListProps = {
  results: WineInfoLocal[]
  onSelectWine?: (wine: WineInfoLocal) => void
}

const WineCardList = ({ results, onSelectWine }: WineCardListProps) => {
  return (
    <>
      {results.map((wine) => {
        const categoryLabel =
          CATEGORY_LABELS[wine.WINE_CATEGORY as keyof typeof CATEGORY_LABELS] ||
          wine.WINE_CATEGORY

        // Simple color mapping for badges
        let badgeColor:
          | "blue"
          | "red"
          | "teal"
          | "green"
          | "yellow"
          | "elephant" = "blue"
        if (wine.WINE_CATEGORY === "RED") badgeColor = "red"
        else if (wine.WINE_CATEGORY === "WHITE") badgeColor = "teal"
        else if (wine.WINE_CATEGORY === "ROSE") badgeColor = "red"
        else if (wine.WINE_CATEGORY === "DESSERT") badgeColor = "yellow"

        return (
          <div key={wine.WINE_ID} className="wine-item">
            <ListRow
              left={<></>}
              contents={
                <ListRow.Texts
                  type="2RowTypeA"
                  top={wine.WINE_NM}
                  bottom={
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <Badge size="xsmall" color={badgeColor} variant="weak">
                        {categoryLabel}
                      </Badge>
                      <Badge size="xsmall" color="elephant" variant="weak">
                        {wine.WINE_AREA}
                      </Badge>
                    </div>
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

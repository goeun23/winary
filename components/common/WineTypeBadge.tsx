import { Badge } from "@toss/tds-mobile"
import { WineCategory } from "@/types/wine"
type WineTypeBadgeProps = {
  wineType: WineCategory | string
}

const TypeInfo: Record<string, { label: string; color: any }> = {
  RED: {
    label: "레드",
    color: "red",
  },
  WHITE: {
    label: "화이트",
    color: "yellow",
  },
  SPARKLING: {
    label: "스파클링",
    color: "green",
  },
  ROSE: {
    label: "로제",
    color: "red",
  },
  DESSERT: {
    label: "디저트",
    color: "blue",
  },
  CHAMP: {
    label: "샴페인",
    color: "blue",
  },
}

const WineTypeBadge = ({ wineType }: WineTypeBadgeProps) => {
  const info = TypeInfo[wineType]

  if (!info) {
    return (
      <Badge size="small" color="elephant" variant="weak">
        {wineType}
      </Badge>
    )
  }

  return (
    <Badge size="small" color={info.color} variant="weak">
      {info.label}
    </Badge>
  )
}

export default WineTypeBadge

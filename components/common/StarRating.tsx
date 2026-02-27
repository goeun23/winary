import { Rating } from "@toss/tds-mobile"

type StarRatingProps = {
  value: number
}

const StarRating = ({ value }: StarRatingProps) => {
  return (
    <Rating
      readOnly={false}
      value={value}
      max={5}
      size="tiny"
      variant="compact"
      aria-label="별점 평가"
    />
  )
}

export default StarRating

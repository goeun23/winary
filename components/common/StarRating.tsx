import Text from "./Text"

type StarRatingProps = {
  value: number
}

const StarRating = ({ value }: StarRatingProps) => {
  const roundedValue = Math.round(value * 2) / 2 // 0.5 unit

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = star <= roundedValue
        const isHalf = star - 0.5 === roundedValue

        return (
          <span key={star} style={{ fontSize: "14px", lineHeight: 1 }}>
            {isFull ? (
              <span style={{ color: "#ffb400" }}>★</span>
            ) : isHalf ? (
              <span
                style={{
                  position: "relative",
                  display: "inline-block",
                  color: "var(--adaptiveGrey200)",
                }}
              >
                ★
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "50%",
                    overflow: "hidden",
                    color: "#ffb400",
                  }}
                >
                  ★
                </span>
              </span>
            ) : (
              <span style={{ color: "var(--adaptiveGrey200)" }}>★</span>
            )}
          </span>
        )
      })}
      <Text
        typography="t7"
        fontWeight="bold"
        style={{ marginLeft: "4px", color: "var(--adaptiveGrey600)" }}
      >
        {value.toFixed(1)}
      </Text>
    </div>
  )
}

export default StarRating

import ListRow from "@/components/common/List/ListRow"
import Text from "@/components/common/Text"

export const CharacteristicBar = ({
  label,
  emoji,
  value,
}: {
  label: string
  emoji: string
  value: number
}) => (
  <ListRow
    contents={
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Text typography="t6">{emoji}</Text>
        <Text typography="t6" fontWeight="500" color="var(--adaptiveGrey700)">
          {label}
        </Text>
      </div>
    }
    right={
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "100px",
            flexShrink: 0,
            display: "flex",
            gap: "4px",
            alignItems: "center",
          }}
        >
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              style={{
                flex: 1,
                height: "8px",
                borderRadius: "4px",
                backgroundColor:
                  level <= Math.round(value)
                    ? "var(--adaptiveBlue500)"
                    : "var(--adaptiveGrey100)",
                transition: "background-color 0.3s ease",
              }}
            />
          ))}
        </div>
        <Text
          typography="t7"
          fontWeight="bold"
          color="var(--adaptiveBlue500)"
          style={{
            minWidth: "30px",
            textAlign: "right",
          }}
        >
          {value > 0 ? value.toFixed(1) : value}/5
        </Text>
      </div>
    }
  />
)

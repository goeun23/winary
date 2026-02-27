import { ListRow, Text } from "@toss/tds-mobile"
export const CharacteristicBar = ({
  label,
  emoji,
  value,
}: {
  label: string
  emoji: string
  value: number
}) => (
  <>
    <ListRow
      contents={
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Text style={{ fontSize: "16px" }}>{emoji}</Text>
          <Text style={{ fontSize: "15px", fontWeight: 500, color: "#4e5968" }}>
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
                    level <= Math.round(value) ? "#3182f6" : "#e5e8eb",
                  transition: "background-color 0.3s ease",
                }}
              />
            ))}
          </div>
          <Text
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "#3182f6",
              minWidth: "30px",
              textAlign: "right",
            }}
          >
            {value > 0 ? value.toFixed(1) : value}/5
          </Text>
        </div>
      }
    />
  </>
)

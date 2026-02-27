import { Text } from "@toss/tds-mobile"
export const CharacteristicBar = ({
  label,
  emoji,
  value,
}: {
  label: string
  emoji: string
  value: number
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "14px",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        minWidth: "72px",
      }}
    >
      <span style={{ fontSize: "16px" }}>{emoji}</span>
      <Text style={{ fontSize: "14px", fontWeight: 600, color: "#4e5968" }}>
        {label}
      </Text>
    </div>
    <div
      style={{
        flex: 1,
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
            backgroundColor: level <= value ? "#3182f6" : "#e5e8eb",
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
      {value}/5
    </Text>
  </div>
)

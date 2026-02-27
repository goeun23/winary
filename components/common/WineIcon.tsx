const WineIcon = ({ wineType }: { wineType: string }) => {
  return (
    <div
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: "var(--adaptiveGrey100)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "4px",
      }}
    >
      <img
        src={`/images/${wineType.toUpperCase()}_ICON.png`}
        alt={wineType}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  )
}

export default WineIcon

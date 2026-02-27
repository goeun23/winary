"use client"
import React, { useEffect, useState } from "react"
import { Text } from "@toss/tds-mobile"

interface ToastProps {
  message: string
  duration?: number
  onClose: () => void
}

export const Toast = ({ message, duration = 2500, onClose }: ToastProps) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // 마운트 직후 애니메이션 시작
    const startTimer = setTimeout(() => setVisible(true), 10)

    // 종료 타이머
    const hideTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300) // 애니메이션 끝난 후 상태 제거
    }, duration)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(hideTimer)
    }
  }, [duration, onClose])

  return (
    <div
      style={{
        position: "fixed",
        bottom: "100px",
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? "0" : "20px"})`,
        opacity: visible ? 1 : 0,
        backgroundColor: "rgba(33, 37, 41, 0.9)",
        backdropFilter: "blur(8px)",
        borderRadius: "18px",
        padding: "14px 24px",
        zIndex: 9999,
        transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
        pointerEvents: "none",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "200px",
      }}
    >
      <Text
        style={{
          color: "#ffffff",
          fontSize: "15px",
          fontWeight: "600",
          textAlign: "center",
          letterSpacing: "-0.3px",
        }}
      >
        {message}
      </Text>
    </div>
  )
}

/**
 * 메인 페이지의 카드 데이터를 정의하는 인터페이스입니다.
 */
export interface MainCardItem {
  id: string
  title: string
  iconUrl?: string // 또는 이모지/컴포넌트
  description?: string
  type: "square" | "wide"
}

/**
 * 헤더 정보를 담는 인터페이스입니다.
 */
export interface MainHeaderInfo {
  emoji: string
  subTitle: string
  mainTitle: string
  description: string
}

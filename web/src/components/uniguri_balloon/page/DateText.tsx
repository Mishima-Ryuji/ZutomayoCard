import { FC } from "react"

interface DateTextProps {
  date: Date
}
export const DateText: FC<DateTextProps> = ({ date }) => {
  const now = new Date()
  if (
    now.getFullYear() === date.getFullYear()
    && now.getMonth() === date.getMonth()
    && now.getDate() === date.getDate()
  ) return "今日"
  let text = ""
  text += now.getFullYear() === date.getFullYear() ? "" : `${date.getFullYear()}年 `
  text += `${date.getMonth()}月${date.getDate()}日`
  return text
}

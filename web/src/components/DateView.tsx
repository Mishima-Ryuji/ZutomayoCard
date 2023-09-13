import { FC, useMemo } from "react"

interface DateViewProps {
  type?: "date" | "datetime"
  date: Date
  hideYearIfThisYear?: boolean
}
export const DateView: FC<DateViewProps> = ({ type = "datetime", date, hideYearIfThisYear = true }) => {
  const thisYear = useMemo(() => new Date().getFullYear(), [])
  return (
    <>
      {(!hideYearIfThisYear || thisYear !== date.getFullYear()) && <>
        {date.getFullYear()}年
      </>}
      {date.getMonth() + 1}月
      {date.getDate()}日
      {type === "datetime" && <>
        {date.getHours()}時
        {date.getMinutes()}分
      </>}
    </>
  )
}

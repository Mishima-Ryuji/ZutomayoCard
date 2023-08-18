import { Input, InputProps } from "@chakra-ui/react"
import { Timestamp } from "firebase/firestore"
import { FC } from "react"

type InputTimestampProps = Omit<InputProps, "value" | "onChange"> & {
  value: Timestamp
  onChange: (value: Timestamp) => void
}
export const InputTimestamp: FC<InputTimestampProps> = ({ value, onChange, ...inputProps }) => {
  const displayDate = value.toDate()
  const timezoneOffset = displayDate.getTimezoneOffset()
  displayDate.setMinutes(displayDate.getMinutes() - timezoneOffset)
  return (
    <Input type="datetime-local" w="fit-content"
      value={displayDate.toISOString().replace("Z", "")}
      onChange={e => {
        const updateDate = new Date(e.target.value)
        onChange(
          Timestamp.fromDate(updateDate)
        )
      }}
      {...inputProps}
    />
  )
}

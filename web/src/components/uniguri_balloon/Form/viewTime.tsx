import { Box, Button, Collapse, FormControl, FormLabel, HStack, Radio, RadioGroup } from "@chakra-ui/react"
import { Timestamp } from "firebase/firestore"
import { FC, useState } from "react"
import { InputTimestamp } from "~/components/InputTimestamp"
import { after, maxTimestamp, minTimestamp, set } from "~/firebase"
import { UniguriBalloon } from "~/shared/firebase/firestore/scheme/uniguriBalloon"

type ViewTime = "everytime" | "with-limit"

interface InputUniguriBalloonViewTimeProps {
  startAt: UniguriBalloon["start_at"]
  endAt: UniguriBalloon["end_at"]
  enable: UniguriBalloon["enable"]
  onChangeStartAt: (startAt: UniguriBalloon["start_at"]) => void
  onChangeEndAt: (endAt: UniguriBalloon["end_at"]) => void
}
export const InputUniguriBalloonViewTime: FC<InputUniguriBalloonViewTimeProps> = ({ startAt, endAt, onChangeStartAt, onChangeEndAt, enable }) => {
  const [viewTime, setViewTime] = useState<ViewTime>(
    ((enable ?? false))
      ? "everytime"
      : "with-limit"
  )
  return (
    <FormControl my={8}>
      <FormLabel>
        3. 表示期間
      </FormLabel>
      <RadioGroup value={viewTime} onChange={value => setViewTime(value as ViewTime)}>
        <Radio value="everytime" onChange={e => {
          if (e.target.checked) {
            onChangeStartAt(minTimestamp)
            onChangeEndAt(maxTimestamp)
          }
        }}>
          ずっと
        </Radio>
        <Radio value="with-limit" onChange={e => {
          if (e.target.checked) {
            onChangeStartAt(startAt ?? minTimestamp)
            onChangeEndAt(endAt ?? maxTimestamp)
          }
        }}>
          表示期間を設ける
        </Radio>
      </RadioGroup>

      <Collapse in={viewTime === "with-limit"} animateOpacity>
        <Box px={4}>
          <InputTimestamp
            value={startAt}
            onChange={value => onChangeStartAt(value)}
          />
          〜
          <InputTimestamp
            value={endAt}
            onChange={value => onChangeEndAt(value)}
          />
          まで
          <ViewTimeSuggestions
            {...{ startAt, endAt, onChangeStartAt, onChangeEndAt, }}
          />
        </Box>
      </Collapse>

    </FormControl>
  )
}

interface ViewTimeSuggestionsProps {
  startAt: Timestamp
  endAt: Timestamp
  onChangeStartAt: (startAt: UniguriBalloon["start_at"]) => void
  onChangeEndAt: (endAt: UniguriBalloon["end_at"]) => void
}
const ViewTimeSuggestions: FC<ViewTimeSuggestionsProps> = ({ startAt, onChangeStartAt, onChangeEndAt }) => {
  const startDateText = `${startAt.toDate().getMonth() + 1}月${startAt.toDate().getDate()}日`
  return (
    <Box p={2}>
      もしかして...
      <HStack flexWrap="wrap" my={2} spacing={1}>

        <Button onClick={() => onChangeEndAt(after(startAt, { day: 1 }))} size="xs">
          {startDateText}
          のみ
        </Button>

        <Button onClick={() => onChangeEndAt(after(startAt, { day: 3 }))} size="xs">
          {startDateText}
          から3日間
        </Button>

        <Button onClick={() => onChangeEndAt(after(startAt, { day: 7 * 1 }))} size="xs">
          {startDateText}
          から1週間
        </Button>

        <Button onClick={() => onChangeEndAt(after(startAt, { day: 7 * 2 }))} size="xs">
          {startDateText}
          から2週間
        </Button>

        <Button onClick={() => onChangeEndAt(after(startAt, { month: 1 }))} size="xs">
          {startDateText}
          から1ヶ月
        </Button>

        <Button onClick={() => onChangeEndAt(after(startAt, { month: 2 }))} size="xs">
          {startDateText}
          から2ヶ月
        </Button>

        <Button onClick={() => onChangeEndAt(after(startAt, { month: 3 }))} size="xs">
          {startDateText}
          から3ヶ月
        </Button>

      </HStack>

      <HStack flexWrap="wrap" my={2} spacing={1}>

        <Button onClick={() => {
          const start = set(after(Timestamp.now(), { day: 1 }), { hour: 0, minute: 0, second: 0, milliSeccond: 0 })
          onChangeStartAt(start)
          onChangeEndAt(after(start, { day: 1 }))
        }} size="xs">
          明日のみ
        </Button>

        <Button onClick={() => {
          const start = set(after(Timestamp.now(), { month: 1 }), { day: 1, hour: 0, minute: 0, second: 0, milliSeccond: 0 })
          onChangeStartAt(start)
          onChangeEndAt(after(start, { month: 1 }))
        }} size="xs">
          来月のみ
        </Button>

      </HStack>

    </Box>)
}

export const useInputUniguriBalloonViewTime = ({ enable, defaultValue }: {
  enable: UniguriBalloon["enable"]
  defaultValue: {
    startAt: UniguriBalloon["start_at"]
    endAt: UniguriBalloon["end_at"]
  }
}) => {
  const [startAt, setStartAt] = useState(defaultValue.startAt ?? minTimestamp)
  const [endAt, setEndAt] = useState(defaultValue.endAt ?? maxTimestamp)
  const now = new Date().valueOf()
  const inLimit = startAt.toMillis() <= now && now <= endAt.toMillis()
  const props = {
    startAt,
    endAt,
    enable,
    onChangeStartAt: setStartAt,
    onChangeEndAt: setEndAt,
  } satisfies Partial<InputUniguriBalloonViewTimeProps>
  return {
    startAt,
    endAt,
    inLimit,
    isValid: true,
    props,
  }
}

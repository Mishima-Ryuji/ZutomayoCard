import { Checkbox, FormControl, FormLabel } from "@chakra-ui/react"
import { FC, ReactNode, useState } from "react"
import { UniguriBalloon } from "~/shared/firebase/firestore/scheme/uniguriBalloon"

interface InputUniguriBalloonPublishProps {
  enable: UniguriBalloon["enable"]
  onChange: (enable: UniguriBalloon["enable"]) => void
  label?: ReactNode
}
export const InputUniguriBalloonPublish: FC<InputUniguriBalloonPublishProps> = ({ enable, onChange, label = "公開設定" }) => {
  return (
    <FormControl my={8}>
      <FormLabel>
        {label}
      </FormLabel>
      <Checkbox
        isChecked={enable}
        onChange={e => onChange(e.target.checked)}
      >
        公開する
      </Checkbox>
    </FormControl>
  )
}

export const useInputUniguriBalloonPublish = ({ defaultValue }: {
  defaultValue: UniguriBalloon["enable"]
}) => {
  const [enable, setEnable] = useState(defaultValue ?? false)
  const props = {
    enable,
    onChange: setEnable,
  } satisfies Partial<InputUniguriBalloonPublishProps>
  return {
    value: enable,
    isValid: true,
    props
  }
}

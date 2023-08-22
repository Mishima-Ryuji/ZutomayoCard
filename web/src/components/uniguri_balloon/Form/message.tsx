import { FormControl, FormHelperText, FormLabel, ListItem, Textarea, UnorderedList } from "@chakra-ui/react"
import { FC, ReactNode, useState } from "react"
import { UniguriBalloon } from "~/shared/firebase/firestore/scheme/uniguriBalloon"

interface InputUniguriBalloonMessageProps {
  message: UniguriBalloon["message"]
  onChange: (message: UniguriBalloon["message"]) => void
  label?: ReactNode
}
export const InputUniguriBalloonMessage: FC<InputUniguriBalloonMessageProps> = ({ message, onChange, label = "うにぐりくんのセリフ" }) => {
  const isValidMessage = message.trim() !== ""
  return (
    <FormControl my={8}>
      <FormLabel>
        {label}
      </FormLabel>
      <Textarea
        value={message}
        onChange={e => onChange(e.target.value)}
        rows={3}
        maxLength={50}
        isInvalid={!isValidMessage}
      />
      <FormHelperText>
        <UnorderedList>
          <ListItem>
            50文字まで入力できます
          </ListItem>
        </UnorderedList>
      </FormHelperText>
    </FormControl>
  )
}

export const useInputUniguriBalloonMessage = ({ defaultValue }: {
  defaultValue: UniguriBalloon["message"]
}) => {
  const [message, setMessage] = useState(defaultValue ?? "")
  const isValid = message.trim() !== ""
  const props = {
    message,
    onChange: setMessage,
  } satisfies Partial<InputUniguriBalloonMessageProps>
  return {
    value: message,
    isValid,
    props,
  }
}

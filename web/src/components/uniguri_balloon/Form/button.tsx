import { Box, Collapse, FormControl, FormHelperText, FormLabel, Input, ListItem, Radio, RadioGroup, UnorderedList } from "@chakra-ui/react"
import { Dispatch, FC, ReactNode, SetStateAction, useState } from "react"
import { UniguriBalloon } from "~/shared/firebase/firestore/scheme/uniguriBalloon"

const buttonTextMaxLength = 12

interface InputUniguriBalloonButtonProps {
  button: UniguriBalloon["button"]
  onChange: Dispatch<SetStateAction<UniguriBalloon["button"]>>
  label?: ReactNode
}
export const InputUniguriBalloonButton: FC<InputUniguriBalloonButtonProps> = ({ button, onChange, label = "ボタン" }) => {
  const isValidButton = button === null || (button?.type === "link" && button.text.length <= buttonTextMaxLength)
  return (
    <FormControl my={8}>
      <FormLabel>
        {label}
      </FormLabel>
      <FormHelperText>
        吹き出しの下にボタンを設置できます。
      </FormHelperText>

      <RadioGroup
        value={button?.type ?? "hidden"}
        onChange={(value) => onChange(
          value === "link"
            ? { type: "link", href: "https://zutomayo-card.com", text: "トップページへ" }
            : null
        )}
      >
        <Radio value="hidden">
          表示しない
        </Radio>
        <Radio value="link">
          リンクボタン
        </Radio>
      </RadioGroup>

      <Collapse in={button?.type === "link"}>
        <Box>
          <FormControl p={4}>
            <FormLabel>テキスト</FormLabel>
            <Input
              value={button?.text}
              onChange={e => onChange(p => p && ({ ...p, text: e.target.value }))}
              placeholder="例) デッキのページを見る"
              isInvalid={!isValidButton}
            />
            <FormHelperText>
              <UnorderedList>
                <ListItem>
                  ボタンに表示されるテキストを入力してください。
                </ListItem>
                <ListItem>
                  {buttonTextMaxLength}文字まで入力可能です。
                </ListItem>
              </UnorderedList>
            </FormHelperText>
          </FormControl>
          <FormControl p={4}>
            <FormLabel>リンク</FormLabel>
            <Input
              value={button?.href}
              onChange={e => onChange(p => p && ({ ...p, href: e.target.value }))}
            />
            <FormHelperText>
              ユーザがボタンをクリックしたときに移動するページです
            </FormHelperText>
          </FormControl>
        </Box>
      </Collapse>

    </FormControl>
  )
}

export const useInputUniguriBalloonButton = ({ defaultValue }: {
  defaultValue: UniguriBalloon["button"]
}) => {
  const [button, setButton] = useState(defaultValue ?? null)
  const isValid =
    button === null
    || (button?.type === "link" && button.text.length <= buttonTextMaxLength)
  const props = {
    button,
    onChange: setButton,
  } satisfies Partial<InputUniguriBalloonButtonProps>
  return {
    value: button,
    isValid,
    props,
  }
}

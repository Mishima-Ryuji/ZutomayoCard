import { Badge, HStack, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Switch, Textarea, chakra } from "@chakra-ui/react"
import { FC, useState } from "react"
import { RichEditor } from ".."
import { RichEditorProps } from "../RichEditor"

interface PreviewRichEditorProps extends RichEditorProps {
  textareaValue: string
  onChangeTextareaValue: (value: string) => void
}
const PreviewRichEditor: FC<PreviewRichEditorProps> = ({
  textareaValue,
  onChangeTextareaValue,
  ...editorProps
}) => {
  const [isEnableRich, setIsEnableRich] = useState(false)
  return (
    <chakra.div w="full" >

      <HStack w="full" direction="row" justifyContent="flex-end" py={1}>
        <Popover trigger="hover">
          <PopoverTrigger>
            <div>
              <Badge>プレビュー</Badge>
              リッチエディタ
              <Switch checked={isEnableRich} onChange={e => setIsEnableRich(e.target.checked)} />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>
              <Badge>プレビュー</Badge>
              リッチエディタ
            </PopoverHeader>
            <PopoverBody>
              リッチエディタ機能は
              文字を装飾できる機能です。
              文章にリンクを入れたり太文字にしたりできます。
              (実験的にリリースされた機能です)
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </HStack>

      {isEnableRich
        ? <RichEditor {...editorProps} />
        : <Textarea
          value={textareaValue}
          onChange={(e) => onChangeTextareaValue(e.currentTarget.value)}
        />
      }

    </chakra.div>
  )
}

export default PreviewRichEditor

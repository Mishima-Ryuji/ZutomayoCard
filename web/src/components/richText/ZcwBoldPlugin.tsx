import { Button } from '@chakra-ui/react'
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_CRITICAL, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND } from 'lexical'
import { FC, useEffect, useState } from "react"

export const ZcwBoldToolbarItem: FC = () => {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = useState(false)
  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) return false
        setIsBold(selection.hasFormat("bold"))
        return false
      },
      COMMAND_PRIORITY_CRITICAL,
    )
  }, [editor])

  const handleToggle = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
  }
  return (
    <>
      <Button variant={isBold ? "outline" : "ghost"} onClick={handleToggle}>
        太文字
      </Button>
    </>
  )
}

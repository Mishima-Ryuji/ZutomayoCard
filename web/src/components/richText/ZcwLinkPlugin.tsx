import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Input, useDisclosure } from '@chakra-ui/react'
import { $isLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from 'lexical'
import { FC, useEffect, useRef, useState } from "react"
import { getSelectedNode } from './util/getSelectedNode'

export const ZcwLinkNode = LinkNode

const ZcwLinkPlugin: FC = () => {
  return (
    <>
      <LexicalLinkPlugin validateUrl={text => true} />
    </>
  )
}

export default ZcwLinkPlugin

export const ZcwLinkToolbarItem: FC = () => {
  const [editor] = useLexicalComposerContext()
  const [isLink, setIsLink] = useState(false)
  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) return false
        const node = getSelectedNode(selection)
        const parent = node.getParent()
        if ($isLinkNode(parent)) {
          setIsLink(true)
          setUrl(parent.getURL())
        } else {
          setIsLink(false)
          setUrl("")
        }
        return false
      },
      COMMAND_PRIORITY_CRITICAL,
    )
  }, [editor])

  const inputUrlDialog = useDisclosure()
  const inputUrlRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState("")
  const isValidUrl = url.trim().length >= 1

  const handleAdd = () => {
    if (!isValidUrl) return handleRemove()
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
    inputUrlDialog.onClose()
  }
  const handleRemove = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    inputUrlDialog.onClose()
  }
  return (
    <>
      <Button variant={isLink ? "outline" : "ghost"} onClick={inputUrlDialog.onOpen} size="sm">
        🔗 リンク
      </Button>
      <AlertDialog
        isOpen={inputUrlDialog.isOpen}
        onClose={inputUrlDialog.onClose}
        leastDestructiveRef={inputUrlRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              URLを入力
            </AlertDialogHeader>
            <AlertDialogBody>
              <Input
                value={url} onChange={e => setUrl(e.target.value)}
              />
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={handleRemove}>
                削除
              </Button>
              <Button onClick={handleAdd} colorScheme="purple" isDisabled={!isValidUrl}>
                設定
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

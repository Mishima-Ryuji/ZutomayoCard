import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Heading, Input, List, Spinner, useDisclosure } from '@chakra-ui/react'
import { $isLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from 'lexical'
import { FC, useEffect, useMemo, useRef, useState } from "react"
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import { cardsRef, getCategoryDetail } from '~/firebase'
import { CardElementImage } from '../card/ElementImage'
import { getSelectedNode } from './util/getSelectedNode'

export const ZcwLinkNode = LinkNode

export const ZcwLinkPlugin: FC = () => {
  return (
    <>
      <LexicalLinkPlugin validateUrl={text => true} />
    </>
  )
}

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
      <LinkInputDialog
        isOpen={inputUrlDialog.isOpen}
        onClose={inputUrlDialog.onClose}
        url={url}
        onChangeUrl={setUrl}
        isValidUrl={isValidUrl}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />
    </>
  )
}

interface LinkInputDialogProps {
  isOpen: boolean
  onClose: () => void
  url: string
  onChangeUrl: (url: string) => void
  isValidUrl: boolean
  onAdd: () => void
  onRemove: () => void
}
const LinkInputDialog: FC<LinkInputDialogProps> = ({
  isOpen, onClose,
  url, onChangeUrl, isValidUrl,
  onAdd, onRemove,
}) => {
  const [cards, loadingCards] = useCollectionDataOnce(cardsRef)
  const sortedCards = useMemo(() =>
    cards?.sort((a, b) => a.order - b.order),
    [cards],
  )

  const inputUrlRef = useRef<HTMLInputElement>(null)

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={inputUrlRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            URLを入力
          </AlertDialogHeader>
          <AlertDialogBody>
            <Input
              value={url} onChange={e => onChangeUrl(e.target.value)}
            />
            <Heading size="xs">
              カード
            </Heading>
            <List maxH="50vh" overflow="auto">
              {loadingCards &&
                <Spinner />
              }
              {sortedCards?.map(card => {
                const categoryDetail = getCategoryDetail(card)
                const cardUrl = `https://zutomayo-card.com/cards/${card.id}`
                return (
                  <Box
                    key={card.id}
                    as="li"
                    onClick={() => onChangeUrl(cardUrl)}
                    borderLeft={cardUrl === url ? "solid 2px" : "none"}
                    borderColor="purple.300"
                    display="flex" flexDir="row"
                    justifyContent="flex-start" alignItems="center"
                    cursor="pointer"
                  >
                    {card.element && (
                      <CardElementImage element={card.element} size={20} />
                    )}
                    <Box flexGrow="1">
                      {card.name}
                    </Box>
                    <Box textAlign="end" fontSize="0.8em">
                      ({categoryDetail.name} {card.no}/{categoryDetail.denominator})
                    </Box>
                  </Box>
                )
              })}
            </List>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onRemove}>
              削除
            </Button>
            <Button onClick={onAdd} colorScheme="purple" isDisabled={!isValidUrl}>
              設定
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

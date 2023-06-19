import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { FaPencilAlt, FaPlus, FaTrash } from 'react-icons/fa'
import { Combo, addDoc, combosRef, deleteDoc } from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'
import { designatedIdsCardsRef } from '~/models/card'
import { CardList } from '../card/List'

type ComboWriterProps = {
  combo?: Combo
  baseCardId?: string
  mt?: number
}

const ComboWriter = ({ combo, baseCardId, mt }: ComboWriterProps) => {
  const { isAdmin } = useAuthState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [cardIds, setCardIds] = useState<string[]>(
    combo?.card_ids.filter((id) => id !== baseCardId) ?? []
  )
  const [description, setDescription] = useState(combo?.description ?? '')

  if (!isAdmin) return <></>
  return (
    <Box mt={mt}>
      <Button colorScheme="purple" size="xs" onClick={onOpen} gap={1}>
        {combo ? (
          <>
            <FaPencilAlt />
            コンボを編集
          </>
        ) : (
          <>
            <FaPlus />
            コンボを追加
          </>
        )}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>コンボ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack gap={5}>
              <FormControl>
                <FormLabel>コンボするカードのID</FormLabel>
                <Input
                  defaultValue={cardIds.join(',')}
                  onChange={(e) =>
                    setCardIds(
                      e.currentTarget.value
                        .split(',')
                        .map((id) => id.trim())
                        .filter((id) => id !== '')
                    )
                  }
                />
                <FormHelperText>
                  カードのIDはそれぞれの詳細ページに記載されているのでコピーして使ってください。複数のカードとコンボする場合は半角のカンマで区切って入力してください。
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>説明</FormLabel>
                <Textarea
                  defaultValue={description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                  rows={5}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="purple"
              onClick={async () => {
                if (cardIds.length === 0 || !description)
                  throw new Error('Unexpected error has ocurred.')
                const actualCardIds = baseCardId
                  ? [baseCardId, ...cardIds]
                  : cardIds
                if (combo) {
                  await updateDoc(combo.ref, {
                    card_ids: actualCardIds,
                    description,
                  })
                } else {
                  await addDoc(combosRef, {
                    card_ids: actualCardIds,
                    description,
                  })
                }
                setCardIds([])
                setDescription('')
                onClose()
              }}
              isDisabled={cardIds.length === 0 || !description}
            >
              {combo ? '更新' : '追加'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

type ItemProps = {
  combo: Combo
  baseCardId?: string
}

const ComboItem = ({ combo, baseCardId }: ItemProps) => {
  const cardIds = combo.card_ids.filter((id) => id !== baseCardId)
  const [cards, loading, error] = useCollectionData(
    cardIds.length > 0 ? designatedIdsCardsRef(cardIds) : null
  )
  const { isAdmin } = useAuthState()
  return (
    <Box>
      <Stack gap={3}>
        {cards && <CardList width={'100px'} cards={cards} />}
        <Box>{combo.description}</Box>
        <Flex mt={2} gap={3}>
          <ComboWriter baseCardId={baseCardId} combo={combo} />
          {isAdmin && (
            <Button
              colorScheme="red"
              size="xs"
              gap={1}
              onClick={() => {
                deleteDoc(combo.ref)
              }}
            >
              <FaTrash />
              コンボを削除
            </Button>
          )}
        </Flex>
      </Stack>
    </Box>
  )
}

type Props = {
  combos: Combo[]
  baseCardId?: string
}

export const ComboList = ({ combos, baseCardId }: Props) => {
  return (
    <Box>
      <Heading size="md" mb={2}>
        コンボで使うと強いカード
      </Heading>
      <Stack gap={8}>
        {combos.map((combo) => (
          <ComboItem combo={combo} baseCardId={baseCardId} />
        ))}
        {combos.length === 0 && (
          <Box>コンボで使うと強いカードはありません。</Box>
        )}
      </Stack>
      <ComboWriter baseCardId={baseCardId} mt={7} />
    </Box>
  )
}

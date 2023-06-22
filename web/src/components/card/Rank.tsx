'use client'

import {
  Box,
  Button,
  Card as ChakraCard,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { deleteField, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import { FaPencilAlt } from 'react-icons/fa'
import { Card } from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'

type Props = {
  card: Card
}

export const CardRank = ({ card }: Props) => {
  const { isAdmin } = useAuthState()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [rank, setRank] = useState<Card['rank']>(card.rank)
  const [rankDescription, setRankDescription] = useState<
    Card['rank_description']
  >(card.rank_description)

  return (
    <Box>
      <Heading size="md" mb={4}>
        対戦ガチ勢からの評価
      </Heading>
      {card.rank ? (
        <>
          <ChakraCard mb={2}>
            <Flex>
              <Box fontSize={'3xl'} py={4} px={7}>
                {card.rank}
              </Box>
              <Box py={2}>{card.rank_description}</Box>
            </Flex>
          </ChakraCard>
          <Box
            fontSize={'small'}
            color={'gray.500'}
          >{`※ 評価はS, A, B, C, Dの5段階で付けています。`}</Box>
        </>
      ) : (
        <Box>{`現在準備中です。`}</Box>
      )}

      {isAdmin && (
        <>
          <Flex gap={3}>
            <Button
              colorScheme="purple"
              size="xs"
              mt={7}
              onClick={onOpen}
              gap={1}
            >
              <FaPencilAlt />
              カードの評価を編集
            </Button>
            {card.rank && (
              <Button
                colorScheme="red"
                size="xs"
                mt={7}
                onClick={async () => {
                  const confirmed = window.confirm('本当に評価を削除しますか？')
                  if (!confirmed) return
                  await updateDoc(card.ref, {
                    rank: deleteField(),
                    rank_description: deleteField(),
                  })
                }}
              >
                <FaPencilAlt />
                カードの評価を削除
              </Button>
            )}
          </Flex>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>カードの評価</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack gap={5}>
                  <FormControl>
                    <FormLabel>ランク</FormLabel>
                    <Select
                      placeholder="選択してください"
                      defaultValue={rank}
                      onChange={(e) =>
                        setRank(e.currentTarget.value as Card['rank'])
                      }
                    >
                      <option value="S">S</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>説明</FormLabel>
                    <Textarea
                      defaultValue={rankDescription}
                      onChange={(e) =>
                        setRankDescription(e.currentTarget.value)
                      }
                      rows={5}
                    />
                  </FormControl>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="purple"
                  onClick={async () => {
                    if (
                      !rank ||
                      rankDescription === undefined ||
                      rankDescription === ''
                    )
                      throw new Error('Unexpected error has ocurred.')
                    await updateDoc(card.ref, {
                      rank,
                      rank_description: rankDescription,
                    })
                    onClose()
                  }}
                  isDisabled={
                    !rank ||
                    rankDescription === undefined ||
                    rankDescription === ''
                  }
                >
                  更新
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Box>
  )
}

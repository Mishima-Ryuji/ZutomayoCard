import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Tag,
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { CardSearcher } from '~/components/card/Searcher'
import { Card } from '~/firebase'
import { PromiseVoid } from '~/types'
import { CardList } from './List'

type Props = {
  cards: Card[]
  selectedCardIds: string[]
  setSelectedCardIds: (ids: string[]) => void
  bottomSpace: number | number[]
  counter?: boolean
  onClickNext: () => PromiseVoid
  nextButtonDisabled?: boolean
  maxNum?: number
  maxNumOfEachCard?: number
}

export const CardsSelector = ({
  cards,
  selectedCardIds,
  setSelectedCardIds,
  bottomSpace,
  counter = false,
  onClickNext: handleClickNext,
  nextButtonDisabled = false,
  maxNum,
  maxNumOfEachCard = 1,
}: Props) => {
  const [showSelected, setShowSelected] = useState(false)

  const selectedCards = useMemo(() => {
    return cards
      .filter((card) => selectedCardIds.includes(card.id))
      .sort(
        (a, b) =>
          selectedCardIds.findIndex((id) => a.id === id) -
          selectedCardIds.findIndex((id) => b.id === id)
      )
  }, [cards, selectedCardIds])

  const handleSelect = (card: Card) => {
    if (
      selectedCardIds.filter((id) => card.id === id).length >= maxNumOfEachCard
    ) {
      setSelectedCardIds(selectedCardIds.filter((id) => card.id !== id))
    } else {
      setSelectedCardIds([...selectedCardIds, card.id])
    }
  }
  return (
    <>
      <Box py={3}>
        <CardSearcher
          cards={cards}
          selectedCardIds={selectedCardIds}
          onSelect={handleSelect}
          counter={counter}
        />
      </Box>
      <Box
        bottom={0}
        right={0}
        left={0}
        position={'fixed'}
        backgroundColor={'white'}
        w={'100%'}
        height={bottomSpace}
      >
        <Box h={'100%'} w={'100%'} shadow={'lg'}>
          <Flex
            align={'center'}
            margin={'auto'}
            maxW={1200}
            px={3}
            height={'100%'}
            gap={5}
          >
            <Button
              colorScheme="purple"
              onClick={() => setShowSelected(true)}
              size={['sm', 'md']}
            >
              選択中
              <Tag size={'sm'} ml={2} variant="solid" colorScheme="blackAlpha">
                {selectedCardIds.length}
                {maxNum !== undefined ? `/ ${maxNum}` : ''}
              </Tag>
            </Button>
            <Button
              size={['sm', 'md']}
              colorScheme="purple"
              isDisabled={selectedCardIds.length === 0}
              onClick={() => setSelectedCardIds([])}
            >
              リセット
            </Button>
            <Spacer />
            <Button
              colorScheme="purple"
              size={['sm', 'md']}
              isDisabled={nextButtonDisabled}
              onClick={handleClickNext}
            >
              決定
            </Button>
          </Flex>
        </Box>
      </Box>
      <Modal
        onClose={() => setShowSelected(false)}
        size={'2xl'}
        isOpen={showSelected}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>選択中のカード</ModalHeader>
          <ModalCloseButton />
          <ModalBody mb={3}>
            {selectedCards.length > 0 ? (
              <CardList
                gap={5}
                cards={selectedCards}
                selectedCardIds={selectedCardIds}
                counter={counter}
                onSelect={handleSelect}
              />
            ) : (
              <>選択中のカードはありません。</>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

import { Box, ResponsiveValue, SimpleGrid } from '@chakra-ui/react'
import { Card } from '~/firebase'
import { PromiseVoid } from '~/types'
import { CardItem } from './Item'

type Props = {
  cards: Card[]
  width: ResponsiveValue<number | string>
  counter?: boolean
  selectedCardIds?: string[]
  onSelect?: (card: Card) => PromiseVoid
  gap?: number
}

export const CardList = ({
  cards,
  width,
  counter = false,
  selectedCardIds,
  onSelect: handleSelect,
  gap = 7,
}: Props) => {
  return (
    <SimpleGrid minChildWidth={width} gap={gap}>
      {cards.map((card) => {
        return (
          <CardItem
            key={card.id}
            card={card}
            selected={selectedCardIds?.includes(card.id)}
            selectCount={
              counter
                ? selectedCardIds?.filter((id) => card.id === id).length
                : undefined
            }
            onSelect={handleSelect}
          />
        )
      })}
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
    </SimpleGrid>
  )
}

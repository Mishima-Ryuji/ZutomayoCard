import { ResponsiveValue, SimpleGrid } from '@chakra-ui/react'
import { Card } from '~/firebase'
import { PromiseVoid } from '~/types'
import { CardItem } from './Item'

type Props = {
  cards: Card[]
  columns?: ResponsiveValue<number>
  counter?: boolean
  selectedCardIds?: string[]
  onSelect?: (card: Card) => PromiseVoid
  gap?: ResponsiveValue<number>
}

export const CardList = ({
  cards,
  counter = false,
  selectedCardIds,
  onSelect: handleSelect,
  columns = [2, 3, 4, 6],
  gap = [3, 4, 5, 7],
}: Props) => {
  return (
    <SimpleGrid gap={gap} columns={columns}>
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
    </SimpleGrid>
  )
}

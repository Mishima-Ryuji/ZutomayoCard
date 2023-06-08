import { Box, SimpleGrid } from '@chakra-ui/react'
import { Card } from '~/firebase'
import { CardItem } from './Item'

type Props = {
  cards: Card[]
}

export const CardList = ({ cards }: Props) => {
  return (
    <SimpleGrid minChildWidth="200px" gap={6}>
      {cards.map((card) => {
        return <CardItem key={card.id} card={card} />
      })}
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
    </SimpleGrid>
  )
}

import { Box, ResponsiveValue, SimpleGrid } from '@chakra-ui/react'
import { Card } from '~/firebase'
import { CardItem } from './Item'

type Props = {
  cards: Card[]
  width: ResponsiveValue<number | string>
}

export const CardList = ({ cards, width }: Props) => {
  return (
    <SimpleGrid minChildWidth={width} gap={6}>
      {cards.map((card) => {
        return <CardItem key={card.id} card={card} width={width} />
      })}
      <Box width={width} />
      <Box width={width} />
      <Box width={width} />
      <Box width={width} />
      <Box width={width} />
    </SimpleGrid>
  )
}

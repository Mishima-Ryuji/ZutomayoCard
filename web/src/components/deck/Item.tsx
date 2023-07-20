import { Box, Heading } from '@chakra-ui/react'
import Link from 'next/link'
import { useMemo } from 'react'
import { Card, Deck } from '~/firebase'
import { CardList } from '../card/List'

type Props = {
  cards: Card[]
  deck: Deck
}

export const DeckItem = ({ deck, cards }: Props) => {
  const deckCards = useMemo(() => {
    return cards
      .filter((card) => deck.card_ids.includes(card.id))
      .sort(
        (a, b) =>
          deck.card_ids.findIndex((id) => a.id === id) -
          deck.card_ids.findIndex((id) => b.id === id)
      )
  }, [cards, deck])

  return (
    <Box>
      <Heading fontSize={'2xl'} mb={2} color="purple.500">
        <Link href={`/decks/${deck.id}`}>{deck.name}</Link>
      </Heading>
      <CardList columns={[5, 6, 7]} gap={2} cards={deckCards} />
    </Box>
  )
}

import { Box, Button, Flex, Heading, Spacer, Spinner } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { DeckList } from '~/components/deck/List'
import {
  Card,
  Deck,
  cardConverter,
  cardsRef,
  deckConverter,
  getDocs,
} from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'
import { publicDecksRef } from '~/models/deck'
import { Serialized, deserializeArray, serializeArray } from '~/shared/utils'

type Props = {
  cards: Serialized<Card>[]
  publicDecks: Serialized<Deck>[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const cardsSnapshot = await getDocs(cardsRef)
  const cards = cardsSnapshot.docs.map((doc) => doc.data())
  const publicDecksSnapshot = await getDocs(publicDecksRef)
  const publicDecks = publicDecksSnapshot.docs.map((doc) => doc.data())
  const result = {
    props: {
      cards: serializeArray(cards),
      publicDecks: serializeArray(publicDecks),
    },
    revalidate: 10000,
  }
  return result
}

const Page = ({
  cards: staticCards,
  publicDecks: staticPublicDecks,
}: Props) => {
  const [cards] = useCollectionDataOnce(cardsRef, {
    initialValue: deserializeArray(staticCards, { ref: cardConverter }),
  })
  const [publicDecks] = useCollectionDataOnce(publicDecksRef, {
    initialValue: deserializeArray(staticPublicDecks, { ref: deckConverter }),
  })
  const { user } = useAuthState()
  return (
    <DefaultLayout>
      <Flex align={'center'} mt={3}>
        <Heading fontSize={'2xl'}>デッキ一覧</Heading>
        <Spacer />
        {user && (
          <Link href="/decks/new">
            <Button colorScheme="purple" size="sm">
              新規作成
            </Button>
          </Link>
        )}
      </Flex>
      <Box py={3}>
        {cards && publicDecks ? (
          <DeckList decks={publicDecks} cards={cards} />
        ) : (
          <Box textAlign={'center'} p="5">
            <Spinner m="auto" />
          </Box>
        )}
      </Box>
    </DefaultLayout>
  )
}

export default Page

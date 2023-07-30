import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { LoginPopup } from '~/components/auth/LoginPopup'
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
import { recommendedDecksRef, userDecksRef } from '~/models/deck'
import { Serialized, deserializeArray, serializeArray } from '~/shared/utils'

type Props = {
  cards: Serialized<Card>[]
  recommendedDecks: Serialized<Deck>[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const cardsSnapshot = await getDocs(cardsRef)
  const cards = cardsSnapshot.docs.map((doc) => doc.data())
  const recommendedDecksSnapshot = await getDocs(recommendedDecksRef)
  const recommendedDecks = recommendedDecksSnapshot.docs.map((doc) =>
    doc.data()
  )
  const result = {
    props: {
      cards: serializeArray(cards),
      recommendedDecks: serializeArray(recommendedDecks),
    },
    revalidate: 10000,
  }
  return result
}

const Page = ({
  cards: staticCards,
  recommendedDecks: staticRecommendedDecks,
}: Props) => {
  const { user } = useAuthState()

  const [cards] = useCollectionDataOnce(cardsRef, {
    initialValue: deserializeArray(staticCards, { ref: cardConverter }),
  })
  const [recommendedDecks] = useCollectionDataOnce(recommendedDecksRef, {
    initialValue: deserializeArray(staticRecommendedDecks, {
      ref: deckConverter,
    }),
  })
  const [currentUserDecks] = useCollectionDataOnce(
    user ? userDecksRef(user.uid) : null
  )
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  return (
    <DefaultLayout>
      <LoginPopup
        show={showLoginPopup}
        onHide={() => setShowLoginPopup(false)}
      />
      <Flex align={'center'} my={3}>
        <Heading fontSize={'2xl'}>デッキ一覧</Heading>
        <Spacer />
        {user ? (
          <Link href="/decks/new">
            <Button colorScheme="purple" size="sm">
              新規作成
            </Button>
          </Link>
        ) : (
          <Button
            colorScheme="purple"
            size="sm"
            onClick={() => setShowLoginPopup(true)}
          >
            新規作成
          </Button>
        )}
      </Flex>
      <Tabs variant="enclosed" colorScheme="purple">
        <TabList>
          <Tab>おすすめ</Tab>
          {user && <Tab>あなたの</Tab>}
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <Box>
              {cards && recommendedDecks ? (
                <DeckList decks={recommendedDecks} cards={cards} />
              ) : (
                <Box textAlign={'center'} p="5">
                  <Spinner m="auto" />
                </Box>
              )}
            </Box>
          </TabPanel>
          {user && (
            <TabPanel px={0}>
              <Box>
                {cards && currentUserDecks ? (
                  <DeckList decks={currentUserDecks} cards={cards} />
                ) : (
                  <Box textAlign={'center'} p="5">
                    <Spinner m="auto" />
                  </Box>
                )}
              </Box>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </DefaultLayout>
  )
}

export default Page

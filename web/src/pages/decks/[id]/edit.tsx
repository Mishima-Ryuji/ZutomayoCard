import { Box, Spinner } from '@chakra-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import DefaultErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import {
  useCollectionDataOnce,
  useDocumentData,
} from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { DECK_FORM_BOTTOM_SPACE, DeckForm } from '~/components/deck/Form'
import { Card, cardConverter, cardsRef, deckRef, getDocs } from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'
import { Serialized, deserializeArray, serializeArray } from '~/shared/utils'

type Props = {
  cards: Serialized<Card>[]
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
export const getStaticProps: GetStaticProps<Props> = async () => {
  const cardsSnapshot = await getDocs(cardsRef)
  const cards = cardsSnapshot.docs.map((doc) => doc.data())
  const result = {
    props: {
      cards: serializeArray(cards),
    },
    revalidate: 10000,
  }
  return result
}

const Page = ({ cards: staticCards }: Props) => {
  const router = useRouter()
  const deckId = router.query.id

  const [deck, loading, error] = useDocumentData(
    typeof deckId === 'string' ? deckRef(deckId) : null
  )

  const [cards] = useCollectionDataOnce(cardsRef, {
    initialValue: deserializeArray(staticCards, { ref: cardConverter }),
  })

  const { user, loading: loadingUser } = useAuthState()

  useEffect(() => {
    if (!deck) return
    if (loadingUser) return
    if (!user || user.uid !== deck.created_by) void router.push('/decks')
  }, [loading, deck])

  if (!deck && !loading && deckId !== undefined)
    return <DefaultErrorPage statusCode={404} />
  return (
    <>
      <DefaultLayout bottomSpace={DECK_FORM_BOTTOM_SPACE} footerNone noBanner>
        {cards && deck && user && user.uid === deck.created_by ? (
          <DeckForm cards={cards} deck={deck} />
        ) : (
          <Box textAlign={'center'} p="5">
            <Spinner m="auto" />
          </Box>
        )}
      </DefaultLayout>
    </>
  )
}

export default Page

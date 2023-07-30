import { Box, Spinner } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { DECK_FORM_BOTTOM_SPACE, DeckForm } from '~/components/deck/Form'
import { Card, cardConverter, cardsRef, getDocs } from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'
import { Serialized, deserializeArray, serializeArray } from '~/shared/utils'

type Props = {
  cards: Serialized<Card>[]
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
  const [cards] = useCollectionDataOnce(cardsRef, {
    initialValue: deserializeArray(staticCards, { ref: cardConverter }),
  })

  const router = useRouter()
  const { user, loading } = useAuthState()
  useEffect(() => {
    if (loading) return
    if (user) return
    void router.push('/decks')
  }, [loading])

  return (
    <>
      <DefaultLayout bottomSpace={DECK_FORM_BOTTOM_SPACE} footerNone noBanner>
        {cards && user ? (
          <DeckForm cards={cards} />
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

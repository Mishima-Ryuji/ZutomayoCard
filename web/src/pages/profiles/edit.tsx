import { Box, Spinner } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { ProfileForm } from '~/components/profile/Form'
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
  const router = useRouter()
  const { user, loading, profile, profileLoading } = useAuthState()
  const [cards] = useCollectionDataOnce(cardsRef, {
    initialValue: deserializeArray(staticCards, { ref: cardConverter }),
  })

  useEffect(() => {
    if (loading) return
    if (!user) void router.push(`/`)
  }, [user, loading])

  return (
    <DefaultLayout head={{ title: 'プロフィールの編集' }} noBanner footerNone>
      {cards && !profileLoading ? (
        <ProfileForm profile={profile} cards={cards} />
      ) : (
        <Box textAlign={'center'} p="5">
          <Spinner m="auto" />
        </Box>
      )}
    </DefaultLayout>
  )
}

export default Page

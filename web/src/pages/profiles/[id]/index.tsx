import { Box, Spinner } from '@chakra-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import DefaultErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useEffect } from 'react'
import {
  useCollectionDataOnce,
  useDocumentDataOnce,
} from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { ProfileForm } from '~/components/profile/Form'
import {
  Card,
  Profile,
  cardConverter,
  cardsRef,
  getDoc,
  getDocs,
  profileConverter,
  profileRef,
  profilesRef,
} from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'
import {
  Serialized,
  deserialize,
  deserializeArray,
  serialize,
  serializeArray,
} from '~/shared/utils'

interface Params extends ParsedUrlQuery {
  id: string
}

type Props = {
  cards: Serialized<Card>[]
  profile: Serialized<Profile> | null
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const profilesSnapshot = await getDocs(profilesRef)
  const profileIds = profilesSnapshot.docs.map((doc) => doc.id)
  return {
    paths: profileIds.map((id) => {
      return { params: { id } }
    }),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const cardsSnapshot = await getDocs(cardsRef)
  const cards = cardsSnapshot.docs.map((doc) => doc.data())
  const profilesSnapshot = params
    ? await getDoc(profileRef(params.id))
    : undefined
  const profile = profilesSnapshot?.data()
  const result = {
    props: {
      cards: serializeArray(cards),
      profile: profile ? serialize(profile) : null,
    },
    revalidate: 10000,
  }
  return result
}

const Page = ({ cards: staticCards, profile: staticProfile }: Props) => {
  const { user } = useAuthState()
  const router = useRouter()
  const uid = router.query.id
  const [cards] = useCollectionDataOnce(cardsRef, {
    initialValue: deserializeArray(staticCards, { ref: cardConverter }),
  })
  const [profile, loadingProfile] = useDocumentDataOnce(
    typeof uid === 'string' ? profileRef(uid) : null,
    {
      initialValue: staticProfile
        ? deserialize(staticProfile, { ref: profileConverter })
        : undefined,
    }
  )
  useEffect(() => {
    if (
      user &&
      uid === user.uid &&
      uid !== undefined &&
      !loadingProfile &&
      !profile
    )
      void router.push(`/profiles/edit`)
  })
  if (uid !== user?.uid && uid !== undefined && !loadingProfile && !profile)
    return <DefaultErrorPage statusCode={404} />
  return (
    <DefaultLayout noBanner footerNone>
      {profile && cards ? (
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

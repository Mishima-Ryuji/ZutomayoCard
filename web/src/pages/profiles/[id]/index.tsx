import {
  Alert,
  AlertIcon,
  Box,
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import DefaultErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useEffect, useMemo } from 'react'
import {
  useCollectionDataOnce,
  useDocumentDataOnce,
} from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { CardList } from '~/components/card/List'
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
  const receivedCards = useMemo(() => {
    if (profile?.offered_card_ids === undefined || cards === undefined)
      return []
    return cards
      ?.filter((card) => profile?.received_card_ids.includes(card.id))
      .sort(
        (a, b) =>
          profile?.received_card_ids.findIndex((id) => a.id === id) -
          profile?.received_card_ids.findIndex((id) => b.id === id)
      )
  }, [cards, profile])

  const offeredCards = useMemo(() => {
    if (profile?.offered_card_ids === undefined || cards === undefined)
      return []
    return cards
      .filter((card) => profile.offered_card_ids.includes(card.id))
      .sort(
        (a, b) =>
          profile.offered_card_ids.findIndex((id) => a.id === id) -
          profile.offered_card_ids.findIndex((id) => b.id === id)
      )
  }, [cards, profile])

  if (uid !== user?.uid && uid !== undefined && !loadingProfile && !profile)
    return <DefaultErrorPage statusCode={404} />
  return (
    <DefaultLayout noBanner footerNone>
      {profile && cards ? (
        <>
          <Heading mt={5} fontSize={'2xl'}>
            {profile.name}
          </Heading>
          <Heading mt={5} fontSize={'xl'}>
            連絡先
          </Heading>
          <Text>{profile.contact}</Text>
          <Heading mt={5} fontSize={'xl'}>
            トレード
          </Heading>
          <Alert mt={2} status="warning">
            <AlertIcon />
            {profile.requirement}
          </Alert>
          <Tabs
            variant="soft-rounded"
            colorScheme="purple"
            width={'100%'}
            mt={4}
          >
            <TabList>
              <Tab>譲れるカード</Tab>
              <Tab>欲しいカード</Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0}>
                <CardList cards={offeredCards} columns={[3, 4, 5, 7]} />
              </TabPanel>
              <TabPanel px={0}>
                <CardList cards={receivedCards} columns={[3, 4, 5, 7]} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      ) : (
        <Box textAlign={'center'} p="5">
          <Spinner m="auto" />
        </Box>
      )}
    </DefaultLayout>
  )
}

export default Page

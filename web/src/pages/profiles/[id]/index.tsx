import {
  Alert,
  AlertIcon,
  Box,
  Button,
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
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useEffect, useMemo } from 'react'
import {
  useCollectionDataOnce,
  useDocumentDataOnce,
} from 'react-firebase-hooks/firestore'
import { FaPencilAlt } from 'react-icons/fa'
import { DefaultLayout } from '~/components/Layout'
import { CardList } from '~/components/card/List'
import { DeckList } from '~/components/deck/List'
import {
  Card,
  Deck,
  Profile,
  cardConverter,
  cardsRef,
  deckConverter,
  getDoc,
  getDocs,
  profileConverter,
  profileRef,
  profilesRef,
} from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'
import { cardsSorter } from '~/models/card'
import { publicUserDecksRef } from '~/models/deck'
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
  decks: Serialized<Deck>[]
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

  const decksSnapshot = params
    ? await getDocs(publicUserDecksRef(params.id))
    : undefined
  const decks = decksSnapshot?.docs.map((deck) => deck.data()) ?? []

  const result = {
    props: {
      cards: serializeArray(cards),
      profile: profile ? serialize(profile) : null,
      decks: serializeArray(decks),
    },
    revalidate: 10000,
  }
  return result
}

const Page = ({
  cards: staticCards,
  profile: staticProfile,
  decks: staticDecks,
}: Props) => {
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
  const [decks] = useCollectionDataOnce(
    typeof uid === 'string' ? publicUserDecksRef(uid) : null,
    {
      initialValue: deserializeArray(staticDecks, { ref: deckConverter }),
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
      .sort(cardsSorter)
  }, [cards, profile])

  const offeredCards = useMemo(() => {
    if (profile?.offered_card_ids === undefined || cards === undefined)
      return []
    return cards
      .filter((card) => profile.offered_card_ids.includes(card.id))
      .sort(cardsSorter)
  }, [cards, profile])

  if (uid !== user?.uid && uid !== undefined && !loadingProfile && !profile)
    return <DefaultErrorPage statusCode={404} />
  return (
    <DefaultLayout
      head={{
        title: profile ? `${profile.name}のズトカプロフィール` : undefined,
        description: profile
          ? `本ページでは、${profile.name}さんが構築したデッキや交換したいカードを閲覧することができます。`
          : undefined,
      }}
      noBanner
      footerNone
    >
      {profile && cards ? (
        <>
          <Heading mt={5} fontSize={'2xl'}>
            {profile.name}
          </Heading>
          {profile.id === user?.uid && (
            <Link href={`/profiles/edit`}>
              <Button colorScheme="purple" size="xs" mt={2} gap={1}>
                <FaPencilAlt />
                プロフィールを編集
              </Button>
            </Link>
          )}
          <Heading mt={5} fontSize={'xl'}>
            連絡先
          </Heading>
          <Text mt={2}>{profile.contact}</Text>
          <Tabs mt={3} colorScheme={'purple'}>
            <TabList>
              <Tab>トレード</Tab>
              <Tab>公開中のデッキ</Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0}>
                <Alert status="warning">
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
              </TabPanel>
              <TabPanel px={0}>
                {decks && <DeckList decks={decks} cards={cards} />}
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

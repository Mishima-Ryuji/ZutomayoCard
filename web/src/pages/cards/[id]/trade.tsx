import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  CardBody,
  Card as ChakraCard,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import DefaultErrorPage from 'next/error'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useEffect } from 'react'
import {
  useCollectionDataOnce,
  useDocumentData,
} from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { CardItem } from '~/components/card/Item'
import { TraderList } from '~/components/profile/Trader'
import {
  Card,
  Profile,
  cardConverter,
  cardRef,
  cardsRef,
  getCategoryDetail,
  getDoc,
  getDocs,
  profileConverter,
} from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'
import { offeredProfilesRef } from '~/models/profile'
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
  card: Serialized<Card> | null
  cards: Serialized<Card>[]
  profiles: Serialized<Profile>[]
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const cardsSnapshot = await getDocs(cardsRef)
  const cardIds = cardsSnapshot.docs.map((doc) => doc.id)
  return {
    paths: cardIds.map((id) => {
      return { params: { id } }
    }),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const cardId = params?.id
  const cardSnapshot =
    cardId !== undefined ? await getDoc(cardRef(cardId)) : undefined
  const card = cardSnapshot?.data()

  const cardsSnapshot = await getDocs(cardsRef)
  const cards = cardsSnapshot.docs.map((doc) => doc.data())

  const profilesSnapshot =
    cardId !== undefined ? await getDocs(offeredProfilesRef(cardId)) : undefined
  const profiles = profilesSnapshot?.docs.map((doc) => doc.data()) ?? []

  const result = {
    props: {
      card: card ? serialize(card) : null,
      cards: serializeArray(cards),
      profiles: serializeArray(profiles),
    },
    revalidate: 10000,
  }
  return result
}

const Page = ({
  card: staticCard,
  cards: staticCards,
  profiles: staticProfiles,
}: Props) => {
  const router = useRouter()
  const cardId = router.query.id

  const {
    user,
    loading: loadingUser,
    profile: currentUserProfile,
    profileLoading,
  } = useAuthState()

  useEffect(() => {
    if (loadingUser) return
    if (!user) void router.push(`/`)
  }, [user, loadingUser])

  const [card, loadingCard] = useDocumentData(
    typeof cardId === 'string' ? cardRef(cardId) : null,
    {
      initialValue: staticCard
        ? deserialize(staticCard, { ref: cardConverter })
        : undefined,
    }
  )
  const [cards, loadingCards] = useCollectionDataOnce(cardsRef, {
    initialValue: deserializeArray(staticCards, {
      ref: cardConverter,
    }),
  })

  const [profiles, loadingProfiles] = useCollectionDataOnce(
    typeof cardId === 'string' ? offeredProfilesRef(cardId) : undefined,
    {
      initialValue: deserializeArray(staticProfiles, {
        ref: profileConverter,
      }),
    }
  )
  const categoryDetail =
    card !== undefined ? getCategoryDetail(card) : undefined

  if (!card && !loadingCard && cardId !== undefined)
    return <DefaultErrorPage statusCode={404} />
  return (
    <DefaultLayout>
      {card && categoryDetail && cards && profiles ? (
        <Stack my={4} gap={10}>
          <ChakraCard>
            <CardBody pt={3} pb={5}>
              <Flex align={'center'} gap={6}>
                <CardItem card={card} width={'30%'} maxWidth={'70px'} />
                <Box>
                  <Stack direction="row" mb={2}>
                    <Badge colorScheme="purple">{categoryDetail.name}</Badge>
                    <Badge colorScheme="purple">
                      {`${card.no} / ${categoryDetail.denominator}`}
                    </Badge>
                    {card.rarity && (
                      <Badge colorScheme="purple">{card.rarity}</Badge>
                    )}
                  </Stack>
                  <Heading size={['md', 'lg']}>{card.name}</Heading>
                </Box>
              </Flex>
            </CardBody>
          </ChakraCard>

          <Box>
            <Heading fontSize={'2xl'}>交換相手の一覧</Heading>
            {!profileLoading && currentUserProfile === undefined && (
              <Alert status={'warning'}>
                <AlertIcon />
                <Link href={`/profiles/edit`}>
                  <Text color={'purple.500'}>プロフィールでトレードの設定</Text>
                </Link>
                をすると交換相手を探しやすくなります。
              </Alert>
            )}
            <Box mt={3}>
              <TraderList
                card={card}
                cards={cards}
                profiles={profiles}
                currentUserProfile={currentUserProfile}
              />
            </Box>
          </Box>
        </Stack>
      ) : (
        <Box textAlign={'center'} p="5">
          <Spinner m="auto" />
        </Box>
      )}
    </DefaultLayout>
  )
}

export default Page

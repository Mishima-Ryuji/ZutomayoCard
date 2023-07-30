import {
  AspectRatio,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spinner,
} from '@chakra-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import DefaultErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useMemo } from 'react'
import {
  useCollectionDataOnce,
  useDocumentDataOnce,
} from 'react-firebase-hooks/firestore'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
import Youtube from 'react-youtube'
import { DefaultLayout } from '~/components/Layout'
import { CardList } from '~/components/card/List'
import {
  Card,
  Deck,
  cardConverter,
  cardsRef,
  deckConverter,
  deckRef,
  deleteDoc,
  getDoc,
  getDocs,
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
  deck: Serialized<Deck> | null
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const cardsSnapshot = await getDocs(cardsRef)
  const cards = cardsSnapshot.docs.map((doc) => doc.data())
  const decksSnapshot = params ? await getDoc(deckRef(params.id)) : undefined
  const deck = decksSnapshot?.data()
  const result = {
    props: {
      cards: serializeArray(cards),
      deck: deck ? serialize(deck) : null,
    },
    revalidate: 10000,
  }
  return result
}

const Page = ({ cards: staticCards, deck: staticDeck }: Props) => {
  const router = useRouter()
  const deckId = router.query.id
  const [cards] = useCollectionDataOnce(cardsRef, {
    initialValue: deserializeArray(staticCards, { ref: cardConverter }),
  })
  const [deck, loadingDeck] = useDocumentDataOnce(
    typeof deckId === 'string' ? deckRef(deckId) : null,
    {
      initialValue: staticDeck
        ? deserialize(staticDeck, { ref: deckConverter })
        : undefined,
    }
  )
  const deckCards = useMemo(() => {
    return cards && deck
      ? cards
          .filter((card) => deck.card_ids.includes(card.id))
          .sort(
            (a, b) =>
              deck.card_ids.findIndex((id) => a.id === id) -
              deck.card_ids.findIndex((id) => b.id === id)
          )
      : undefined
  }, [cards, deck])
  const { user } = useAuthState()
  if (!deck && !loadingDeck && deckId !== undefined)
    return <DefaultErrorPage statusCode={404} />
  return (
    <DefaultLayout head={{ title: deck?.name, description: deck?.concept }}>
      <Box py={3}>
        {deckCards && deck ? (
          <>
            <Heading fontSize={'2xl'} mb={3}>
              {deck.name}
            </Heading>
            {user && user?.uid === deck.created_by && (
              <Flex gap={2} mb={4}>
                <Link href={`/decks/${deck.id}/edit`}>
                  <Button colorScheme="purple" size="xs" mt={2} gap={1}>
                    <FaPencilAlt />
                    デッキを編集
                  </Button>
                </Link>
                <Button
                  colorScheme="red"
                  size="xs"
                  mt={2}
                  gap={1}
                  onClick={async () => {
                    await deleteDoc(deck.ref)
                    await router.push('/decks')
                  }}
                >
                  <FaTrash />
                  デッキを削除
                </Button>
              </Flex>
            )}
            <CardList
              columns={[5, 6, 7]}
              cards={deckCards}
              selectedCardIds={deck.card_ids}
              counter
            />
            {deck.concept !== undefined && (
              <>
                <Heading fontSize={'xl'} mt={3} mb={2}>
                  コンセプト
                </Heading>
                <p>{deck.concept}</p>
              </>
            )}
            {deck.movement !== undefined && (
              <>
                <Heading fontSize={'xl'} mt={3} mb={2}>
                  立ち回り方
                </Heading>
                <p>{deck.movement}</p>
              </>
            )}
            {deck.cards_adoption !== undefined && (
              <>
                <Heading fontSize={'xl'} mt={3} mb={2}>
                  カードの採用理由と代替カード
                </Heading>
                <p>{deck.cards_adoption}</p>
              </>
            )}
            {deck.detail !== undefined && (
              <>
                <Heading fontSize={'xl'} mt={3} mb={2}>
                  詳細やその他の情報
                </Heading>
                <p>{deck.detail}</p>
              </>
            )}
            {deck.youtube_id !== undefined && (
              <>
                <Heading fontSize={'xl'} mt={7} mb={2}>
                  動画解説
                </Heading>
                <AspectRatio width={'100%'} maxW={640} ratio={640 / 360}>
                  <Youtube
                    videoId={deck.youtube_id}
                    opts={{ width: '100%', height: '100%' }}
                  />
                </AspectRatio>
              </>
            )}
          </>
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

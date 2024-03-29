import {
  AspectRatio,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { SerializedEditorState } from "lexical"
import { GetStaticPaths, GetStaticProps } from 'next'
import DefaultErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { FC, ReactNode, useMemo } from 'react'
import {
  useCollectionDataOnce,
  useDocumentDataOnce,
} from 'react-firebase-hooks/firestore'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
import Youtube from 'react-youtube'
import { DefaultLayout } from '~/components/Layout'
import { CardList } from '~/components/card/List'
import { RichViewer } from '~/components/richText/viewer/RichViewer'
import { isPermissionDenied } from '~/errors/isPermissionDeniedOnServer'
import {
  Card,
  Deck,
  Profile,
  cardConverter,
  cardsRef,
  deckConverter,
  deckRef,
  deleteDoc,
  getDoc,
  getDocs,
  profileConverter,
  profileRef
} from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'
import { Serialized, deserialize, deserializeArray, serialize, serializeArray } from '~/shared/utils'

interface Params extends ParsedUrlQuery {
  id: string
}

type Props = {
  cards: Serialized<Card>[] | null
  deck: Serialized<Deck> | null
  deckOwner: Serialized<Profile> | null
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
  let cards: Serialized<Card>[] | null = null
  let deck: Serialized<Deck> | null = null
  let deckOwner: Serialized<Profile> | null = null

  try {

    const cardsSnapshot = await getDocs(cardsRef)
    const cardsData = cardsSnapshot.docs.map((doc) => doc.data())
    cards = serializeArray(cardsData)

    const decksSnapshot = params ? await getDoc(deckRef(params.id)) : undefined
    const deckData = decksSnapshot?.data()
    deck = deckData ? serialize(deckData) : null

    const deckOwnerSnapshot = deck
      ? await getDoc(profileRef(deck.created_by))
      : undefined
    const deckOwnerData = deckOwnerSnapshot?.data()
    deckOwner = deckOwnerData ? serialize(deckOwnerData) : null

    return {
      props: {
        cards,
        deck,
        deckOwner,
      },
      revalidate: 10_000,
    }
  } catch (error) {
    console.error(error)
    // サーバ側での権限エラーを回避
    if (isPermissionDenied(error)) {
      return {
        props: {
          cards,
          deck,
          deckOwner,
        },
        revalidate: 10_000,
      }
    } else {
      throw error
    }
  }
}

const Page = ({
  cards: staticCards,
  deck: staticDeck,
  deckOwner: staticDeckOwner,
}: Props) => {
  const router = useRouter()
  const deckId = router.query.id
  const [cards] = useCollectionDataOnce(cardsRef, {
    initialValue: staticCards
      ? deserializeArray(staticCards, { ref: cardConverter })
      : undefined,
  })
  const [deck, loadingDeck] = useDocumentDataOnce(typeof deckId === 'string' ? deckRef(deckId) : null,
    {
      initialValue: staticDeck
        ? deserialize(staticDeck, { ref: deckConverter })
        : undefined,
    },
  )
  const [deckOwner, loadingDeckOwner] = useDocumentDataOnce(
    deck ? profileRef(deck.created_by) : null,
    {
      initialValue: staticDeckOwner
        ? deserialize(staticDeckOwner, { ref: profileConverter })
        : undefined,
    },
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
            {deckOwner && (
              <>
                <Heading fontSize={'xl'} mt={3}>
                  デッキの作成者
                </Heading>
                <Text color="purple.500" fontSize={'xl'} mb={3}>
                  <Link href={`/profiles/${deckOwner.id}`}>
                    {deckOwner.name}
                  </Link>
                </Text>
              </>
            )}
            <CardList
              columns={[5, 6, 7]}
              cards={deckCards}
              selectedCardIds={deck.card_ids}
              counter
            />
            <TextSection
              heading="コンセプト"
              markupedContent={deck.markuped_concept}
              textContent={deck.concept}
            />
            <TextSection
              heading="立ち回り方"
              markupedContent={deck.markuped_movement}
              textContent={deck.movement}
            />
            <TextSection
              heading="カードの採用理由と代替カード"
              markupedContent={deck.markuped_cards_adoption}
              textContent={deck.cards_adoption}
            />
            <TextSection
              heading="詳細やその他の情報"
              markupedContent={deck.markuped_detail}
              textContent={deck.detail}
            />
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

interface TextSectionProps {
  heading: ReactNode
  markupedContent: object | null
  textContent: string | undefined
}
const TextSection: FC<TextSectionProps> = ({ heading, markupedContent, textContent }) => {
  const showMarkuped = !!markupedContent
  const showText = !showMarkuped && textContent !== undefined
  return (
    <>
      {(showMarkuped || showText) &&
        <>
          <Heading fontSize={'xl'} mt={3} mb={2}>
            {heading}
          </Heading>
        </>
      }
      {showMarkuped &&
        <RichViewer
          value={markupedContent as SerializedEditorState}
        />
      }
      {showText &&
        <p>{textContent}</p>
      }
    </>
  )
}

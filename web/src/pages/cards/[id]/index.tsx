import { Box, Spinner, Stack } from '@chakra-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import DefaultErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { CardBasicInfo } from '~/components/card/BasicInfo'
import { CardRank } from '~/components/card/Rank'
import { YouTubeMovie } from '~/components/card/YouTubeMovie'
import { ComboList } from '~/components/combo/List'
import { QuestionList } from '~/components/question/List'
import {
  Card,
  Combo,
  Question,
  cardConverter,
  cardRef,
  cardsRef,
  comboConverter,
  getCategoryDetail,
  getDoc,
  getDocs,
  questionConverter,
} from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'
import { designatedCardIdCombosRef } from '~/models/combo'
import { designatedCardIdQuestionsRef } from '~/models/question'
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
  combos: Serialized<Combo>[] | null
  questions: Serialized<Question>[] | null
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
  const combosSnapshot =
    cardId !== undefined
      ? await getDocs(designatedCardIdCombosRef(cardId))
      : undefined
  const combos = combosSnapshot?.docs.map((doc) => doc.data())
  const questionsSnapshot =
    cardId !== undefined
      ? await getDocs(designatedCardIdQuestionsRef(cardId))
      : undefined
  const questions = questionsSnapshot?.docs.map((doc) => doc.data())
  const result = {
    props: {
      card: card ? serialize(card) : null,
      combos: combos ? serializeArray(combos) : null,
      questions: questions ? serializeArray(questions) : null,
    },
    revalidate: 10000,
  }
  return result
}

const Page = ({
  card: staticCard,
  combos: staticCombos,
  questions: staticQuestions,
}: Props) => {
  const router = useRouter()
  const cardId = router.query.id

  const { isAdmin } = useAuthState()

  const [card, loading, error] = useDocumentData(
    typeof cardId === 'string' ? cardRef(cardId) : null,
    {
      initialValue: staticCard
        ? deserialize(staticCard, { ref: cardConverter })
        : undefined,
    }
  )
  const [combos, loadingCombos, errorCombos] = useCollectionData(
    typeof cardId === 'string' ? designatedCardIdCombosRef(cardId) : null,
    {
      initialValue: staticCombos
        ? deserializeArray(staticCombos, { ref: comboConverter })
        : undefined,
    }
  )
  const [questions, loadingQuestions, errorQuestions] = useCollectionData(
    typeof cardId === 'string' ? designatedCardIdQuestionsRef(cardId) : null,
    {
      initialValue: staticQuestions
        ? deserializeArray(staticQuestions, { ref: questionConverter })
        : undefined,
    }
  )

  const categoryDetail = card ? getCategoryDetail(card) : undefined
  if (!card && !loading && cardId !== undefined)
    return <DefaultErrorPage statusCode={404} />
  return (
    <DefaultLayout>
      {card && categoryDetail ? (
        <Stack gap={10} my={4}>
          {isAdmin && <Box mb={-4}>Card ID: {card.id}</Box>}
          <CardBasicInfo card={card} />
          <CardRank card={card} />
          {combos && <ComboList combos={combos} baseCardId={card.id} />}
          {questions && (
            <QuestionList questions={questions} baseCardId={card.id} />
          )}
          <YouTubeMovie card={card} />
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

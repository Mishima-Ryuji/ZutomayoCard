import { Box, Spinner, Stack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
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
import { cardRef, getCategoryDetail } from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'
import { designatedCardIdCombosRef } from '~/models/combo'
import { designatedCardIdQuestionsRef } from '~/models/question'

const Page = () => {
  const router = useRouter()
  const cardId = router.query.id

  const { isAdmin } = useAuthState()

  const [card, loading, error] = useDocumentData(
    typeof cardId === 'string' ? cardRef(cardId) : null
  )
  const [combos, loadingCombos, errorCombos] = useCollectionData(
    typeof cardId === 'string' ? designatedCardIdCombosRef(cardId) : null
  )
  const [questions, loadingQuestions, errorQuestions] = useCollectionData(
    typeof cardId === 'string' ? designatedCardIdQuestionsRef(cardId) : null
  )

  const categoryDetail = card ? getCategoryDetail(card) : undefined

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

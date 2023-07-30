import { Box, Heading, Spinner } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { CardSearcher } from '~/components/card/Searcher'
import { Card, cardConverter, cardsRef, getDocs } from '~/firebase'
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
  return (
    <DefaultLayout
      head={{
        title: '検索',
        description:
          'ずとまよカードを属性やレアリティ、効果、カード名で絞り込み検索をすることができます。',
      }}
    >
      <Heading mt={3} fontSize={'2xl'}>
        検索
      </Heading>
      <Box py={3}>
        {cards ? (
          <CardSearcher cards={cards} />
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

'use client'

import { Flex, Tab, TabList, Tabs } from '@chakra-ui/react'
import { getDocs } from 'firebase/firestore'
import { GetStaticProps } from 'next'
import { useMemo, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { CardList } from '~/components/card/List'
import { Card, cardConverter, cardsRef } from '~/firebase'
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
    revalidate: 60 * 10,
  }
  return result
}

const Page = ({ cards: staticCards }: Props) => {
  const [category, setCategory] = useState<Card['category']>('1st')
  const [cards, loading, error] = useCollectionData(cardsRef, {
    initialValue: deserializeArray(staticCards, { ref: cardConverter }),
  })
  const formattedCards = useMemo(() => {
    return cards
      ?.filter((card) => card.category === category)
      .sort((a, b) => a.order - b.order)
  }, [cards, category])
  return (
    <DefaultLayout eyecatchImage>
      <Flex py={3}>
        <Tabs variant="soft-rounded" colorScheme="purple">
          <TabList overflowY={'auto'}>
            <Tab flexShrink={0} onClick={() => setCategory('1st')}>
              第一弾
            </Tab>
            <Tab flexShrink={0} onClick={() => setCategory('2nd')}>
              第二弾
            </Tab>
            <Tab
              flexShrink={0}
              onClick={() => setCategory('local/techno_poor')}
            >
              ご当地
            </Tab>
            <Tab flexShrink={0} onClick={() => setCategory('bonus/jinkougaku')}>
              特典
            </Tab>
            <Tab flexShrink={0} onClick={() => setCategory('collab/OIOI')}>
              コラボ
            </Tab>
          </TabList>
        </Tabs>
      </Flex>
      {formattedCards && (
        <CardList cards={formattedCards} width={'150px'} marginAuto />
      )}
    </DefaultLayout>
  )
}

export default Page

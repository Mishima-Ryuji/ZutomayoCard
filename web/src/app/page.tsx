'use client'

import { Flex, Tab, TabList, Tabs } from '@chakra-ui/react'
import { useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { CardList } from '~/components/card/List'
import { Card } from '~/firebase'
import { sortedCategoryCardsRef } from '~/models/card'

const Page = () => {
  const [category, setCategory] = useState<Card['category']>('1st')
  const [cards, loading, error] = useCollectionData(
    sortedCategoryCardsRef(category)
  )
  return (
    <DefaultLayout eyecatchImage>
      <Flex py={3}>
        <Tabs variant="soft-rounded" colorScheme="purple">
          <TabList>
            <Tab onClick={() => setCategory('1st')}>第一弾</Tab>
            <Tab onClick={() => setCategory('2nd')}>第二段</Tab>
            <Tab onClick={() => setCategory('local/techno_poor')}>ご当地</Tab>
            <Tab onClick={() => setCategory('bonus/jinkougaku')}>特典</Tab>
            <Tab onClick={() => setCategory('collab/OIOI')}>コラボ</Tab>
          </TabList>
        </Tabs>
      </Flex>
      {cards && <CardList cards={cards} />}
    </DefaultLayout>
  )
}

export default Page

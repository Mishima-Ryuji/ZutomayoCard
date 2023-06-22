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
      {cards && <CardList cards={cards} width={'200px'} />}
    </DefaultLayout>
  )
}

export default Page

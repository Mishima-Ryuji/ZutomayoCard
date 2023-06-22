import {
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  Input,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { CardList } from '~/components/card/List'
import { Card, cardsRef } from '~/firebase'
import { isBlank } from '~/shared/utils'

type SearchElementProps = {
  cards: Card[]
}

const SearchByName = ({ cards }: SearchElementProps) => {
  const [keyword, setKeyword] = useState('')
  const result = useMemo(() => {
    return cards.filter(
      (card) =>
        (!isBlank(card.name) && card.name.includes(keyword)) ||
        (!isBlank(card.name_furigana) && card.name_furigana.includes(keyword))
    )
  }, [keyword])
  return (
    <>
      <Input
        placeholder="カード名のキーワードを入力"
        mb={5}
        value={keyword}
        onChange={(e) => setKeyword(e.currentTarget.value)}
      />
      {keyword ? (
        <CardList cards={result} width={'200px'} />
      ) : (
        <Box>キーワードを入力してください。</Box>
      )}
    </>
  )
}

const SearchByEffect = ({ cards }: SearchElementProps) => {
  const [keyword, setKeyword] = useState('')
  const result = useMemo(() => {
    return cards.filter((card) => card.effect?.includes(keyword))
  }, [keyword])
  return (
    <>
      <Input
        placeholder="効果のキーワードを入力"
        mb={5}
        value={keyword}
        onChange={(e) => setKeyword(e.currentTarget.value)}
      />
      {keyword ? (
        <CardList cards={result} width={'200px'} />
      ) : (
        <Box>キーワードを入力してください。</Box>
      )}
    </>
  )
}

const SearchByAttribute = ({ cards }: SearchElementProps) => {
  const [elements, setElements] = useState<Card['element'][]>([
    'darkness',
    'wind',
    'electricity',
    'flame',
  ])
  console.log(elements.includes('darkness'))
  const result = useMemo(() => {
    return cards.filter(() => true)
  }, [elements])
  return (
    <>
      <CheckboxGroup>
        <Stack spacing={[1, 5]} direction={['column', 'row']}>
          <Checkbox
            value="darkness"
            isChecked={elements.includes('darkness')}
            onChange={(e) =>
              setElements(
                e.currentTarget.checked
                  ? [...elements, 'darkness']
                  : elements.filter((e) => e !== 'darkness')
              )
            }
          >
            闇属性
          </Checkbox>
          <Checkbox
            value="wind"
            defaultChecked
            isChecked={elements.includes('wind')}
            onChange={(e) =>
              setElements(
                e.currentTarget.checked
                  ? [...elements, 'wind']
                  : elements.filter((e) => e !== 'wind')
              )
            }
          >
            風属性
          </Checkbox>
          <Checkbox
            value="electricity"
            defaultChecked
            isChecked={elements.includes('electricity')}
            onChange={(e) =>
              setElements(
                e.currentTarget.checked
                  ? [...elements, 'electricity']
                  : elements.filter((e) => e !== 'electricity')
              )
            }
          >
            電気属性
          </Checkbox>
          <Checkbox
            value="flame"
            defaultChecked
            isChecked={elements.includes('flame')}
            onChange={(e) =>
              setElements(
                e.currentTarget.checked
                  ? [...elements, 'flame']
                  : elements.filter((e) => e !== 'flame')
              )
            }
          >
            炎属性
          </Checkbox>
        </Stack>
      </CheckboxGroup>
      <CardList cards={result} width={'200px'} />
    </>
  )
}

const Page = () => {
  const [cards, loading, error] = useCollectionData(cardsRef)
  return (
    <DefaultLayout>
      <Flex py={3}>
        <Tabs variant="soft-rounded" colorScheme="purple" width={'100%'}>
          <TabList>
            <Tab>カード名で検索</Tab>
            <Tab>効果で検索</Tab>
            <Tab>絞り込み検索</Tab>
          </TabList>
          {cards ? (
            <TabPanels>
              <TabPanel px={0}>
                <SearchByName cards={cards} />
              </TabPanel>
              <TabPanel px={0}>
                <SearchByEffect cards={cards} />
              </TabPanel>
              <TabPanel px={0}>
                <SearchByAttribute cards={cards} />
              </TabPanel>
            </TabPanels>
          ) : (
            <Box textAlign={'center'} p="5">
              <Spinner m="auto" />
            </Box>
          )}
        </Tabs>
      </Flex>
    </DefaultLayout>
  )
}

export default Page

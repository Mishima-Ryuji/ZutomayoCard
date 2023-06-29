import {
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  Heading,
  Input,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { useMemo, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { CardList } from '~/components/card/List'
import {
  Card,
  CardElement,
  CardRarity,
  CardType,
  cardConverter,
  cardsRef,
  getDocs,
} from '~/firebase'
import { cardsSorter } from '~/models/card'
import {
  Serialized,
  deserializeArray,
  isBlank,
  serializeArray,
} from '~/shared/utils'

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

type SearchElementProps = {
  cards: Card[]
}

const SearchByName = ({ cards }: SearchElementProps) => {
  const [keyword, setKeyword] = useState('')
  const result = useMemo(() => {
    return cards
      .filter(
        (card) =>
          (!isBlank(card.name) && card.name.includes(keyword)) ||
          (!isBlank(card.name_furigana) && card.name_furigana.includes(keyword))
      )
      .sort(cardsSorter)
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
        <CardList cards={result} width={'150px'} marginAuto />
      ) : (
        <Box>キーワードを入力してください。</Box>
      )}
    </>
  )
}

const SearchByEffect = ({ cards }: SearchElementProps) => {
  const [keyword, setKeyword] = useState('')
  const result = useMemo(() => {
    return cards
      .filter((card) => card.effect?.includes(keyword))
      .sort(cardsSorter)
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
        <CardList cards={result} width={'150px'} marginAuto />
      ) : (
        <Box>キーワードを入力してください。</Box>
      )}
    </>
  )
}

const SearchByAttribute = ({ cards }: SearchElementProps) => {
  const [elements, setElements] = useState<CardElement[]>([
    'darkness',
    'flame',
    'electricity',
    'wind',
  ])
  const [types, setTypes] = useState<CardType[]>([
    'character',
    'enchant',
    'area_enchant',
  ])
  const [rarities, setRarities] = useState<CardRarity[]>([
    'SE',
    'UR',
    'SR+',
    'SR',
    'R+',
    'R',
    'N+',
    'N',
  ])
  const result = useMemo(() => {
    return cards
      .filter(
        (card) =>
          card.element !== undefined &&
          elements.includes(card.element) &&
          card.type !== undefined &&
          types.includes(card.type) &&
          card.rarity !== undefined &&
          rarities.includes(card.rarity)
      )
      .sort(cardsSorter)
  }, [elements, types])
  return (
    <>
      <Stack gap={5} mb={6}>
        <CheckboxGroup defaultValue={elements}>
          <Stack spacing={[3, 5]} direction={'row'} overflow={'auto'}>
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
          </Stack>
        </CheckboxGroup>
        <CheckboxGroup defaultValue={types}>
          <Stack spacing={[3, 5]} direction={'row'} overflow={'auto'}>
            <Checkbox
              value="character"
              defaultChecked
              isChecked={types.includes('character')}
              onChange={(e) =>
                setTypes(
                  e.currentTarget.checked
                    ? [...types, 'character']
                    : types.filter((e) => e !== 'character')
                )
              }
            >
              Character
            </Checkbox>
            <Checkbox
              value="enchant"
              defaultChecked
              isChecked={types.includes('enchant')}
              onChange={(e) =>
                setTypes(
                  e.currentTarget.checked
                    ? [...types, 'enchant']
                    : types.filter((e) => e !== 'enchant')
                )
              }
            >
              Enchant
            </Checkbox>
            <Checkbox
              value="area_enchant"
              defaultChecked
              isChecked={types.includes('area_enchant')}
              onChange={(e) =>
                setTypes(
                  e.currentTarget.checked
                    ? [...types, 'area_enchant']
                    : types.filter((e) => e !== 'area_enchant')
                )
              }
            >
              Area Enchant
            </Checkbox>
          </Stack>
        </CheckboxGroup>
        <CheckboxGroup defaultValue={rarities}>
          <Stack spacing={[3, 5]} direction={'row'} overflow={'auto'}>
            <Checkbox
              value="UR"
              defaultChecked
              isChecked={rarities.includes('UR')}
              onChange={(e) =>
                setRarities(
                  e.currentTarget.checked
                    ? [...rarities, 'UR']
                    : rarities.filter((e) => e !== 'UR')
                )
              }
            >
              UR
            </Checkbox>
            <Checkbox
              value="SR"
              defaultChecked
              isChecked={rarities.includes('SR')}
              onChange={(e) =>
                setRarities(
                  e.currentTarget.checked
                    ? [...rarities, 'SR']
                    : rarities.filter((e) => e !== 'SR')
                )
              }
            >
              SR
            </Checkbox>
            <Checkbox
              value="R"
              defaultChecked
              isChecked={rarities.includes('R')}
              onChange={(e) =>
                setRarities(
                  e.currentTarget.checked
                    ? [...rarities, 'R']
                    : rarities.filter((e) => e !== 'R')
                )
              }
            >
              R
            </Checkbox>
            <Checkbox
              value="N"
              defaultChecked
              isChecked={rarities.includes('N')}
              onChange={(e) =>
                setRarities(
                  e.currentTarget.checked
                    ? [...rarities, 'N']
                    : rarities.filter((e) => e !== 'N')
                )
              }
            >
              N
            </Checkbox>
            <Checkbox
              value="SE"
              defaultChecked
              isChecked={rarities.includes('SE')}
              onChange={(e) =>
                setRarities(
                  e.currentTarget.checked
                    ? [...rarities, 'SE']
                    : rarities.filter((e) => e !== 'SE')
                )
              }
            >
              SE
            </Checkbox>
            <Checkbox
              value="SR+"
              defaultChecked
              isChecked={rarities.includes('SR+')}
              onChange={(e) =>
                setRarities(
                  e.currentTarget.checked
                    ? [...rarities, 'SR+']
                    : rarities.filter((e) => e !== 'SR+')
                )
              }
            >
              SR+
            </Checkbox>
            <Checkbox
              value="R+"
              defaultChecked
              isChecked={rarities.includes('R+')}
              onChange={(e) =>
                setRarities(
                  e.currentTarget.checked
                    ? [...rarities, 'R+']
                    : rarities.filter((e) => e !== 'R+')
                )
              }
            >
              R+
            </Checkbox>
            <Checkbox
              value="N+"
              defaultChecked
              isChecked={rarities.includes('N+')}
              onChange={(e) =>
                setRarities(
                  e.currentTarget.checked
                    ? [...rarities, 'N+']
                    : rarities.filter((e) => e !== 'N+')
                )
              }
            >
              N+
            </Checkbox>
          </Stack>
        </CheckboxGroup>
      </Stack>
      <CardList cards={result} width={'150px'} marginAuto />
    </>
  )
}

const Page = ({ cards: staticCards }: Props) => {
  const [cards, loading, error] = useCollectionData(cardsRef, {
    initialValue: deserializeArray(staticCards, { ref: cardConverter }),
  })
  return (
    <DefaultLayout>
      <Heading mt={3} fontSize={'2xl'}>
        検索
      </Heading>
      <Flex py={3}>
        <Tabs variant="soft-rounded" colorScheme="purple" width={'100%'}>
          <TabList>
            <Tab>絞り込み</Tab>
            <Tab>カード名</Tab>
            <Tab>効果</Tab>
          </TabList>
          {cards ? (
            <TabPanels>
              <TabPanel px={0}>
                <SearchByAttribute cards={cards} />
              </TabPanel>
              <TabPanel px={0}>
                <SearchByName cards={cards} />
              </TabPanel>
              <TabPanel px={0}>
                <SearchByEffect cards={cards} />
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

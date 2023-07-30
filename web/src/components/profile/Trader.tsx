import {
  CardBody,
  CardHeader,
  Card as ChakraCard,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useMemo } from 'react'
import { Card, Profile } from '~/firebase'
import { cardsSorter } from '~/models/card'
import { CardList } from '../card/List'

type ItemProps = {
  currentUserProfile?: Profile
  profile: Profile
  card: Card
  cards: Card[]
}

export const TraderItem = ({
  profile,
  card,
  cards,
  currentUserProfile,
}: ItemProps) => {
  const receivedCards = useMemo(() => {
    const currentUserOfferedCardIds = currentUserProfile?.offered_card_ids ?? []
    return cards
      .filter((card) => profile.received_card_ids.includes(card.id))
      .filter((c) => c.rarity === card.rarity)
      .sort((a, b) => {
        if (
          currentUserOfferedCardIds.includes(a.id) &&
          currentUserOfferedCardIds.includes(b.id)
        ) {
          if (a.category === card.category && b.category === card.category) {
            return cardsSorter(a, b)
          } else if (a.category === card.category) {
            return -1
          } else if (b.category === card.category) {
            return 1
          } else {
            return cardsSorter(a, b)
          }
        } else if (currentUserOfferedCardIds.includes(a.id)) {
          return -1
        } else if (currentUserOfferedCardIds.includes(b.id)) {
          return 1
        } else {
          if (a.category === card.category && b.category === card.category) {
            return cardsSorter(a, b)
          } else if (a.category === card.category) {
            return -1
          } else if (b.category === card.category) {
            return 1
          } else {
            return cardsSorter(a, b)
          }
        }
      })
  }, [card, cards, currentUserProfile])
  return (
    <ChakraCard>
      <CardHeader pb={0}>
        <Heading fontSize={'xl'} color={'purple.500'}>
          <Link href={`/profiles/${profile.id}`}>{profile.name}</Link>
        </Heading>
      </CardHeader>
      <CardBody py={3}>
        <Text fontSize={'sm'}>{profile.requirement}</Text>
        <Heading fontSize={'medium'} mb={2} mt={3}>
          相手が欲しい代表的なカード
        </Heading>
        <CardList cards={receivedCards} columns={[5, 6, 7, 8]} />
      </CardBody>
    </ChakraCard>
  )
}

type ListProps = {
  currentUserProfile: Profile | undefined
  profiles: Profile[]
  card: Card
  cards: Card[]
}

export const TraderList = ({ profiles, card, cards }: ListProps) => {
  return (
    <>
      <Stack gap={4}>
        {profiles.map((profile) => (
          <TraderItem
            key={profile.id}
            profile={profile}
            card={card}
            cards={cards}
          />
        ))}
        {profiles.length === 0 && <Text>交換相手が見つかりませんでした。</Text>}
      </Stack>
    </>
  )
}

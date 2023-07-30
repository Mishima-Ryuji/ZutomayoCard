import {
  Badge,
  Box,
  Button,
  CardBody,
  CardHeader,
  Card as ChakraCard,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react'
import { arrayRemove, arrayUnion } from 'firebase/firestore'
import Link from 'next/link'
import { useState } from 'react'
import { FaPencilAlt } from 'react-icons/fa'
import { CardItem } from '~/components/card/Item'
import { Card, getCategoryDetail, getDisplayType, updateDoc } from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'
import { LoginPopup } from '../auth/LoginPopup'
import { CardElementImage } from './ElementImage'

type Props = {
  card: Card
}

export const CardBasicInfo = ({ card }: Props) => {
  const categoryDetail = getCategoryDetail(card)
  const { isAdmin, user, profile } = useAuthState()
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  return (
    <Flex gap={5} width={'100%'} direction={['column', 'row']}>
      <Box display={['none', 'block']}>
        <CardItem card={card} width={['100%', 250]} highResolution />
      </Box>
      <ChakraCard flexGrow={1}>
        <CardHeader>
          <Stack direction="row" mb={2}>
            <Badge colorScheme="purple">{categoryDetail.name}</Badge>
            <Badge colorScheme="purple">
              {`${card.no} / ${categoryDetail.denominator}`}
            </Badge>
            {card.rarity && <Badge colorScheme="purple">{card.rarity}</Badge>}
          </Stack>
          <Flex alignItems={'center'}>
            {card.element && (
              <CardElementImage element={card.element} size={40} />
            )}
            <Heading size={['md', 'lg']}>{card.name}</Heading>
          </Flex>
          {isAdmin && (
            <Link href={`/cards/${card.id}/edit`}>
              <Button colorScheme="purple" size="xs" mt={2} gap={1}>
                <FaPencilAlt />
                カードの基本情報を編集
              </Button>
            </Link>
          )}
          <Box display={['block', 'none']} mt={5}>
            <CardItem card={card} width={['100%', 250]} highResolution />
          </Box>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            {card.type && (
              <Box>
                <Heading size="md">種類</Heading>
                <Text pt="2" fontSize="md" fontWeight={'bold'}>
                  {getDisplayType(card)}
                </Text>
              </Box>
            )}
            {card.effect !== undefined && card.effect !== '' && (
              <Box>
                <Heading size="md">効果</Heading>
                <Text pt="2" fontSize="sm">
                  {card.effect}
                </Text>
              </Box>
            )}
            {card.clock !== undefined && (
              <Box>
                <Heading size="md">時計</Heading>
                <Text pt="2" fontSize="md" fontWeight={'bold'}>
                  {card.clock}
                </Text>
              </Box>
            )}
            {card.day_offensive_strength !== undefined &&
              card.night_offensive_strength !== undefined && (
                <Box>
                  <Heading size="md">攻撃力</Heading>
                  <Stack direction="row" mt={2}>
                    <Badge
                      colorScheme="purple"
                      fontSize={'md'}
                    >{`Night ${card.night_offensive_strength}`}</Badge>
                    <Badge
                      colorScheme="purple"
                      fontSize={'md'}
                    >{`Day ${card.day_offensive_strength}`}</Badge>
                  </Stack>
                  <Text pt="2" fontSize="sm" fontWeight={'bold'}></Text>
                </Box>
              )}
            {card.power !== undefined && (
              <Box>
                <Heading size="md">SEND TO POWER</Heading>
                <Text pt="2" fontSize="sm">
                  {card.power > 0 && card.power < 10 ? (
                    <>{[...Array<unknown>(card.power)].map(() => '♦︎')}</>
                  ) : (
                    `♦︎ × ${card.power}`
                  )}
                </Text>
              </Box>
            )}
            {card.power_cost !== undefined && (
              <Box>
                <Heading size="md">POWER COST</Heading>
                <Text pt="2" fontSize="sm">
                  {card.power_cost > 0 && card.power_cost < 10 ? (
                    <>{[...Array<unknown>(card.power_cost)].map(() => '♦︎')}</>
                  ) : (
                    `♦︎ × ${card.power_cost}`
                  )}
                </Text>
              </Box>
            )}
            <Box>
              <Heading size="md">入手方法</Heading>
              <Text pt="2" fontSize="sm">
                {categoryDetail.procurement_method}
              </Text>
              <Flex mt={3} gap={2}>
                <LoginPopup
                  show={showLoginPopup}
                  onHide={() => setShowLoginPopup(false)}
                />
                {user ? (
                  <Link href={`/cards/${card.id}/trade`}>
                    <Button colorScheme="purple" size={'sm'}>
                      交換相手を探す
                    </Button>
                  </Link>
                ) : (
                  <Button
                    colorScheme="purple"
                    size={'sm'}
                    onClick={() => setShowLoginPopup(true)}
                  >
                    交換相手を探す
                  </Button>
                )}
                {profile && (
                  <Button
                    colorScheme={
                      profile.received_card_ids.includes(card.id)
                        ? 'red'
                        : 'purple'
                    }
                    size={'sm'}
                    onClick={async () => {
                      if (profile.received_card_ids.includes(card.id)) {
                        await updateDoc(profile.ref, {
                          received_card_ids: arrayRemove(card.id),
                        })
                      } else {
                        await updateDoc(profile.ref, {
                          received_card_ids: arrayUnion(card.id),
                        })
                      }
                    }}
                  >
                    {profile.received_card_ids.includes(card.id)
                      ? '欲しい登録を解除'
                      : '欲しい登録'}
                  </Button>
                )}
              </Flex>
            </Box>
          </Stack>
        </CardBody>
      </ChakraCard>
    </Flex>
  )
}

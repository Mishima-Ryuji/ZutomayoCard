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
import Link from 'next/link'
import { FaPencilAlt } from 'react-icons/fa'
import { CardItem } from '~/components/card/Item'
import { Card, getCategoryDetail, getDisplayType } from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'

type Props = {
  card: Card
}

export const CardBasicInfo = ({ card }: Props) => {
  const categoryDetail = getCategoryDetail(card)
  const { isAdmin } = useAuthState()
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
          <Heading size="lg">{card.name}</Heading>
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
            </Box>
          </Stack>
        </CardBody>
      </ChakraCard>
    </Flex>
  )
}

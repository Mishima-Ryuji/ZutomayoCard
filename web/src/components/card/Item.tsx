import { AspectRatio, Box, ResponsiveValue } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, getCategoryDetail } from '~/firebase'

type Props = {
  card: Card
  width?: ResponsiveValue<number | string>
}

export const CardItem = ({ card, width }: Props) => {
  const categoryDetail = getCategoryDetail(card)
  return (
    <Link href={`/cards/${card.id}`}>
      <AspectRatio maxW="400px" width={width} ratio={63 / 88}>
        {card.image ? (
          <Image
            src={card.image.url}
            alt={`${
              card.name ? `ずとまよカード「${card.name}」` : 'ずとまよカード'
            }の写真`}
            fill
          />
        ) : (
          <Box width={'100%'} height="100%" border={'solid'} p={2}>
            {categoryDetail.name}
            <br />
            {card.no} / {categoryDetail.denominator}
          </Box>
        )}
      </AspectRatio>
    </Link>
  )
}

import { AspectRatio, Box, ResponsiveValue } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, getCategoryDetail } from '~/firebase'

type Props = {
  card: Card
  width?: ResponsiveValue<number | string>
  marginAuto?: boolean
  highResolution?: boolean
}

export const CardItem = ({
  card,
  width,
  marginAuto = false,
  highResolution = false,
}: Props) => {
  const categoryDetail = getCategoryDetail(card)
  const url = !highResolution
    ? card.resized_image?.url ?? card.image?.url
    : card.image?.url
  return (
    <Link href={`/cards/${card.id}`}>
      <AspectRatio
        maxW="400px"
        width={width}
        m={marginAuto ? 'auto' : '0'}
        ratio={63 / 88}
      >
        {url !== undefined ? (
          <Image
            src={url}
            alt={`${
              card.name !== undefined
                ? `ずとまよカード「${card.name}」`
                : 'ずとまよカード'
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

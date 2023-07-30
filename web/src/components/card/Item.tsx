import { AspectRatio, Box, ResponsiveValue, Tag } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, getCategoryDetail } from '~/firebase'
import { PromiseVoid } from '~/types'

type Props = {
  card: Card
  width?: ResponsiveValue<number | string>
  maxWidth?: ResponsiveValue<number | string>
  onSelect?: (card: Card) => PromiseVoid
  highResolution?: boolean
  selectCount?: number
  selected?: boolean
}

export const CardItem = ({
  card,
  width,
  maxWidth,
  highResolution = false,
  selectCount,
  selected,
  onSelect: handleSelect,
}: Props) => {
  const categoryDetail = getCategoryDetail(card)
  const url = !highResolution
    ? card.resized_image?.url ?? card.image?.url
    : card.image?.url

  const Img = (
    <Box
      position={'relative'}
      width={'100%'}
      height="100%"
      border={selected === true && selectCount === undefined ? 'solid' : 'none'}
      borderColor={'red.400'}
      borderWidth={'5px'}
      cursor={'pointer'}
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
      {selectCount !== undefined && selectCount > 0 && (
        <Tag
          size={'sm'}
          position={'absolute'}
          right={0.5}
          top={0.5}
          variant={'solid'}
          colorScheme="red"
        >
          {selectCount}
        </Tag>
      )}
    </Box>
  )
  return (
    <AspectRatio
      width={width ?? '100%'}
      maxWidth={maxWidth}
      ratio={63 / 88}
      onClick={async () => {
        if (handleSelect) await handleSelect(card)
      }}
    >
      {handleSelect === undefined ? (
        <Link href={`/cards/${card.id}`}>{Img}</Link>
      ) : (
        Img
      )}
    </AspectRatio>
  )
}

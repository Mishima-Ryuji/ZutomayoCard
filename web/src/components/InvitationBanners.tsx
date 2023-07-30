import { AspectRatio, Flex } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'

export const InvitationBanners = () => {
  return (
    <Flex gap={6} direction={['column', 'column', 'column', 'row']}>
      <AspectRatio width={'100%'} ratio={720 / 90}>
        <Link href={'/about'}>
          <Image
            alt="Wiki協力者の招待バナー"
            src={'/wiki_invitation_banner.png'}
            fill
          />
        </Link>
      </AspectRatio>
      <AspectRatio width={'100%'} ratio={720 / 90}>
        <Link href={'/discord'}>
          <Image
            alt="Discord招待バナー"
            src={'/match_invitation_banner.png'}
            fill
          />
        </Link>
      </AspectRatio>
    </Flex>
  )
}

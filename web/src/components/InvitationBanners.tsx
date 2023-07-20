import { AspectRatio } from '@chakra-ui/react'
import Image from 'next/image'

export const InvitationBanners = () => {
  return (
    <AspectRatio width={['100%', '100%', '50%']} ratio={720 / 90}>
      <Image alt="招待バナー" src={'/invitation_banner.png'} fill />
    </AspectRatio>
  )
}

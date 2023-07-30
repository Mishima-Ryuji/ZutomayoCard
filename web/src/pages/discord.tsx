import { Heading } from '@chakra-ui/react'
import { DefaultLayout } from '~/components/Layout'

const Page = () => {
  return (
    <DefaultLayout noBanner footerNone>
      <Heading mt={3} fontSize={'2xl'}>
        Discordで対戦したい方へ
      </Heading>
    </DefaultLayout>
  )
}

export default Page

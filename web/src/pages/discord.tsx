import { Button, Heading, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { FaTwitter } from 'react-icons/fa'
import { DefaultLayout } from '~/components/Layout'

const Page = () => {
  return (
    <DefaultLayout noBanner footerNone>
      <Heading mt={3} fontSize={'2xl'} mb={2}>
        Discordで対戦したい方へ
      </Heading>
      <Text>
        {`ZUTOMAYO CARDで遊べる仲間が周りに居ない、カードゲームで遊ぶのが初めてでどのようにしたらいいか分からない等のZUTOMAYO CARDに関するお悩みを抱えている方が、対戦をしたり、デッキ構築の相談ができるDiscordサーバーZUTOMAYO CARD CLOUBがあります。参加をご希望される方は、以下のDiscordのサーバーの管理人（i-kunさん）のTwitterに連絡をしてください。`}
      </Text>
      <Link href={`https://twitter.com/nora_nekosanpo`}>
        <Button colorScheme="twitter" leftIcon={<FaTwitter />} mt={4}>
          Twitter
        </Button>
      </Link>
    </DefaultLayout>
  )
}

export default Page

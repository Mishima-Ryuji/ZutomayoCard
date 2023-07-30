import { Box, Heading, ListItem, UnorderedList } from '@chakra-ui/react'
import { DefaultLayout } from '~/components/Layout'

const Page = () => {
  return (
    <DefaultLayout noBanner footerNone>
      <Heading mt={3} fontSize={'2xl'}>
        利用上の注意点
      </Heading>
      <Box>
        <UnorderedList>
          <ListItem py={1}>
            本サービスは非公式のサービスであり、「ずっと真夜中でいいのに。」の公認のサービスではありません。
          </ListItem>
          <ListItem py={1}>
            本サービスの運営は、完全に非営利でファンコミュニティとして運営しています。
          </ListItem>
          <ListItem py={1}>
            本サービスに掲載されているカードの画像は、カードの実物を直接撮影したものを掲載しています。カードを直接撮影した上での掲載は、公式に問い合わせて問題ないことを確認しております。
          </ListItem>
          <ListItem py={1}>
            本サービスに掲載されているカードの画像以外のイラストや画像は運営で制作した二次創作です。
          </ListItem>
          <ListItem py={1}>
            本サービス上の画像や情報を無断で利用することは禁止です。
          </ListItem>
          <ListItem py={1}>
            本サービスは公式から警告や中止の要請があった場合は速やかにその要求に応じます。
          </ListItem>
          <ListItem py={1}>
            本サービスの掲載内容は、不明点を公式のスタッフに尋ねることでなるべく正しい情報を掲載するように心掛けていますが、完全に正しさが保証されたものではありません。
          </ListItem>
        </UnorderedList>
      </Box>
    </DefaultLayout>
  )
}

export default Page

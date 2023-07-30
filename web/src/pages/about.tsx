import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { FaTwitter, FaYoutube } from 'react-icons/fa'
import { DefaultLayout } from '~/components/Layout'

type Member = {
  name: string
  img_path: string
  roles: string[]
  profile?: string
  twitter: string
  youtube?: string
}

const MEMBERS: Member[] = [
  {
    name: 'Ryuji',
    img_path: '/admins/ryuji.jpg',
    roles: ['管理人', 'エンジニア'],
    profile: `Zutomayo Card Wikiの管理人。ずとまよPremium会員。ずとまよカード完全フルコンプ勢（ご当地カードや限定カードも含む）。好きな曲は、ミラーチューン、お勉強しといてよ、残機、あいつら全員同窓会、花一匁。本職はエンジニア。`,
    twitter: 'zutomayo_ryuji',
  },
  {
    name: 'まこう',
    img_path: '/admins/ztmy_card.jpg',
    roles: ['カードの評価', 'デッキの構築', '動画制作'],
    profile:
      'YouTubeにてずとまよカードの解説をしています。カードゲーム経験多。相談・質問等は気軽にTwitterまで',
    twitter: 'ztmy_card',
    youtube: '@ztmycard',
  },
  {
    name: '布教(ズトカ布教し隊)🔥',
    img_path: '/admins/zutomayo_card_.jpg',
    profile:
      'ずとまよカードの強いデッキやカードの紹介をしていく jobをしています。非公式。ルールやデッキなど諸々の事はDMまで...ガチでずとかやりたい人向けディスコサーバー(こちらもDMまで)',
    roles: ['カードの評価', 'デッキの構築'],
    twitter: 'zutomayo_card_',
  },
  {
    name: 'i-kun(ｱｲｸﾝ)',
    img_path: '/admins/nora_nekosanpo.jpg',
    roles: ['Discord管理人'],
    profile:
      'ずとまよPREMIUM🎖/DiscordサーバーZUTOMAYO CARD CLUB管理人/ズトカ第一弾コンプ',
    twitter: 'nora_nekosanpo',
  },
]

const Page = () => {
  return (
    <DefaultLayout noBanner>
      <Flex gap={4} mt={3}>
        <Stack flexGrow={1}>
          <Heading fontSize={'2xl'}>Zutomayo Card Wikiの運営について</Heading>
          <Text py="2">
            {`Zutomayo Card Wikiはズトカをより多くの人に楽しんでもらうことを目的として運営しております。今後もズトカを楽しむ上で便利になる機能を追加していく予定です。デザインや開発、動画制作、カードの登録をできる協力者を募集中です。興味がある方は本ページの「運営に協力したい方へ」をご覧いただければ幸いです。`}
          </Text>
        </Stack>
        <AspectRatio
          ratio={1524 / 1076}
          flexShrink={0}
          width={'30%'}
          display={['none', 'block']}
        >
          <Image fill src={'/about.jpg'} alt="Wiki about" />
        </AspectRatio>
      </Flex>

      <Heading mt={7} mb={2} fontSize={'xl'}>
        メンバー一覧
      </Heading>
      <Stack gap={4}>
        {MEMBERS.map((member) => (
          <Card key={member.name}>
            <CardHeader>
              <Flex gap={3} align={'center'}>
                <Box>
                  <Image
                    width={50}
                    height={50}
                    src={member.img_path}
                    alt={`${member.name}のプロフィール`}
                  />
                </Box>
                <Box>
                  <Heading size="md">{member.name}</Heading>
                  <Text color={'gray.600'}>{member.roles.join('・')}</Text>
                </Box>
              </Flex>
            </CardHeader>
            {member.profile !== undefined && (
              <CardBody py={1}>
                <Text>{member.profile}</Text>
              </CardBody>
            )}
            <CardFooter pt={3} gap={2}>
              <Link href={`https://twitter.com/${member.twitter}`}>
                <Button
                  colorScheme="twitter"
                  leftIcon={<FaTwitter />}
                  size={'sm'}
                >
                  Twitter
                </Button>
              </Link>
              {member.youtube !== undefined && (
                <Link href={`https://www.youtube.com/${member.youtube}`}>
                  <Button
                    colorScheme="red"
                    leftIcon={<FaYoutube />}
                    size={'sm'}
                  >
                    YouTube
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        ))}
      </Stack>
      <Heading mt={7} fontSize={'xl'}>
        運営に協力したい方へ
      </Heading>
      <Text>
        現在、運営ではカードの登録・評価、デッキの制作・解説、サイトのデザイン・開発を行っております。サイトの開発には、FirebaseとNext.jsを利用しております。ずとまよファンで協力してくださる方は、本Wikiサイトの管理人のDMにご連絡頂ければ幸いです。
      </Text>
      <Link href={`https://twitter.com/zutomayo_ryuji`}>
        <Button
          colorScheme="twitter"
          leftIcon={<FaTwitter />}
          size={'sm'}
          mt={3}
        >
          管理人のTwitter
        </Button>
      </Link>
      <Box pt={7} />
    </DefaultLayout>
  )
}

export default Page

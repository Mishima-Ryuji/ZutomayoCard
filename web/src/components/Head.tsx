import NextHead from 'next/head'
import { useRouter } from 'next/router'

const TWITTER_USER_NAME = '@zutoca_wiki'
const DISPLAY_APP_NAME = 'ズトカWiki'

export type HeadProps = {
  type?: 'website' | 'article'
  title?: string
  description?: string
  keyword?: string
  keywords?: string[]
  image?: string
  path?: string
  index?: boolean
}

export const Head = ({
  type = 'website',
  title = 'ずとまよカードをもっと楽しく',
  description = '本サイトでは、「ずとまよカードをもっと楽しく」をコンセプトに、カードの検索やデッキの構築、トレード相手の検索をする機能を提供しております。各カードのページでは、対戦ガチ勢からの評価や動画解説を用意しており、初心者でも簡単に対戦を始めるための知識を身につけることができます。',
  keyword,
  image,
  keywords = [
    'ずとまよカード',
    'ズトカ',
    'Wiki',
    'ずっと真夜中でいいのに。',
    'ずとまよ',
  ],
  path,
  index = true,
}: HeadProps) => {
  const router = useRouter()
  const host = 'https://zutomayo-card.com/'

  const strPath = path ?? router.asPath
  const url = host + strPath

  if (keyword !== undefined) keywords = [keyword, ...keywords]

  const ogpTitle = title
  title += ' | ' + DISPLAY_APP_NAME

  if (image === undefined) {
    image = host + '/logo.jpg'
  } else if (image.startsWith('/')) {
    image = host + image
  }

  return (
    <NextHead>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta charSet="utf-8" />
      <meta name="keywords" content={keywords.join(', ')} />

      {!index && <meta name="robots" content="noindex,nofollow" />}
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1.0,maximum-scale=1.0"
      />
      <link rel="canonical" href={url} />

      <link rel="shortcut icon" href={host + '/favicon.ico'} />
      <link rel="apple-touch-icon" href={host + '/logo.png'} />

      {/* OGP */}
      <meta property="og:title" content={ogpTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={DISPLAY_APP_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content={TWITTER_USER_NAME} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </NextHead>
  )
}

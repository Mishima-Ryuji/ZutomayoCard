import { Button, Flex, Heading, Spacer, Spinner } from '@chakra-ui/react'
import { NextPage } from 'next'
import { default as NextLink } from 'next/link'
import { DefaultLayout } from '~/components/Layout'
import { UniguriBalloonListItem } from '~/components/uniguri-balloon/page/ListItem'
import { useListUniguriBalloons } from '~/hooks/uniguri-balloon/useListUniguriBalloons'

interface Props {
}
const ListUniguriBalloonPage: NextPage<Props> = ({ }) => {
  const uniguriBalloons = useListUniguriBalloons()
  return (
    <DefaultLayout
      head={{
        title: 'うにぐりの一言',
      }}
    >
      <Flex my={3}>
        <Heading>
          うにぐりの一言
        </Heading>
        <Spacer />
        <Button colorScheme="purple" size="sm" as={NextLink} href="/admin/uniguri-balloon/new">
          新規作成
        </Button>
      </Flex>

      {uniguriBalloons.data?.map(uniguriBalloon =>
        <UniguriBalloonListItem
          key={uniguriBalloon.id}
          uniguriBalloon={uniguriBalloon}
        />
      )
        ?? <Spinner />
      }

    </DefaultLayout>
  )
}
export default ListUniguriBalloonPage

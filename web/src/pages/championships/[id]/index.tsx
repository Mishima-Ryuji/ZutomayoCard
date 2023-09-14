import { Box } from '@chakra-ui/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { ChampionshipEyecatch } from '~/components/championship/Eyecatch'
import { championshipRef } from '~/shared/firebase/firestore/scheme/championship'

interface Props {
}
const ChampionshipDetailPage: NextPage<Props> = () => {
  const router = useRouter()
  const championshipId = router.query.id as string
  const [championship] = useDocumentDataOnce(championshipRef(championshipId))
  return (
    <DefaultLayout head={{}}>
      {championship &&
        <Box px={["0", "12"]} py="12" w="full">
          <ChampionshipEyecatch
            name={championship.name}
            hostName={championship.host_name}
            holdAt={championship.hold_at}
            color={championship.color}
          />
        </Box>
      }
    </DefaultLayout>
  )
}
export default ChampionshipDetailPage

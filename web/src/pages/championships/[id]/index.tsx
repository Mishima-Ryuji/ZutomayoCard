import { Box } from '@chakra-ui/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { ChampionshipEyecatch } from '~/components/championship/Eyecatch'
import { ChampionshipInfo } from '~/components/championship/detail/ChampionshipInfo'
import { useAuthState } from '~/hooks/useAuthState'
import { championshipRef } from '~/shared/firebase/firestore/scheme/championship'

interface Props {
}
const ChampionshipDetailPage: NextPage<Props> = () => {
  const router = useRouter()
  const championshipId = router.query.id
  const [championship] = useDocumentData(
    typeof championshipId === "string"
      ? championshipRef(championshipId)
      : null
  )
  const { user } = useAuthState()
  const isHost = user?.uid === championship?.host_uid
  return (
    <DefaultLayout head={{}}>
        <Box px={["0", "12"]} py="12" w="full">
        <Skeleton isLoaded={!!championship}>
          <ChampionshipEyecatch
            name={championship?.name ?? "..."}
            hostName={championship?.host_name ?? "..."}
            holdAt={championship?.hold_at ?? Timestamp.fromMillis(0)}
            color={championship?.color ?? "green"}
          />
        </Skeleton>
        </Box>

    </DefaultLayout>
  )
}
export default ChampionshipDetailPage

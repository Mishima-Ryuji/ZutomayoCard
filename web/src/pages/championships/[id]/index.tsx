import { Box, Card, Grid, GridItem, Skeleton, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { Timestamp } from 'firebase/firestore'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { ChampionshipEyecatch } from '~/components/championship/Eyecatch'
import { ChampionshipInfo } from '~/components/championship/detail/ChampionshipInfo'
import { ChampionshipEditForm } from '~/components/championship/detail/Edit'
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

      <Tabs variant="soft-rounded" colorScheme={championship?.color} align="center">
        <TabList my="6">
          <Tab>
            大会情報
          </Tab>
          {!championship
            ? <></>
            : isHost
              ? <Tab>
                編集
              </Tab>
              : <Tab>
                応募
              </Tab>
          }
        </TabList>
        <Grid templateColumns={{ base: "100%", md: "1fr auto" }} gap="8">
          <GridItem>
            <Card>
              <TabPanels textAlign="start">
                <TabPanel>
                  {championship
                    ? <ChampionshipInfo
                      championship={championship}
                    />
                    : <Skeleton height="20em" />
                  }
                </TabPanel>
                {isHost
                  ? <TabPanel>
                    {championship
                      ? <ChampionshipEditForm
                        defaultValue={championship}
                      />
                      : <Spinner />
                    }
                  </TabPanel>
                  : <TabPanel>
                    応募たぶ
                  </TabPanel>
                }
                <TabPanel>
                </TabPanel>
              </TabPanels>
            </Card>
          </GridItem>
          <GridItem>
            サイドバーサイドバーサイドバー
          </GridItem>
        </Grid>
      </Tabs>

    </DefaultLayout>
  )
}
export default ChampionshipDetailPage

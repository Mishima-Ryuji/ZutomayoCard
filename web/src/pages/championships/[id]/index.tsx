import { Box, Card, CardBody, Link as ChakraLink, Grid, GridItem, Heading, List, ListItem, Skeleton, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import { Timestamp } from 'firebase/firestore'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import NextLink from "next/link"
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { ChampionshipEyecatch } from '~/components/championship/Eyecatch'
import { ChampionshipSideMenu } from '~/components/championship/SideMenu'
import { ChampionshipInfo } from '~/components/championship/detail/ChampionshipInfo'
import { ChampionshipEditForm } from '~/components/championship/detail/Edit'
import { JoinChampionshipForm } from '~/components/championship/detail/Join'
import { getDoc, getDocs } from '~/firebase'
import { useAuthState } from '~/hooks/useAuthState'
import { Championship, championshipConverter, championshipRef, championshipsRef } from '~/shared/firebase/firestore/scheme/championship'
import { Participant, participantsRef } from '~/shared/firebase/firestore/scheme/championship/participant'
import { Serialized, deserialize, serialize } from '~/shared/utils'

export const getStaticPaths: GetStaticPaths = async () => {
  const championships = await getDocs(championshipsRef)
  return {
    paths: championships.docs.map(doc => `/championships/${doc.id}`),
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const id = ctx.params?.id
  if (typeof id !== "string") {
    return {
      notFound: true,
    }
  }
  const snapshot = await getDoc(championshipRef(id))
  const championship = snapshot.data()
  if (!championship) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      championship: serialize(championship),
    },
  }
}

interface Props {
  championship: Serialized<Championship>
}
const ChampionshipDetailPage: NextPage<Props> = ({
  championship: staticChampionship
}) => {
  const router = useRouter()
  const championshipId = router.query.id
  const [championship] = useDocumentData(
    typeof championshipId === "string"
      ? championshipRef(championshipId)
      : null,
    { initialValue: deserialize(staticChampionship, { ref: championshipConverter }) },
  )
  const { user } = useAuthState()
  const isHost = user?.uid === championship?.host_uid

  const [participants] = useCollectionData(championship !== undefined
    ? participantsRef(championship.id)
    : null
  )

  const [tab, setTab] = useState(0)
  useEffect(() => {
    const tab = router.query.tab
    if (tab === "join") {
      setTab(1)
    }
  }, [router.query.tab])
  return (
    <DefaultLayout head={{}}>
      <Box px={["0", "12"]} py="12" w="full">
        <ChampionshipEyecatch
          isLoading={!championship}
          name={championship?.name ?? "..."}
          hostName={championship?.host_name ?? "..."}
          holdAt={championship?.hold_at ?? Timestamp.fromMillis(0)}
          color={championship?.color ?? "green"}
        />
      </Box>

      <Tabs
        variant="soft-rounded"
        colorScheme={championship?.color ?? "gray"}
        align="center"
        index={tab}
        onChange={setTab}
      >
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
        <Grid templateColumns={{ base: "100%", md: "1fr auto" }} gap="8" textAlign="start">
          <GridItem>
            <Card>
              <TabPanels>
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
                    {championship
                      ? <JoinChampionshipForm
                        championship={championship}
                      />
                      : <Spinner />
                    }
                  </TabPanel>
                }
                <TabPanel>
                </TabPanel>
              </TabPanels>
            </Card>
          </GridItem>
          <GridItem maxW="250px">
            {championship && participants &&
              <SideBar
                championship={championship}
                participants={participants}
              />
            }
          </GridItem>
        </Grid>
      </Tabs>

    </DefaultLayout>
  )
}
export default ChampionshipDetailPage

interface SideBarProps {
  championship: Championship
  participants: Participant[]
}
const SideBar: FC<SideBarProps> = ({ championship, participants }) => {
  return (
    <>
      <ChampionshipSideMenu />
      <Card my="8">
        <CardBody>
          <Heading size="md">
            主催者
          </Heading>
          <Text my="2">
            {championship.host_name}
          </Text>
          <Text color="gray.500">
            {championship.host_contact}
          </Text>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <Heading size="md">
            参加者
          </Heading>
          <List>
            {participants.map(participant =>
              <ListItem key={participant.id}>
                <Text>
                  {participant.name}
                </Text>
                <Text color="gray.500" pl="4">
                  {participant.contact}
                </Text>
              </ListItem>
            )}
            {participants.length === 0 &&
              <ListItem>
                まだ参加者がいません。
                <ChakraLink
                  as={NextLink}
                  href={`/championships/${championship.id}?tab=join`}
                  color={championship.color}
                >
                  応募する
                </ChakraLink>
                。
              </ListItem>
            }
          </List>
        </CardBody>
      </Card>
    </>
  )
}

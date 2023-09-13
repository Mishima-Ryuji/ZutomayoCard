import { Alert, AlertIcon, AlertTitle, Box, Button, Card, CardBody, CardHeader, Link as ChakraLink, Divider, Grid, GridItem, Heading, List, ListItem, Spinner, VStack, useBreakpointValue, useDisclosure } from '@chakra-ui/react'
import { FirebaseError } from 'firebase/app'
import { documentId, query, where } from 'firebase/firestore'
import { NextPage } from 'next'
import NextLink from "next/link"
import { FC } from 'react'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { ChampionshipList } from '~/components/championship/List'
import { useAuthState } from '~/hooks/useAuthState'
import { joinedChampionshipRefs, participantToChampionshipRef } from '~/models/championship'
import { Championship, championshipsRef } from '~/shared/firebase/firestore/scheme/championship'

interface Props {
}
const ChampionshipsListPage: NextPage<Props> = () => {
  const [championships] = useCollectionDataOnce(championshipsRef)
  const joinedChampionships = useJoinedChampionships()
  return (
    <DefaultLayout head={{ title: "大会ダッシュボード" }}>
      <Heading mt="20" mb="12" size={["lg", "xl"]}>
        大会ダッシュボード
      </Heading>
      {joinedChampionships.isLoading
        ? <Spinner />
        : <SummarySection
          championships={championships}
          joinedChampionships={joinedChampionships.data}
        />
      }
      {joinedChampionships.errors.length !== 0 &&
        <Alert status='error'>
          <AlertIcon />
          <AlertTitle>
            ダッシュボードが読み込めませんでした。
          </AlertTitle>
        </Alert>
      }
      <Divider my="16" />
      <Grid templateColumns={["repeat(1fr, 2)", "repeat(1fr, 2)", "1fr 200px"]} gap="6">
        <GridItem>
          <Heading mb="3" size="lg">
            開催中の大会
          </Heading>
          <ChampionshipList
            championships={championships}
          />
        </GridItem>
        <GridItem py="3">
          <SideBar />
        </GridItem>
      </Grid>
    </DefaultLayout >
  )
}
export default ChampionshipsListPage

export const useJoinedChampionships = () => {
  const { user } = useAuthState()
  const [joinedChampionshipParticipants, , participantsError] = useCollectionDataOnce(user ? joinedChampionshipRefs(user.uid) : null)
  const joinedChampionshipIds = joinedChampionshipParticipants?.map(participant => participantToChampionshipRef(participant).id)
  const [joinedChampionships, , championshipError] = useCollectionDataOnce(
    joinedChampionshipIds
      ? query(
        championshipsRef,
        where(documentId(), "in", joinedChampionshipIds)
      )
      : null
  )

  const errors: FirebaseError[] = []
  if (participantsError) errors.push(participantsError)
  if (championshipError) errors.push(championshipError)
  return {
    data: joinedChampionships,
    isLoading: !joinedChampionships,
    errors,
  }
}


interface SummarySectionProps {
  championships: Championship[] | undefined
  joinedChampionships: Championship[] | undefined
}
const SummarySection: FC<SummarySectionProps> = ({ championships, joinedChampionships }) => {
  const isSp = useBreakpointValue([true, true, false])
  const { isOpen, onToggle } = useDisclosure()
  if (!championships || !joinedChampionships) return
  if (joinedChampionships.length === 0) {
    return (
      <Card variant="filled" align="center" textAlign="center" mx={["4", "6"]}>
        <CardHeader>
          <Heading size="md">
            大会に参加していません
          </Heading>
        </CardHeader>
        <CardBody>
          大会に応募してみましょう。 <br />
          参加している大会があるとここに表示されます。
        </CardBody>
      </Card>
    )
  }
  return (
    <Card variant="filled">
      <CardHeader>
        <Heading size="md" id="ongoing">
          参加中の大会
        </Heading>
      </CardHeader>
      {isSp === true
        ? <>
          <ChampionshipList
            championships={isOpen ? joinedChampionships : [joinedChampionships[0]]}
            withSearchBar={false}
            variant="simple"
          />
          {joinedChampionships.length >= 2 &&
            <Box p="4">
              <Button onClick={onToggle}>
                {isOpen ? "非表示" : "もっと表示"}
              </Button>
            </Box>
          }
        </>
        : <ChampionshipList
          championships={joinedChampionships}
          withSearchBar={false}
          variant="simple"
        />
      }
    </Card>
  )
}

const SideBar: FC = () => {
  return (
    <VStack alignItems="flex-start">
      <List>
        <ListItem>
          <ChakraLink as={NextLink} href="/championships">
            ▶︎ ダッシュボード
          </ChakraLink>
        </ListItem>
        <ListItem>
          <ChakraLink as={NextLink} href="/championships#ongoing">
            ▶︎ 開催中の大会
          </ChakraLink>
        </ListItem>
        <Divider my="3" />
        <ListItem>
          <ChakraLink as={NextLink} href="/championships/new">
            ▶︎ 大会の登録
          </ChakraLink>
        </ListItem>
      </List >
    </VStack >
  )
}

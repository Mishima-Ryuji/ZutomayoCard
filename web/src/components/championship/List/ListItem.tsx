import { Badge, Button, Card, CardFooter, CardHeader, HStack, Heading } from "@chakra-ui/react"
import NextLink from "next/link"
import { FC } from "react"
import { DateView } from "~/components/DateView"
import { Championship } from "~/shared/firebase/firestore/scheme/championship"

interface ChampionshipListItemProps {
  championship: Championship
  userId?: string | undefined
}
export const ChampionshipListItem: FC<ChampionshipListItemProps> = ({ championship, userId }) => {
  const name = championship.name.length >= 40 ? championship.name.substring(0, 40) + "..." : championship.name
  return (
    <Card key={championship.id} variant="elevated">
      <CardHeader pb="0">
        <HStack wrap="wrap" spacing="1">
          <Badge colorScheme="gray" fontSize="xs">
            <DateView
              type="date"
              date={championship.hold_at.toDate()}
            />
            {" "}開催
          </Badge>
        </HStack>
        <Heading my="2" fontSize={["lg", "2xl"]}>
          {name}
        </Heading>
      </CardHeader>
      <CardFooter as={HStack} spacing="1" flexWrap="wrap">
        <Button
          as={NextLink}
          href={`/championships/${championship.id}`}
          colorScheme={championship.color}
          leftIcon={<>👀</>}
        >
          詳細
        </Button>
        {userId !== championship.host_uid &&
          <Button
            as={NextLink}
            href={`/championships/${championship.id}/join`}
            variant="outline"
            colorScheme={championship.color}
            leftIcon={<>✋</>}
          >
            応募
          </Button>
        }
      </CardFooter>
    </Card>
  )
}

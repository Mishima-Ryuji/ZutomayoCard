import { Card, Grid, GridItem, Spinner } from "@chakra-ui/react"
import { FC } from "react"
import { Championship } from "~/shared/firebase/firestore/scheme/championship"
import { ChampionshipListItem } from "./ListItem"

interface ChampionshipListProps {
  variant?: "card" | "simple"
  championships: Championship[] | undefined
  userId?: string | undefined
  withSearchBar?: boolean
  searchPlaceholder?: string
}
export const ChampionshipList: FC<ChampionshipListProps> = ({ variant = "card", championships, userId }) => {
  const content = <>
    <Grid
      templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }}
      gap="6"
      px={["2", "6"]}
      py={["4", "8"]}
    >
      {championships?.map(championship =>
        <GridItem key={championship.id}>
          <ChampionshipListItem
            championship={championship}
            userId={userId}
          />
        </GridItem>
      ) ?? <Spinner />}
    </Grid>
  </>
  if (variant === "card") {
    return (
      <Card variant="filled">
        {content}
      </Card>
    )
  }
  return (
    content
  )
}

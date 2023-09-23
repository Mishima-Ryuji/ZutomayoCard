import { Card, Grid, GridItem, Icon, Input, InputGroup, InputLeftElement, Spinner } from "@chakra-ui/react"
import { FC } from "react"
import { FaSearch } from "react-icons/fa"
import { Championship } from "~/shared/firebase/firestore/scheme/championship"
import { ChampionshipListItem } from "./ListItem"

interface ChampionshipListProps {
  variant?: "card" | "simple"
  championships: Championship[] | undefined
  userId?: string | undefined
  withSearchBar?: boolean
  searchPlaceholder?: string
}
export const ChampionshipList: FC<ChampionshipListProps> = ({ variant = "card", championships, withSearchBar = true, searchPlaceholder = "大会を検索", userId }) => {
  const content = <>
    {withSearchBar &&
      <InputGroup bg="Background" size="lg">
        <InputLeftElement pointerEvents='none'>
          <Icon as={FaSearch} />
        </InputLeftElement>
        <Input
          variant="outline"
          roundedBottom="none"
          placeholder={searchPlaceholder}
        />
      </InputGroup>
    }
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

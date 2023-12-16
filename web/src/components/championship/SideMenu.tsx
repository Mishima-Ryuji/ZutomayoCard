import { Link as ChakraLink, Divider, List, ListItem, VStack } from "@chakra-ui/react"
import NextLink from "next/link"
import { FC, ReactNode } from "react"

export interface ChampionshipSideBarProps {
  children?: ReactNode
}
export const ChampionshipSideMenu: FC<ChampionshipSideBarProps> = ({ children }) => {
  return (
    <VStack alignItems="flex-start">
      <List>
        <ChampionshipSideBarItem href="/championships">
          ダッシュボード
        </ChampionshipSideBarItem>
        <ChampionshipSideBarItem href="/championships#ongoing">
          開催中の大会
        </ChampionshipSideBarItem>
        <ChampionshipSideBarDivider />
        <ChampionshipSideBarItem href="/championships/new">
          大会の登録
        </ChampionshipSideBarItem>
        {children !== undefined && <ChampionshipSideBarDivider />}
        {children}
      </List >
    </VStack >
  )
}

interface ChampionshipSideMenuItemProps {
  href: string
  children: ReactNode
}
export const ChampionshipSideBarItem: FC<ChampionshipSideMenuItemProps> = ({ href, children }) => {
  return (
    <ListItem>
      <ChakraLink as={NextLink} href={href}>
        ▶︎ {children}
      </ChakraLink>
    </ListItem>
  )
}

export const ChampionshipSideBarDivider: FC = () => {
  return (
    <Divider my="3" />
  )
}

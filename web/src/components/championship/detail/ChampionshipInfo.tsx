import { Box, Table, TableContainer, Tbody, Td, Text, Th, Tr } from "@chakra-ui/react"
import { FC } from "react"
import { DateView } from "~/components/DateView"
import { Championship } from "~/shared/firebase/firestore/scheme/championship"

interface ChampionshipInfoProps {
  championship: Championship
}
export const ChampionshipInfo: FC<ChampionshipInfoProps> = ({ championship }) => {
  return (
    <Box w="full">
      <TableContainer w="full" overflowX="auto">
        <Table size={["sm", "md"]}>
          <Tbody>
            <Tr>
              <Th>開催場所</Th>
              <Td>{championship.place}</Td>
            </Tr>
            <Tr>
              <Th>開催時間</Th>
              <Td>
                <DateView
                  date={championship.hold_at.toDate()}
                />
              </Td>
            </Tr>
            <Tr>
              <Th>応募締切</Th>
              <Td>
                <DateView
                  date={championship.time_limit_at.toDate()}
                />
              </Td>
            </Tr>
            <Tr>
              <Th>大会の形式</Th>
              <Td>{championship.format}</Td>
            </Tr>
            <Tr>
              <Th>参加費</Th>
              <Td>{championship.entry_fee}</Td>
            </Tr>
            <Tr>
              <Th>持ち物</Th>
              <Td>{championship.need_items}</Td>
            </Tr>
            <Tr>
              <Th>その他</Th>
              <Td>{championship.detail}</Td>
            </Tr>
            <Tr>
              <Th>主催者</Th>
              <Td>
                {championship.host_name}
                <Text color="gray.500" fontSize="sm">
                  ({championship.host_contact})
                </Text>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}

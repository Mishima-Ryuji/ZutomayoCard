import { Box } from "@chakra-ui/react"
import { FC } from "react"
import { useReward } from "react-rewards"
import { sleep } from "~/shared/utils"

const ids = {
  left: "celebration-left",
  center: "celebration-center",
  right: "celebration-right",
}

export const Celebration: FC = () => {
  return (
    <>
      <Box
        id={ids.left}
        position="fixed"
        left="0"
        bottom="10vh"
        h="0"
      />
      <Box
        id={ids.center}
        position="fixed"
        left="50vw"
        bottom={`50vh`}
        h="0"
      />
      <Box
        id={ids.right}
        position="fixed"
        right="0"
        bottom="10vh"
        h="0"
      />
    </>
  )
}

export const useCelebration = () => {
  const left = useReward(ids.left, "confetti", {
    zIndex: 9999,
    spread: 100,
    angle: 70,
    elementCount: 100,
  })
  const center = useReward(ids.center, "confetti", {
    zIndex: 9999,
    spread: 100,
    angle: 90,
    elementCount: 200,
  })
  const right = useReward(ids.right, "confetti", {
    zIndex: 9999,
    spread: 100,
    angle: 110,
    elementCount: 100,
  })
  const celebrate = async () => {
    left.reward()
    await sleep(250)
    right.reward()
    await sleep(250)
    center.reward()
  }
  return {
    celebrate,
  }
}

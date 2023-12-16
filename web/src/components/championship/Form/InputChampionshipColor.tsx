import { Box, ButtonProps, Divider, HStack, chakra, useFormControlContext } from "@chakra-ui/react"
import { FC } from "react"
import { ChampionshipColor, championshipColors } from "~/shared/firebase/firestore/scheme/championship"

interface InputChampionshipColorProps {
  color: ChampionshipColor
  onChangeColor: (color: ChampionshipColor) => void
}
export const InputChampionshipColor: FC<InputChampionshipColorProps> = ({ color: currentColor, onChangeColor }) => {
  const control = useFormControlContext()
  return (
    <Box p={[4]} bg="gray.100" w="fit-content" maxW="full" rounded="md" opacity={control.isDisabled ? 0.5 : 1}>
      <HStack justifyContent="flex-start">
        <ColorCircle
          color={currentColor}
          size="50px"
          selected
        />
        <Box ml="2">
          選択中の色
        </Box>
      </HStack>
      <Divider my="2" />
      <HStack flexWrap="wrap" justifyContent="flex-start">
        {championshipColors.map(color =>
          <ColorCircle
            key={color}
            color={color}
            size={["30px", "40px"]}
            selected={currentColor === color}
            onClick={() => onChangeColor(color)}
            isDisabled={control.isDisabled}
          />
        )}
      </HStack>
    </Box>
  )
}

type ColorCircleProps = ButtonProps & {
  color: ChampionshipColor
  size?: ButtonProps["width"]
  selected?: boolean
  isDisabled?: boolean
}
const ColorCircle: FC<ColorCircleProps> = ({ color, size = "50px", selected = false, isDisabled = false, ...buttonProps }) => {
  return (
    <chakra.button
      width={size}
      height={size}
      bgColor={`${color}.400`}
      transition="border 0.2s"
      border={`solid ${selected ? 2 : 0}px`}
      borderColor={selected ? `${color}.200` : "transparent"}
      borderRadius="100%"
      {...buttonProps}
      onClick={isDisabled ? () => {/* 何もしない */ } : buttonProps.onClick}
    />
  )
}

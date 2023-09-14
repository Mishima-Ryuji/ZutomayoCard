import { ChampionshipColor } from "~/shared/firebase/firestore/scheme/championship"

const gradientMap: Record<ChampionshipColor, string> = {
  green: "linear-gradient(90deg, #28CD92 0%, #14B58E 100%)",
  purple: "linear-gradient(90deg, #8924C8 0%, #610A97 100%)",
  red: "linear-gradient(90deg, #E34A4A 0%, #AC0505 100%)",
  blue: "linear-gradient(90deg, #2939CA 0%, #051390 100%)",
  yellow: "linear-gradient(90deg, #D9D115 0%, #BCAA09 100%)",
}

export const getGradient = (color: ChampionshipColor) => gradientMap[color]

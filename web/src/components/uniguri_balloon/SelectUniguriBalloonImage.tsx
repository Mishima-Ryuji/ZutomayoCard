import { Box, Flex } from "@chakra-ui/react"
import Image from "next/image"
import { FC } from "react"

const presets = [
  "https://firebasestorage.googleapis.com/v0/b/zutomayo-33d04.appspot.com/o/uniguri_balloons%2F300x300%2F%E3%83%8E%E3%83%BC%E3%83%9E%E3%83%AB%E3%81%86%E3%81%AB%E3%81%8F%E3%82%99%E3%82%8A_300x300.png?alt=media&token=c1f77e41-0c10-4cb0-9d8e-81c7fddcc76d",
  "https://firebasestorage.googleapis.com/v0/b/zutomayo-33d04.appspot.com/o/uniguri_balloons%2F300x300%2F%E3%81%8A%E8%8C%B6%E3%82%92%E9%A3%B2%E3%82%80%E3%81%86%E3%81%AB%E3%81%8F%E3%82%99%E3%82%8A_300x300.png?alt=media&token=c0a4c6e2-462c-4e51-8653-9fd4160f7ebf",
  "https://firebasestorage.googleapis.com/v0/b/zutomayo-33d04.appspot.com/o/uniguri_balloons%2F300x300%2F%E3%83%95%E3%82%99%E3%83%81%E3%82%AD%E3%82%99%E3%83%AC%E3%81%86%E3%81%AB%E3%81%8F%E3%82%99%E3%82%8A_300x300.png?alt=media&token=825e79a0-7bd0-435f-8cc3-64d90ecf2c16",
  "https://firebasestorage.googleapis.com/v0/b/zutomayo-33d04.appspot.com/o/uniguri_balloons%2F300x300%2F%E3%83%AF%E3%82%A4%E3%83%AF%E3%82%A4%E3%81%86%E3%81%AB%E3%81%8F%E3%82%99%E3%82%8A_300x300.png?alt=media&token=bb52522a-e2cf-4063-8a84-175cdd346bd9",
  "https://firebasestorage.googleapis.com/v0/b/zutomayo-33d04.appspot.com/o/uniguri_balloons%2F300x300%2F%E5%86%B7%E3%82%84%E6%B1%97%E3%81%86%E3%81%AB%E3%81%8F%E3%82%99%E3%82%8A_300x300.png?alt=media&token=1dbd9e09-4374-4c11-853d-7e1f9adc1888",
  "https://firebasestorage.googleapis.com/v0/b/zutomayo-33d04.appspot.com/o/uniguri_balloons%2F300x300%2F%E5%8F%B3%E4%B8%8A%E3%82%92%E8%A6%8B%E3%82%8B%E3%81%86%E3%81%AB%E3%81%8F%E3%82%99%E3%82%8A_300x300.png?alt=media&token=4f1ec057-4749-4ee9-9089-e85f25f3a119",
  "https://firebasestorage.googleapis.com/v0/b/zutomayo-33d04.appspot.com/o/uniguri_balloons%2F300x300%2F%E5%B7%A6%E4%B8%8A%E3%82%92%E8%A6%8B%E3%82%8B%E3%81%86%E3%81%AB%E3%81%8F%E3%82%99%E3%82%8A_300x300.png?alt=media&token=0518d73e-13c4-498e-8d43-b7daef6b5ae5",
  "https://firebasestorage.googleapis.com/v0/b/zutomayo-33d04.appspot.com/o/uniguri_balloons%2F300x300%2F%E6%B3%A3%E3%81%84%E3%81%A6%E3%81%84%E3%82%8B%E3%81%86%E3%81%AB%E3%81%8F%E3%82%99%E3%82%8A_300x300.png?alt=media&token=fa8f7eb8-b71b-4674-b26c-4c9b2fdce9e4",
  "https://firebasestorage.googleapis.com/v0/b/zutomayo-33d04.appspot.com/o/uniguri_balloons%2F300x300%2F%E6%BA%96%E5%82%99%E4%B8%AD%E3%81%86%E3%81%AB%E3%81%8F%E3%82%99%E3%82%8A%EF%BC%88%E4%B8%8D%E5%9C%A8%EF%BC%89_300x300.png?alt=media&token=e5a00499-8ef0-4662-8765-7d01cacb3bb8",
  "https://firebasestorage.googleapis.com/v0/b/zutomayo-33d04.appspot.com/o/uniguri_balloons%2F300x300%2F%E7%9B%AE%E3%82%92%E8%BC%9D%E3%81%8B%E3%81%99%E3%81%86%E3%81%AB%E3%81%8F%E3%82%99%E3%82%8A_300x300.png?alt=media&token=8bb026d8-6158-457c-9215-1cf736d2661d",
  "https://firebasestorage.googleapis.com/v0/b/zutomayo-33d04.appspot.com/o/uniguri_balloons%2F300x300%2F%E7%A9%8F%E3%82%84%E3%81%8B%E3%81%86%E3%81%AB%E3%81%8F%E3%82%99%E3%82%8A_300x300.png?alt=media&token=b64caa43-73e7-40c8-a3f6-96969cb92709",
  "https://firebasestorage.googleapis.com/v0/b/zutomayo-33d04.appspot.com/o/uniguri_balloons%2F300x300%2F%E8%80%83%E3%81%88%E3%81%A6%E3%82%8B%E3%81%86%E3%81%AB%E3%81%8F%E3%82%99%E3%82%8A_300x300.png?alt=media&token=85b1ca95-c168-4687-a047-b207fbb94f08",
  "https://firebasestorage.googleapis.com/v0/b/zutomayo-33d04.appspot.com/o/uniguri_balloons%2F300x300%2F%E9%A9%9A%E3%81%8F%E3%81%86%E3%81%AB%E3%81%8F%E3%82%99%E3%82%8A_300x300.png?alt=media&token=a754cac9-8454-426a-bc2f-43bc74905144",
]

interface SelectUniguriBalloonImageProps {
  selectedImage: string | null
  onClickImage: (image: string) => void
}
export const SelectUniguriBalloonImage: FC<SelectUniguriBalloonImageProps> = ({ selectedImage, onClickImage }) => {
  return (
    <Box>
      以下から選択
      <Flex rowGap={1} w="full" overflowX="auto" p={4} bgColor="gray.100">
        {presets.map(image =>
          <Box
            key={image}
            flexShrink={0}
            flexGrow={0}
            border={selectedImage === image ? "dashed 2px" : "none"}
            borderColor="blue.300"
          >
            <Image
              src={image}
              alt=""
              width={100}
              height={100}
              onClick={() => onClickImage(image)}
            />
          </Box>
        )}
      </Flex>
    </Box>
  )
}

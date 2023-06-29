import Image from 'next/image'
import { CardElement } from '~/firebase'

type Props = {
  element: CardElement
  size: number
}

export const CardElementImage = ({ element, size }: Props) => {
  return (
    <Image
      src={`/elements/${element}.png`}
      alt={element}
      width={size}
      height={size}
    />
  )
}

import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import { useEffect } from 'react'
import { fb } from '~/firebase'
import '~/styles/global.scss'

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    fb.analytics // Google Analyticsを読み込み
  }, [])
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp

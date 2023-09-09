import { Flex, Heading } from '@chakra-ui/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { DefaultLayout } from '~/components/Layout'
import { UniguriBalloonForm, UniguriBalloonInput } from '~/components/uniguri_balloon/Form'
import { maxTimestamp, minTimestamp } from '~/firebase'
import { useAddUniguriBalloon } from '~/hooks/uniguri_balloon/useAddUniguriBalloon'

const defaultInput: UniguriBalloonInput = {
  message: "",
  image_url: "https://firebasestorage.googleapis.com/v0/b/zutomayo-33d04.appspot.com/o/uniguri_balloons%2F300x300%2F%E3%83%8E%E3%83%BC%E3%83%9E%E3%83%AB%E3%81%86%E3%81%AB%E3%81%8F%E3%82%99%E3%82%8A_300x300.png?alt=media&token=c1f77e41-0c10-4cb0-9d8e-81c7fddcc76d",
  enable: false,
  start_at: minTimestamp,
  end_at: maxTimestamp,
  // TODO:表示期間設定機能が実装されたらデフォルト値を適切に変更する
  // start_at: set(Timestamp.now(), { hour: 0, minute: 0, second: 0, milliSeccond: 0 }),
  // end_at: set(after(Timestamp.now(), { day: 1 }), { hour: 0, minute: 0, second: 0, milliSeccond: 0 }),
  button: null,
}

const NewUniguriBalloonPage: NextPage = () => {
  const router = useRouter()
  const { isAddding, onAdd } = useAddUniguriBalloon({
    onAdd: async () => {
      await router.push(`/admin/uniguri-balloon`)
    },
  })

  return (
    <DefaultLayout
      head={{
        title: 'うにぐりの一言/追加',
      }}
    >
      <Flex my={3} flexDir="column">
        <Heading>
          うにぐりの一言 / 追加
        </Heading>
        <UniguriBalloonForm
          defaultValue={defaultInput}
          isSubmitting={isAddding}
          onSubmit={onAdd}
        />
      </Flex>
    </DefaultLayout>
  )
}
export default NewUniguriBalloonPage

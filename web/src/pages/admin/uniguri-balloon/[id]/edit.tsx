import { Heading, Spinner } from '@chakra-ui/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { DefaultLayout } from '~/components/Layout'
import { UniguriBalloonForm } from '~/components/uniguri_balloon/Form'
import { DeleteButton } from '~/components/uniguri_balloon/page/edit/DeleteButton'
import { useDeleteUniguriBalloons } from '~/hooks/uniguri-balloon/useDeleteUniguriBalloons'
import { useUpdateUniguriBalloon } from '~/hooks/uniguri-balloon/useUpdateUniguriBalloon'
import { uniguriBalloonRef } from '~/shared/firebase/firestore/scheme/uniguriBalloon'

const EditUniguriBalloonPage: NextPage = () => {
  const router = useRouter()
  const uniguriBalloonId = router.query.id

  const [uniguriBalloon,] = useDocumentDataOnce(
    typeof uniguriBalloonId === "string" ? uniguriBalloonRef(uniguriBalloonId) : null,
  )

  const { onUpdate, isUpdating } = useUpdateUniguriBalloon()

  const { isDeleting, onDelete } = useDeleteUniguriBalloons({
    onDelete: () => {
      // 削除したページにCmd+Shift+Zさせないためにreplace
      void router.replace(`/admin/uniguri-balloon`)
    },
  })

  return (
    <DefaultLayout head={{
      title: `${uniguriBalloon?.message ?? "うにぐりの一言"} の編集`,
    }}>
      <Heading my={3}>
        {(uniguriBalloon?.message) != null
          ? uniguriBalloon.message.substring(0, 12) + "..."
          : <Spinner />} の編集
      </Heading>

      {uniguriBalloon &&
        <DeleteButton
          dialogMessage={`本当に「${uniguriBalloon.message}」を削除してもいいですか？`}
          onDelete={() => onDelete(uniguriBalloon.ref)}
          isDeleting={isDeleting}
        />
      }

      {uniguriBalloon
        ? <UniguriBalloonForm
          defaultValue={uniguriBalloon}
          onSubmit={(input) => onUpdate(uniguriBalloon.ref, input)}
          isSubmitting={isUpdating}
        />
        : <Spinner />
      }
    </DefaultLayout>
  )
}
export default EditUniguriBalloonPage

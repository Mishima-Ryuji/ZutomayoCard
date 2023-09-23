import { Heading, Stepper, useSteps } from '@chakra-ui/react'
import { NextPage } from 'next'
import { useRef, useState } from 'react'
import { Celebration, useCelebration } from '~/components/Celebration'
import { DefaultLayout } from '~/components/Layout'
import { Toggle } from '~/components/Toggle'
import { BasicInfoStep, InputBasicInfoStep, useBasicInfoStep } from '~/components/championship/Form/BasicInfoStep'
import { HostInfoStep, InputHostInfoStep, useHostInfoStep } from '~/components/championship/Form/HostInfoStep'
import { Navigation } from '~/components/championship/Form/Navigation'
import { InputOptionalInfoStep, OptionalInfoStep, useOptionalInfoStep } from '~/components/championship/Form/OptionalInfoStep'
import { SubmitStepContent } from '~/components/championship/Form/SubmitStep'
import { InputThemeInfoStep, ThemeInfoStep, useThemeInfoStep } from '~/components/championship/Form/ThemeInfoStep'
import { ChampionshipInput } from '~/components/championship/Form/type'
import { Timestamp, addDoc } from "~/firebase"
import { useToastCallback } from '~/hooks/useToastCallback'
import { championshipsRef } from '~/shared/firebase/firestore/scheme/championship'
import { after, set } from '~/shared/firebase/firestore/utils'

const defaultValue: ChampionshipInput = {
  name: "",
  hold_at:
    // 1週間後の12:00
    set(
      after(Timestamp.now(), { day: 7 }),
      { hour: 12, minute: 0, second: 0, milliSeccond: 0 }
    ),
  place: "",
  time_limit_at:
    // 1週間後の00:00
    set(
      after(Timestamp.now(), { day: 7 }),
      { hour: 0, minute: 0, second: 0, milliSeccond: 0 }
    ),
  format: "",
  entry_fee: "",
  need_items: "",
  detail: "",
  host_uid: "test-user-1",
  host_name: "",
  host_contact: "",
  color: "green",
  image: null,
}

const NewChampionshipPage: NextPage = () => {
  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: 4,
  })
  const stepperRef = useRef<HTMLDivElement>(null)
  const handlePrev = () => {
    goToPrevious()
    stepperRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  const handleNext = () => {
    goToNext()
    stepperRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  const isBasicInfoStep = activeStep === 0
  const isOptionalInfoStep = activeStep === 1
  const isHostInfoStep = activeStep === 2
  const isThemeInfoStep = activeStep === 3
  const isSubmitStep = activeStep === 4

  const basicInfoStep = useBasicInfoStep({ defaultValue })
  const optionalInfoStep = useOptionalInfoStep({ defaultValue })
  const hostInfoStep = useHostInfoStep({ defaultValue })
  const themeInfoStep = useThemeInfoStep({ defaultValue })

  const [createdChampionshipLink, setCreatedChampionshipLink] = useState<string | null>(null)
  const isCreated = createdChampionshipLink !== null
  const [handleCreate, isCreating] = useToastCallback(
    async () => {
      if (!basicInfoStep.isValid || !optionalInfoStep.isValid || !hostInfoStep.isValid || !themeInfoStep.isValid) return
      const ref = await addDoc(championshipsRef, {
        ...basicInfoStep.input,
        ...optionalInfoStep.input,
        ...hostInfoStep.input,
        ...themeInfoStep.input,
      })
      await celebrate()
      setCreatedChampionshipLink(`/championships/${ref.id}`)
    },
    {
      success: {
        title: "登録完了",
        description: "大会を登録できました！🎉",
      },
      error: {
        title: "エラー",
        description: "大会を登録できませんでした。もう一度お試しください。",
      },
    }
  )
  const { celebrate } = useCelebration()

  return (
    <DefaultLayout head={{ title: "大会の登録" }}>

      <Heading mt="12" mb="3">
        大会の登録
      </Heading>

      <Stepper index={activeStep} w="full" overflowX="auto" my="8" ref={stepperRef}>
        <BasicInfoStep />
        <OptionalInfoStep />
        <HostInfoStep />
        <ThemeInfoStep />
      </Stepper>

      <Toggle show={isBasicInfoStep}>
        <InputBasicInfoStep
          {...basicInfoStep.props.input}
        />
        <Navigation
          mt={4}
          prev={{ isDisabled: true, onClick: handlePrev }}
          next={{ isDisabled: !basicInfoStep.isValid, onClick: handleNext }}
        />
      </Toggle>

      <Toggle show={isOptionalInfoStep}>
        <InputOptionalInfoStep
          {...optionalInfoStep.props.input}
        />
        <Navigation
          mt={4}
          prev={{ isDisabled: false, onClick: handlePrev }}
          next={{ isDisabled: !optionalInfoStep.isValid, onClick: handleNext }}
        />
      </Toggle>

      <Toggle show={isHostInfoStep}>
        <InputHostInfoStep
          {...hostInfoStep.props.input}
        />
        <Navigation
          mt={4}
          prev={{ isDisabled: false, onClick: handlePrev }}
          next={{ isDisabled: !hostInfoStep.isValid, onClick: handleNext }}
        />
      </Toggle>

      <Toggle show={isThemeInfoStep}>
        <InputThemeInfoStep
          {...themeInfoStep.props.input}
        />
        <Navigation
          mt={4}
          prev={{ isDisabled: false, onClick: handlePrev }}
          next={{ isDisabled: !themeInfoStep.isValid, onClick: handleNext }}
        />
      </Toggle>

      <Toggle show={isSubmitStep}>
        <SubmitStepContent
          nextLink={createdChampionshipLink}
          isSubmitting={isCreating}
          isSubmitted={isCreated}
          onSubmit={handleCreate}
          onPrev={handlePrev}
        />
        <Celebration />
      </Toggle>

    </DefaultLayout>
  )
}
export default NewChampionshipPage

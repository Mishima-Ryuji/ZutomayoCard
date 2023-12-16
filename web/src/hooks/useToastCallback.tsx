import { useToast } from "@chakra-ui/react"
import { ReactNode, useCallback, useRef, useState } from "react"

interface UseToastCallbackOptions {
  disableToast?: Partial<{
    success: boolean
    error: boolean
  }>
  success?: Partial<{
    title: ReactNode
    description: ReactNode
  }>
  error?: Partial<{
    title: ReactNode
    description: ReactNode
  }>
  toastOptions?: Parameters<typeof useToast>[0]
}
export const useToastCallback = <Args extends unknown[], Res>(
  callback: (...args: Args) => Res,
  options: UseToastCallbackOptions = {},
) => {
  const disableSuccessToast = options.disableToast?.success ?? false
  const disableErrorToast = options.disableToast?.error ?? false
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  const toast = useToast(options.toastOptions)

  const [isRunning, setIsRunning] = useState(false)

  const handleSuccess = useCallback(() => {
    toast({
      title: options.success?.title ?? "登録できました",
      description: options.success?.description ?? "",
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }, [options.success?.description, options.success?.title, toast])
  const handleError = useCallback((error: unknown): never => {
    console.error(error)
    if (!disableErrorToast) {
      toast({
        title: options.error?.title ?? "エラー",
        description: options.error?.description ?? "",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    throw error
  }, [disableErrorToast, options.error?.description, options.error?.title, toast])
  const callbackWithToast = useCallback((...args: Args): Res => {
    setIsRunning(true)
    try {
      const res = callbackRef.current(...args)
      if (res instanceof Promise) {
        res
          .then(handleSuccess)
          .catch(handleError)
        return res
      } else {
        if (!disableSuccessToast) {
          toast({
            title: options.error?.title ?? "成功",
            description: options.error?.description ?? "",
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        }
        return res
      }
    } catch (error) {
      throw handleError(error)
    } finally {
      setIsRunning(false)
    }
  }, [disableSuccessToast, handleError, handleSuccess, options.error?.description, options.error?.title, toast])
  return [
    callbackWithToast,
    isRunning,
  ] as const
}

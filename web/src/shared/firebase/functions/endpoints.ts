import { z } from 'zod'

/**
 * Functionのスキーマ
 *
 * Function名をキーとし、zodによる型付与でFunctionsの引数の型を定義する
 */
export const FunctionsParamsSchema = {
  helloWorld: z.object({}),
}

/**
 * Functionの戻り値
 *
 * Functionの戻り値を定義する
 */
export interface Functions {
  helloWorld: {
    input: z.input<(typeof FunctionsParamsSchema)['helloWorld']>
    output: z.output<(typeof FunctionsParamsSchema)['helloWorld']>
    returns: { success: true }
  }
}

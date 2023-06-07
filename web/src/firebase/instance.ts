import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import { Auth, getAuth } from 'firebase/auth'
import { Firestore, initializeFirestore } from 'firebase/firestore'
import {
  Functions as FirebaseFunctions,
  getFunctions,
  httpsCallable,
} from 'firebase/functions'
import { FirebaseStorage, getStorage } from 'firebase/storage'
import { Functions } from '~/firebase'

class Firebase {
  public static instance: Firebase
  public readonly auth: Auth
  public readonly db: Firestore
  public readonly storage: FirebaseStorage
  public readonly functions: FirebaseFunctions

  constructor() {
    const app = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FB_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FB_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
    })

    this.auth = getAuth()
    this.db = initializeFirestore(app, {
      ignoreUndefinedProperties: true,
    })
    this.storage = getStorage()
    this.functions = getFunctions()
    this.functions.region = 'asia-northeast1'
  }

  static getInstance() {
    if (!Firebase.instance) {
      Firebase.instance = new Firebase()
    }
    return Firebase.instance
  }

  get analytics() {
    return getAnalytics()
  }

  call<T extends keyof Functions>(funcName: T) {
    return async (
      params: Functions[typeof funcName]['input']
    ): Promise<{ data: Functions[typeof funcName]['returns'] }> => {
      // JSONで表現出来ない型がfirebase-js-sdkでは適切にフォーマットしてくれないので一回stringifyを通して整形する
      const data: any = JSON.parse(JSON.stringify(params))

      console.debug(data)

      // 型引数に改善の余地あり
      return await httpsCallable<any, Functions[typeof funcName]['returns']>(
        this.functions,
        funcName
      )(data)
    }
  }
}

export const fb = Firebase.getInstance()

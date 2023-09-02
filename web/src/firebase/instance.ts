import { getAnalytics } from 'firebase/analytics'
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore, initializeFirestore } from 'firebase/firestore'
import {
  getFunctions,
  httpsCallable
} from 'firebase/functions'
import { connectStorageEmulator, getStorage } from 'firebase/storage'
import { Functions } from '~/firebase'

class Firebase {
  public static instance: Firebase

  constructor() {
    const apps = getApps()
    let app: FirebaseApp
    // initializeAppの二重起動を防ぐために起動済みのFirebaseAppがないか確認する
    if (apps.length === 0) {
      app = initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
        databaseURL: process.env.NEXT_PUBLIC_FB_DATABASE_URL,
        projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FB_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
      })
      this.setupDb(app)
      this.setupFunctions()
      this.setupEmulators()
    } else {
      app = getApp()
    }
  }

  get auth() {
    return getAuth()
  }
  private setupDb(app: FirebaseApp) {
    initializeFirestore(app, {
      ignoreUndefinedProperties: true,
    })
  }
  get db() {
    return getFirestore()
  }
  get storage() {
    return getStorage()
  }
  private setupFunctions() {
    this.functions.region = "asia-northeast1"
  }
  get functions() {
    return getFunctions()
  }

  static getInstance() {
    if (Firebase.instance === undefined) {
      Firebase.instance = new Firebase()
    }
    return Firebase.instance
  }

  private setupEmulators() {
    console.info("⭐️ use firebase emulators")
    connectAuthEmulator(this.auth, "http://127.0.0.1:9099")
    connectFirestoreEmulator(this.db, "127.0.0.1", 8080)
    connectStorageEmulator(this.storage, "127.0.0.1", 9199)
  }

  get analytics() {
    return getAnalytics()
  }

  call<T extends keyof Functions>(funcName: T) {
    return async (
      params: Functions[typeof funcName]['input']
    ): Promise<{ data: Functions[typeof funcName]['returns'] }> => {
      // JSONで表現出来ない型がfirebase-js-sdkでは適切にフォーマットしてくれないので一回stringifyを通して整形する

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

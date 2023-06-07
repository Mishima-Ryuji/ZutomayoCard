import { App, getApps, initializeApp } from 'firebase-admin/app'
import { Auth, getAuth } from 'firebase-admin/auth'
import { Firestore, getFirestore } from 'firebase-admin/firestore'
import { getStorage, Storage } from 'firebase-admin/storage'

export class Firebase {
  public static instance: Firebase
  public readonly app: App
  public readonly auth: Auth
  public readonly db: Firestore
  public readonly storage: Storage

  constructor() {
    this.app = getApps().length === 0 ? initializeApp() : getApps()[0]
    this.auth = getAuth(this.app)
    this.db = getFirestore(this.app)
    this.db.settings({
      ignoreUndefinedProperties: true,
    })
    this.storage = getStorage(this.app)
  }

  static getInstance() {
    if (!Firebase.instance) {
      Firebase.instance = new Firebase()
    }
    return Firebase.instance
  }
}

export const fb = Firebase.getInstance()

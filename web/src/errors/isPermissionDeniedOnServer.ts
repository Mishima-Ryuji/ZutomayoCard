import { FirebaseError } from "firebase/app"

export const isPermissionDenied = (error: unknown) =>
  error instanceof FirebaseError &&
  error.code === "permission-denied"

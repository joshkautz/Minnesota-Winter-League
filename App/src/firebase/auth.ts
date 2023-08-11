import { getAuth, Auth, User, AuthError } from 'firebase/auth'
import { app } from './app.ts'

const auth = getAuth(app)

export { auth, type Auth, type User, type AuthError }

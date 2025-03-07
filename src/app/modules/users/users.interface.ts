import { Schema, model, connect } from 'mongoose'

export type IUser = {
  id: string
  role: string
  password: string
  email: string
}

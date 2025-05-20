import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  env : process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_round : process.env.BCRYPT_SALT_ROUNDS,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  client_url: process.env.CLIENT_URL,
  jwt:{
    secret: process.env.JWT_SECRET,
    expires_in : process.env.JWT_EXPIRES_IN,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN
  },
  bkash:{
    username: process.env.BCASH_USERNAME,
    password: process.env.BCASH_PASSWORD,
    app_key: process.env.BCASH_APP_KEY,
    app_secret: process.env.BCASH_SECRET,
    base_url: process.env.BCASH_BASE_URL
  }
}
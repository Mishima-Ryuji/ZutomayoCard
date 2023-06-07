import { config } from 'dotenv'

config({
  path: `.env.${process.env.GCLOUD_PROJECT}`,
})

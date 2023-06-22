import { config } from 'dotenv'

if (process.env.GCLOUD_PROJECT !== undefined)
  config({
    path: `.env.${process.env.GCLOUD_PROJECT}`,
  })

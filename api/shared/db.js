import { Client } from '@planetscale/database'
import fetch from 'node-fetch'

export function connect() {
  const db = new Client({
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
  })

  return db.connection()
}
import { Client } from '@planetscale/database'
import { getCurrentUser } from './shared/github.mjs'

const db = new Client({
  fetch,
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD
})

export default async function handler(request, response) {
  const conn = db.connection()

  const user = await getCurrentUser(`${request.headers["authorization"]}`)
  if(!user.id) {
    response.status(401).send()
  }
  
  const method = request.method
  switch(method.toLowerCase()) {
    case "get": 
      get(conn, request, response, user.id)
      break
    case "post":
      post(conn, request, response, user.id)
      break
    default:
      response.status(500).send()
  }
}

// Get all calendars
async function get(conn, request, response, userId) {
  const query = "SELECT * FROM displayed_calendars WHERE user_id = ?"
  const results = await conn.execute(query, [userId])
  if(results.error) {
    console.log(results.error)
    response.status(500).json(results.error)
  }
  if(results.rows && results.rows.length === 1) {
    response.status(200).json(results.rows[0].calendars)
  } else {
    response.status(200).json({
      is_new: true
    })
  }
}

// Add a calendar
async function post(conn, request, response, userId) {
  const { body } = request
  const query = `
    INSERT INTO displayed_calendars 
      (user_id, calendars) VALUES (?, ?)
    ON DUPLICATE KEY UPDATE
      calendars = ?
    `
  let results = await conn.execute(query, [
    userId,
    body,
    body
  ])
  if(results.error) {
    response.status(500).json(results.error)
  }
  response.status(200).json({})
}
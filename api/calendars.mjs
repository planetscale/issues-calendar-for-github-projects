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

  const user = await getCurrentUser(request.headers["authorization"])
  if(!user.id) {
    response.status(401).send()
    return
  }
  
  const method = request.method
  switch(method.toLowerCase()) {
    case "get": 
      get(conn, request, response)
      break
    case "post":
      post(conn, request, response)
      break
    case "delete": 
      del(conn, request, response)
      break
    default:
      response.status(500).send()
  }
}

// Get all calendars
async function get(conn, request, response) {
  const query = "SELECT * FROM calendars"
  const results = await conn.execute(query)
  if(results.error) {
    response.status(500).json(results.error)
  }
  response.status(200).json(results.rows)
}

// Add a calendar
async function post(conn, request, response) {
  let calendar = JSON.parse(request.body)
  const query = `
    INSERT INTO calendars 
      (friendly_name, organization, project_id, start_date_field, end_date_field, use_milestones) VALUES
      (?, ?, ?, ?, ?, ?)
    `
  let res = await conn.execute(query, [
    calendar.friendly_name,
    calendar.organization,
    calendar.project_id,
    calendar.start_date_field,
    calendar.end_date_field,
    calendar.use_milestones
  ])
  calendar.id = Number(res.insertId)

  response.status(200).json(calendar)
}

// Update a calendar

// Delete a calendar
async function del(conn, request, response) {
  let calendar = JSON.parse(request.body)
  const query = "DELETE FROM calendars WHERE id = ?"
  await conn.execute(query, [
    calendar.id,
  ])
  response.status(200).json({})
}
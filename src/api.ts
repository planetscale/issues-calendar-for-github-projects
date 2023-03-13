import colors from "./colors"
import Calendar from "./models/Calendar"

export async function fetchCalendars(token: string) {
  return await execute("get", "/calendars", token)
}

export async function postCalendar(token: string, friendly_name: string, organization: string, project_id: number, start_date_field: string, end_date_field?: string, use_milestones?: boolean) {
  return await execute("post", "/calendars", token, {
    friendly_name,
    organization,
    project_id,
    start_date_field,
    end_date_field,
    use_milestones
  })
}

export async function deleteCalendar(token: string, id: number) {
  await execute("delete", `/calendars`, token, {
    id
  })
}

export async function fetchDisplayedCalendars(token: string) {
  let res = await execute("get", "/displayed", token)

  // if using the old array model, convert it to calendars before returning
  if(res && (typeof res[0] === 'string' || res[0] instanceof String)) {
    let fixed: Calendar[] = []
    res.forEach((c: string) => {
      fixed.push({
        name: c,
        color: colors["orange"],
        isDisplayed: true
      })
    })
    return fixed
  } else {
    return res
  }
}

export async function updateDisplayedCalendars(token: string, calendars: Calendar[]) {
  return await execute("post", "/displayed", token, calendars)
}

async function execute(method: string, path: string, token: string, body?: any) {
  let opts: any = {
    method,
    headers: {
      "Authorization": `Bearer ${token}`
    }
  }
  if(body) opts.body = JSON.stringify(body)
  let res = await fetch(`/api${path}`, opts)
  return await res.json()
}

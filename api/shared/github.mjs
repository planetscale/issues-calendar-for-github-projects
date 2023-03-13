import fetch from 'isomorphic-fetch'

const base = "https://api.github.com"

export async function validateToken(access_token) {
  const url = `${base}/applications/${process.env.REACT_APP_GH_CLIENTID}/token`
  const appToken = Buffer.from(process.env.REACT_APP_GH_CLIENTID + ":" + process.env.GH_CLIENTSECRET).toString('base64')
  let res = await fetch(url, {
    method: "post",
    headers: {
      "Authorization": `Basic ${appToken}`
    },
    body: JSON.stringify({
      access_token
    })
  })
  if(res.status === 200) {
    return true
  }
  return false
}

export async function getCurrentUser(auth) {
  let res = await fetch(`${base}/user`, {
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": auth
    }
  })
  return await res.json()
}
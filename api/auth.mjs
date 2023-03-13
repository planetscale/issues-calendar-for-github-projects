import fetch from "isomorphic-fetch"

export default async function handler (request, response) {
  const url = `https://github.com/login/oauth/access_token?client_id=${process.env.REACT_APP_GH_CLIENTID}&client_secret=${process.env.GH_CLIENTSECRET}&code=${request.body.code}`
  let res = await fetch(url, {
    method: "post",
    headers: {
      "Accept": "application/json"
    }
  })
  let json = await res.json()
  response.status(200).json(json)
}
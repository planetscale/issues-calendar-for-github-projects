import React, { useEffect } from 'react'
import styled from 'styled-components'
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const Wrapper = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: center;

  .err-state {
    display: flex;
    flex-direction: column;
  }
`

function AuthView() {
  const navigate = useNavigate()
  const [err, setErr] = useState(false)

  useEffect(() => {
    async function init() {
      localStorage.removeItem("auth")
      let { search } = window.location
      let code = search.replace("?code=", "")
      let res = await fetch("/api/auth", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code
        })
      })
      let json = await res.json()
      if(json.access_token) {
        localStorage.setItem("auth", JSON.stringify(json))
        navigate("/")
      } else {
        setErr(true)
      }
    }
    init()
  }, [])

  return (
    <Wrapper>
      {err ? (
        <div className="err-state">
          Something went wrong...
          <Button onClick={() => navigate("/")}>Try again</Button>
        </div>
      ) : (
          <CircularProgress />
      )}
    </Wrapper>
  )
}

export default AuthView
import React from 'react'
import { Calendar as CalendarComp, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import EventCard from '../components/EventCard'
import Toolbar from '../components/Toolbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Issue from '../models/Issue';
import Event from '../models/Event';
import * as api from '../api'
import { Backdrop, CircularProgress} from '@mui/material';
import ConfigModal from '../components/ConfigModal';
import DisplayedCalendarsModal from '../components/DisplayedCalendarsModal';
import colors from "../colors"
import Project from '../models/Project';
import Calendar from '../models/Calendar';
import { deepCopy } from '../utils';

const loginUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GH_CLIENTID}&redirect_uri=${process.env.REACT_APP_GH_REDIRECT_URI}&scope=repo,project`

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#f35815",
    },
    info: {
      main: "#1f1f1f"
    }
  }
});

const Wrapper = styled.div`
  margin: 20px;
  height: 100%;

  .rbc-month-view {
    border-radius: 6px;
    border-color: rgb(43,43,43);

    & > *, .rbc-header, .rbc-day-bg {
      border-color: rgb(43,43,43) !important;
    }
  }

  .rbc-off-range-bg {
    background-color: #111;
  }

  .rbc-event {
    background-color: rgba(0,0,0,0);
    padding: 0px;
  }

  .rbc-event-content {
    white-space: pre-wrap;
  }

  .rbc-today {
    background-color: #2a2a2a;
  }

  .rbc-month-row {
    overflow-y: scroll;
    overflow-x: hidden;
  }
  * {
    scrollbar-width: auto;
    scrollbar-color: #5e5e5e rgba(0,0,0,0);
  }

  *::-webkit-scrollbar {
    width: 8px;
  }

  *::-webkit-scrollbar-track {
    background: rgba(0,0,0,0);
  }

  *::-webkit-scrollbar-thumb {
    background-color: #5e5e5e;
    border-radius: 10px;
    border: 3px solid rgba(0,0,0,0);
  }

`

function CalendarView() {
  const localizer = momentLocalizer(moment)
  const [isInit, setIsInit] = useState(false)
  const [events, setEvents] = useState<{[key: string]: Event[]}>({})
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSelecteDisplayedModalOpen, setIsSelecteDisplayedModalOpen] = useState(false)
  const [isConfigModalDisplayed, setIsConfigModalDisplayed] = useState(false)
  const [calendars, setCalendars] = useState<Calendar[]>([])
  const [cardRefreshHook, triggerCardRefresh] = React.useState<any>();
  const refreshEventCards = React.useCallback(() => triggerCardRefresh({}), []);

  // Load projects & events (issues)
  const loadCalendars = useCallback(async (accessToken: string) => {
    setIsLoading(true)
    try {
      let projects = await api.fetchCalendars(accessToken)
      setProjects(projects)

      let evts: {[key: string]: Event[]} = {}
      for (let i = 0; i < projects.length; i++) {
        let res = await fetch("/api/fetch_issues", {
          method: "post",
          headers: {
            "Authorization": `Bearer ${accessToken}`
          },
          body: JSON.stringify(projects[i])
        })

        if(res.status !== 200) {
          window.location.href = loginUrl
        }

        let json = await res.json()
        json.forEach((i: Issue) => {
          if(!evts[i.category]) evts[i.category] = []
          if(i.start_date) {
            evts[i.category].push({
              title: i.title,
              start: i.start_date,
              end: i.end_date,
              allDay: true,
              resource: {
                id: i.id,
                url: i.url,
                category: i.category
              }
            })
          }
        })
      }

      // Build the final stuff
      let cals: Calendar[] = []
      Object.keys(evts).forEach(cat => {
        cals.push({
          name: cat,
          color: colors["orange"],
          isDisplayed: false
        })
      })
      setEvents(evts)
      return {
        calendars: cals,
        events: evts
      }
    } catch (err) {
      console.error(err)
      localStorage.removeItem("auth")
      window.location.href = loginUrl
    }
  }, [])

  const loadSelectedCalendars = useCallback(async (accessToken: string, categories: string[], calendars: Calendar[]) => {
    try {
      let res = await api.fetchDisplayedCalendars(accessToken)
      if(res.is_new) {
        let fixed: Calendar[] = []
        categories.forEach(k => {
          fixed.push({
            name: k,
            color: colors["orange"],
            isDisplayed: true
          })
        })
        res = fixed
      }
      
      // merge what we fetch from the API into displayed events
      let cals: Calendar[] = []
      calendars.forEach((c: Calendar)=> {
        let fetchedCalendar = res.find((cal: Calendar) => cal.name === c.name)
        if(fetchedCalendar) {
          c.color = fetchedCalendar.color
          c.isDisplayed = fetchedCalendar.isDisplayed
        }
        cals.push(c)
      })

      setCalendars(cals)
      return calendars
    } catch (err) {
      console.error(err)
      localStorage.removeItem("auth")
      window.location.href = loginUrl
    }
  }, [])

  // init
  useEffect(() => {
    async function load() {
      setIsInit(true)

      let accessToken = null;

      const auth = localStorage.getItem("auth")
      if(auth) {
        const jauth = JSON.parse(auth)
        accessToken = jauth.access_token
      }

      if(!accessToken) {
        window.location.href = loginUrl
      }
      setToken(accessToken)
      let res = await loadCalendars(accessToken)
      let categories = Object.keys(res?.events as {[key: string]:Event[]})
      await loadSelectedCalendars(accessToken, categories, res?.calendars as Calendar[])

      setIsLoading(false)
    }
    if(!isInit) load()
  }, [isInit, loadCalendars, loadSelectedCalendars])

  // When calendars or events change, update the displayed events
  useEffect(() => {
    let disp: Event[] = []
    Object.keys(events).forEach((cat: string) => {
      let calendar = calendars.find(cal => cal.name === cat)
      if(calendar && calendar.isDisplayed) {
        events[cat].forEach((e: Event) => {
          e.resource.colors = calendar?.color
          disp.push(e)
        })
      }
    })
    setDisplayedEvents([...disp])
    refreshEventCards()
  }, [calendars, events, refreshEventCards])

  // When an event is clicked, open the issue in GitHub
  const onSelectEvent = useCallback((evt: Event) => {
    if(evt.resource.url) window.open(evt.resource.url, "_blank")
  }, [])

  function onCalendarToggled(toggled: Calendar) {
    let cals = deepCopy(calendars)
    cals.forEach(c => c.name === toggled.name ? c.isDisplayed = !c.isDisplayed : null)
    setCalendars(cals)
    saveDisplaySettings(cals)
  }

  function onCalendarColorChanged(calendar: Calendar, code: string) {
    let cals = deepCopy(calendars)
    cals.forEach(c => c.name === calendar.name ? c.color = colors[code] : null)
    setCalendars(cals)
    saveDisplaySettings(cals)
  }

  async function saveDisplaySettings(calendars: Calendar[]) {
    await api.updateDisplayedCalendars(token, calendars)
  }

  return (
    <Wrapper className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CalendarComp
          localizer={localizer}
          events={displayedEvents}
          onSelectEvent={onSelectEvent}
          components={{
            event: (props) => <EventCard {...props} cardRefreshHook={cardRefreshHook} />, 
            toolbar: (props) => <Toolbar {...props}
              onOpenConfigClicked={() => setIsConfigModalDisplayed(true)}
              onSetSelectedCalendarsClicked={() => setIsSelecteDisplayedModalOpen(true)} />
          }} />
        
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <ConfigModal
          token={token}
          open={isConfigModalDisplayed}
          calendars={projects}
          handleClose={() => setIsConfigModalDisplayed(false)}
          onCalendarsUpdated={() => loadCalendars(token)} />

        {/* Displayed calendars modal */}
        <DisplayedCalendarsModal
          open={isSelecteDisplayedModalOpen}
          onClose={() => setIsSelecteDisplayedModalOpen(false)}
          onCalendarToggled={onCalendarToggled}
          calendars={calendars} 
          onCalendarColorChanged={onCalendarColorChanged}/>

      </ThemeProvider>
    </Wrapper>
  );
}

export default CalendarView
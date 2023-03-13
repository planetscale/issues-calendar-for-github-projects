import { Close } from '@mui/icons-material'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import React from 'react'
import styled from 'styled-components'
import Calendar from '../models/Calendar'
import DisplayedCalendarOption from './DisplayedCalendarOption'

const Wrapper = styled(Dialog)`
  .displayed-calendars-grid {
    padding: 16px 24px;
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    row-gap: 10px;

    .icon-btn {
      margin: 0px 5px;
    }
  }
`

type Props = {
  open: boolean
  onClose: Function
  onCalendarToggled: Function
  calendars: Calendar[]
  onCalendarColorChanged: Function
}

function DisplayedCalendarsModal({ open, onClose, onCalendarToggled, calendars, onCalendarColorChanged }: Props) {
  return (
    <Wrapper onClose={() => onClose()} open={open}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginRight: "10px", width: { lg: "450px", md: "350px", sm: "350px", xs: "350px" }}}>
        <DialogTitle>Displayed Calendars</DialogTitle>
        <IconButton onClick={() => onClose()}><Close /></IconButton>
      </Stack>
        <div className="displayed-calendars-grid">
          {calendars && calendars.map((calendar: Calendar) => (
            <DisplayedCalendarOption 
              key={`cal-${calendar.name}`}
              calendar={calendar}  
              onColorChanged={(code: string) => onCalendarColorChanged(calendar, code)}
              onToggle={() => onCalendarToggled(calendar) } />
          ))}
        </div>
    </Wrapper>
  )
}

export default DisplayedCalendarsModal
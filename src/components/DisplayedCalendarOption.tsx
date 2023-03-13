import { Visibility, VisibilityOff } from '@mui/icons-material'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import React from 'react'
import colors from '../colors'
import Calendar from '../models/Calendar'
import ColorPickerOption from './ColorPickerOption'

type Props = {
  calendar: Calendar
  onToggle: Function
  onColorChanged: Function
}

function DisplayedCalendarOption({ calendar, onToggle, onColorChanged }: Props) {
  return (
    <>
      <div>{calendar.name}</div>
      <div className='icon-btn'>
        <IconButton onClick={() => onToggle()}>
          {calendar.isDisplayed ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </div>
      <FormControl className='color-picker' size="small">
        <InputLabel id="demo-simple-select-label">Color</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Age"
          value={calendar.color.code}
          onChange={(e: SelectChangeEvent) => onColorChanged(e.target.value)}
        >
          {Object.keys(colors).map(key => (
            <MenuItem key={`color-${key}`} value={key}>
              <ColorPickerOption color={colors[key]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}

export default DisplayedCalendarOption
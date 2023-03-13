import { Add, Close, Delete  } from '@mui/icons-material';
import { Button } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { Checkbox, TextField, Dialog, DialogTitle, List, ListItem, ListItemText, Box, IconButton, Stack } from '@mui/material'
import React, { useState } from 'react'
import * as api from '../api';

function ConfigModal({ open, handleClose, calendars, token, onCalendarsUpdated }: any) {
  const [isAddingNewCalendar, setIsAddingNewCalendar] = useState(false)
  const [friendlyName, setFriendlyName] = useState("")
  const [orgName, setOrgName] = useState("")
  const [startDateField, setStartDateField] = useState("")
  const [endDateField, setEndDateField] = useState("")
  const [projectId, setProjectId] = useState("")
  const [useMilestones, setUseMilestones] = useState(false)
  const [calendarBeingDeleted, setCalendarBeingDeleted] = useState<any>(null)

  async function addCalendar() {
    let _endDateField = endDateField ? endDateField : startDateField
    await api.postCalendar(token, friendlyName, orgName, Number(projectId), startDateField, _endDateField, useMilestones)

    // reset & close modal
    setFriendlyName("")
    setOrgName("")
    setStartDateField("")
    setEndDateField("")
    setProjectId("")
    setUseMilestones(false)
    setIsAddingNewCalendar(false)

    // refresh calendars
    onCalendarsUpdated()
  }

  async function deleteCalendar() {
    await api.deleteCalendar(token, calendarBeingDeleted.id)
    setCalendarBeingDeleted(null)

    // refresh calendars
    onCalendarsUpdated()
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginRight: "10px", width: { lg: "400px", md: "300px", sm: "300px", xs: "300px" }}}>
        <DialogTitle>Projects</DialogTitle>
        <IconButton onClick={handleClose} ><Close /></IconButton>
      </Stack>
      <Box sx={{ padding: "10px"}}>
        <List sx={{ width: "100%" }}>
          {calendars && calendars.map((c: any) => (
            <ListItem key={`cal-${c.organization}-${c.project_id}`}
              secondaryAction={
                <Stack direction="row">
                  <IconButton aria-label="delete" onClick={() => setCalendarBeingDeleted(c)}>
                    <Delete />
                  </IconButton>
                </Stack>
              }>
              <ListItemText primary={c.friendly_name} secondary={`${c.organization} // ${c.project_id}`} />
            </ListItem>
          ))}
          <ListItem disablePadding>
            <IconButton onClick={() => setIsAddingNewCalendar(true)}><Add /></IconButton>
          </ListItem>
        </List>
      </Box>

      {/* Add new calendar modal */}
      <Dialog open={isAddingNewCalendar} onClose={() => setIsAddingNewCalendar(false)}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: { lg: "400px", md: "300px", sm: "300px", xs: "300px" }}}>
          <DialogTitle>Add calendar</DialogTitle>
          <IconButton onClick={() => setIsAddingNewCalendar(false)}><Close /></IconButton>
        </Stack>
        <Stack margin={2}>
          <TextField label="Friendly name" sx={{ marginBottom: "10px" }} value={friendlyName} onChange={(e) => setFriendlyName(e.target.value)}/>
          <TextField label="Organization name" sx={{ marginBottom: "10px" }} value={orgName} onChange={(e) => setOrgName(e.target.value)}/>
          <TextField label="Project ID" type="number" sx={{ marginBottom: "10px" }} value={projectId} onChange={(e) => setProjectId(e.target.value)}/>
          <TextField label="Start date field" sx={{ marginBottom: "10px" }} value={startDateField} onChange={(e) => setStartDateField(e.target.value)}/>
          <TextField label="End date field" sx={{ marginBottom: "10px" }} value={endDateField} onChange={(e) => setEndDateField(e.target.value)}/>
          <FormControlLabel control={<Checkbox value={useMilestones} onChange={(e) => setUseMilestones(e.target.checked)} />} label="Use milestones" sx={{ marginBottom: "10px" }} />
          <Button onClick={() => addCalendar()}>Save</Button>
        </Stack>
      </Dialog>
      <Dialog open={calendarBeingDeleted !== null} onClose={() => setCalendarBeingDeleted(null)}>
        <Stack direction="row" justifyContent="space-between" sx={{ marginRight: "10px", width: { lg: "400px", md: "300px", sm: "300px", xs: "300px" }}}>
          <DialogTitle>Delete calendar?</DialogTitle>
          <IconButton onClick={() => setCalendarBeingDeleted(null)}><Close /></IconButton>
        </Stack>
        <Stack margin={2}>
          <div>This action is permanent.</div>
            <List sx={{ width: "100%" }}>
              <ListItem>
                <ListItemText primary={`Org: ${calendarBeingDeleted?.organization}`} secondary={`Project ID: ${calendarBeingDeleted?.project_id}`} />
              </ListItem>
            </List>
          <Button color="error" onClick={() => deleteCalendar()}>Delete</Button>
        </Stack>
      </Dialog>
    </Dialog>
  )
}

export default ConfigModal
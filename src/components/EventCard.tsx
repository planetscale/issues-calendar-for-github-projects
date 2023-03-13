import React, { useEffect, useState } from 'react'
import Chip from '@mui/material/Chip'
import Event from '../models/Event'
import styled from 'styled-components'
import colors from '../colors'

const Wrapper = styled.div`
  overflow: wrap;
  padding: 4px;
  border-radius: 5px;
`

type Props = {
  event: Event
  cardRefreshHook: any
}

function EventComp({ event }: Props) {
  const [color, setColor] = useState(colors["gray"])

  useEffect(() => {
    if(event.resource.colors) {
      setColor(event.resource.colors)
    }
  }, [event])

  return (
    <Wrapper style={{ backgroundColor: color.cardHex }}>
      <div>
        {event.resource.category && (
          <Chip
            label={event.resource.category}
            size="small"
            style={{
              marginRight: "5px", 
              backgroundColor: color.pillHex,
              color: color.useDarkText ? "#000" : "inherit"
            }} />
        )}
        {event.title}
      </div>
    </Wrapper>
  )
};

export default EventComp
import { Color } from "../colors"

type Event = {
  title: string
  start: string
  end: string
  allDay: boolean,
  resource: EventResource
}

type EventResource = {
  id: string
  url: string
  category: string
  colors?: Color
}

export default Event
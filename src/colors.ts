export type Color = {
  code: string
  cardHex: string
  pillHex: string
  useDarkText?: boolean
}

interface ColorMap {
  [key: string]: Color
}

const colors: ColorMap = {
  "orange": {
    code: "orange",
    cardHex: "#3C1403",
    pillHex: "#F35815"
  },
  "green": {
    code: "green",
    cardHex: "#0A2B13",
    pillHex: "#13862E"
  },
  "blue": {
    code: "blue",
    cardHex: "#08204E",
    pillHex: "#0B6EC5"
  },
  "red": {
    code: "red",
    cardHex: "#341418",
    pillHex: "#D92038"
  },
  "purple": {
    code: "purple",
    cardHex: "#27124A",
    pillHex: "#5E49AF"
  },
  "yellow": {
    code: "yellow",
    cardHex: "#281E03",
    pillHex: "#F2B600",
    useDarkText: true
  },
  "gray": {
    code: "gray",
    cardHex: "#2B2B2B",
    pillHex: "#EBEBEB",
    useDarkText: true
  },
}


export default colors
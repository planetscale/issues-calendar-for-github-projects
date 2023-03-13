import React from 'react'
import styled from 'styled-components'
import { Color } from '../colors'

const Wrapper = styled.div`
  display: flex;

  .color {
    width: 20px;
    height: 20px;
  }

  .color-left {
    border-radius: 5px 0px 0px 5px;
  }

  .color-right {
    border-radius: 0px 5px 5px 0px;
    width: 20px;
    height: 20px;
  }
`

type Props = {
  color: Color
}

function ColorPickerOption({ color }: Props) {
  return (
      <Wrapper>
        <div className='color color-left' style={{ backgroundColor: color.pillHex }}></div>
        <div className='color color-right' style={{ backgroundColor: color.cardHex }}></div>
      </Wrapper>
  )
}

export default ColorPickerOption
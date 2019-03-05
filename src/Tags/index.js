import React from 'react'
import { Tag, Button } from 'react-bulma-components'

import { semanticColors } from '../colors'

export function FilterTag({ type, children, handleDelete }){
  return <Tag.Group gapless>
    <Tag><strong>{ type }</strong></Tag>
    <Tag color={semanticColors[type]}>
      { children }
      <Button color={semanticColors[type]} remove onClick={ handleDelete }/>
    </Tag>
  </Tag.Group>
}
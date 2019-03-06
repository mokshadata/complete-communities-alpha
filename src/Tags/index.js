import React from 'react'
import { Tag, Button } from 'react-bulma-components'

import { semanticColors } from '../colors'

export function FilterTag({ type, children, handleDelete }){
  return <Tag color={semanticColors[type]}>
    { children }
    <Button color={semanticColors[type]} remove onClick={(event) => {
      event.preventDefault()
      handleDelete()
    }}/>
  </Tag>
}

export function LabelTag({ type, children, handleToggle }){
  return <Tag color={semanticColors[type]} onClick={(event) => {
    event.preventDefault()
    handleToggle()
  }}>
    { children }
  </Tag>
}
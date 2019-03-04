import React from 'react'
import { Tag, Card, Content, Heading } from 'react-bulma-components'

import { pickBy, keys, pipe, equals } from 'ramda'

export function Project({ project }) {

  // put these into the store eventually
  const eligiblePrograms = pipe(
    pickBy(
      equals(true),
    ),
    keys,
  )( project )

  return (
    <Card>
      <Card.Header>
        <Card.Header.Title>{ project.Goal }</Card.Header.Title>
      </Card.Header>
      <Card.Content>
        <Content>
          <Heading size={5}>
            { project.Projects }
          </Heading>
          <p>{ project['Action Steps']}</p>
          <Tag.Group>
            <Tag>
              { project.Section }
            </Tag>
            {
              eligiblePrograms.map((program, index) => (
                <Tag key={ index }>{ program }</Tag>
              ))
            }
          </Tag.Group>
          {
            project['OZ Eligible'] === ""? null :
              (<Tag.Group gapless>
                <Tag color="primary">OZ Eligible</Tag>
                <Tag>{ project['OZ Eligible'] }</Tag>
              </Tag.Group>)
          }
        </Content>
      </Card.Content>
    </Card>
  )
}
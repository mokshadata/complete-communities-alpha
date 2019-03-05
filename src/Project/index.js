import React from 'react'
import { Tag, Card, Content, Heading } from 'react-bulma-components'

import { pickBy, keys, pipe, equals } from 'ramda'

export function Project({ project }) {

  return (
    <Card style={{marginBottom: '2rem'}}>
      <Card.Header>
        <Card.Header.Title>{ project.Goal }</Card.Header.Title>
      </Card.Header>
      <Card.Content>
        <Content>
          <Heading size={5}>
            { project.Projects }
          </Heading>
          <ul>{ project.steps.map((step, index) => <li key={index}>{step}</li>)}</ul>
          <Tag.Group>
            <Tag>
              { project.Section }
            </Tag>
            {
              project.eligiblePrograms.map((program, index) => (
                <Tag key={ index }>{ program }</Tag>
              ))
            }
          </Tag.Group>
          {
            project['neighborhood'] === ""? null :
              (<Tag.Group gapless>
                <Tag>Neighborhood</Tag>
                <Tag color="warning">{ project['neighborhood'] }</Tag>
              </Tag.Group>)
          }
        </Content>
      </Card.Content>
    </Card>
  )
}
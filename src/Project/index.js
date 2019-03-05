import React from 'react'
import { Tag, Card, Content, Heading, Panel } from 'react-bulma-components'
import './metric.css'
import { isEmpty } from 'ramda'

export function Metrics({metrics}) {
  return (<div className='metrics-list'>
    <Heading size={5}>
      Metrics
    </Heading>
    {
      metrics.map((metric, index) => (
        <div className='metrics-list--item' key={index}>
          <p className='metrics-list--by'>{ metric.year || '????' }</p>
          <p className='metrics-list--metric'>{metric.metric}</p>
          {metric.now? <p className='metrics-list--now'>{metric.now}</p> : null}
          {metric.source? <p className='metrics-list--source'>{metric.source}</p> : null}
        </div>
      ))
    }
  </div>)
}


export function Project({ project }) {

  return (
    <Card style={{marginBottom: '2rem'}}>
      <Card.Header>
        <Card.Header.Title>
          { project.Goal }
          <Tag color='info' style={{position: 'absolute', right: '1em'}}>
            { project.Section }
          </Tag>
        </Card.Header.Title>
      </Card.Header>
      <Card.Content>
        <Content>
          <Heading size={5} style={{marginBottom: '0.25em'}}>
            { project.Projects }
          </Heading>
          <ul>{ project.steps.map((step, index) => <li key={index}>{step}</li>)}</ul>
          {isEmpty(project.metrics)? null : <Metrics metrics={project.metrics}/>}
          <Heading size={5} style={{marginBottom: '0.25em'}}>Eligible Programs</Heading>
          <Tag.Group>
            {
              project.eligiblePrograms.map((program, index) => (
                <Tag color='primary' key={ index }>{ program }</Tag>
              ))
            }
          </Tag.Group>
          <Heading size={5} style={{marginBottom: '0.25em'}}>Neighborhood</Heading>
          {
            project['neighborhood'] === ''? null :
              (<Tag color='warning'>{ project['neighborhood'] }</Tag>)
          }
        </Content>
      </Card.Content>
    </Card>
  )
}
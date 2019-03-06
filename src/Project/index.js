import React from 'react'
import { Tag, Card, Content, Heading } from 'react-bulma-components'
import './metric.css'
import { isEmpty, omit, values, map } from 'ramda'

export function Metrics({ metrics }) {
  return (<div className='metrics-list project--section'>
    <Heading size={6}>
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

export function ListTags({ sectionName, list, color = 'light' }) {
  return (<div className='project--section'>
    <Heading size={6} style={{marginBottom: '0.25em'}}>{ sectionName }</Heading>
    <Tag.Group>
      {
        (isEmpty(list) && <i>to be determined</i>) ||
        list.map((item, index) => (
          <Tag key={ index } color={color} className='is-medium'>{ item }</Tag>
        ))
      }
    </Tag.Group>
  </div>)
}

export function Steps({ steps }){
  return (<ul className='project-steps project--section'>
    { steps.map((step, index) => <li key={index}>{step}</li>)}
  </ul>)
}

export function makeSearchable(thing) {
  return JSON.stringify(values(thing))
    .replace(/{|}|\:|\[|\]|"|\,/g, ' ')
}

export function getSearchableContent(project) {
  const metricsSearchable = map(makeSearchable, project.metrics).join(' ')
  return makeSearchable(omit(['id', 'metrics'], project)) + ' ' + metricsSearchable
}

export function Project({ project, isActive = false, makeActive }) {

  return (
    <Card
      className={`project ${isActive && 'active'}`}
      data-jets={getSearchableContent(project).toLowerCase()}
      style={{marginBottom: '2rem'}}
      onClick={makeActive}>
      <Card.Header>
        <Card.Header.Title>
          { project.Goal }
          <Tag.Group  style={{position: 'absolute', right: '1em'}}>
            <Tag color='info' style={{marginBottom: 0}}>
              { project.Section }
            </Tag>
            <Tag color='warning' style={{marginBottom: 0}}>
              { project['neighborhood'] }
            </Tag>
          </Tag.Group>
        </Card.Header.Title>
      </Card.Header>
      <Card.Content>
        <Content>
          <Heading size={5}>
            { project.Projects }
          </Heading>
          {isActive? <Steps steps={project.steps}/> : null}
          {(isActive && !isEmpty(project.metrics))? <Metrics metrics={project.metrics}/> : null}
          <ListTags
            sectionName='Eligible Programs'
            list={project.eligiblePrograms}
            color='primary'
          />
          {isActive && <ListTags
            sectionName='Potential Programs'
            list={project['Potential Programs']}
          />}
          {isActive && <ListTags
            sectionName='Lead Partners'
            list={project['Lead Partners']}
          />}
          {isActive && <ListTags
            sectionName='Support Partners'
            list={project['Support Partners']}
          />}
        </Content>
      </Card.Content>
    </Card>
  )
}
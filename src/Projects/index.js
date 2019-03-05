import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchProjects } from './duck'
import { Project } from '../Project'
import { Heading } from 'react-bulma-components'
import { neighborhoods } from '../redux/constants'
import { filter, concat, includes, identity, toPairs, reduce, map, pipe, reject, not, curry, equals, addIndex } from 'ramda'

const filterFns = {
  neighborhood: (value, project) => (neighborhoods[value] === project.neighborhood),
  oz: (value, project) => (value && includes('Opportunity Zone', project.eligiblePrograms || [])) || (!value && true),
}

const quickProjectFilter = curry(
  (filters, projects) => {
    return pipe(
      toPairs,
      reduce((acc, [filterName, value]) => (
        concat(acc)(filter(curry(filterFns[filterName])(value))(projects))
      ), []),
    )(filters)
  }
)

const mapIndexed = addIndex(map)


export class Projects extends Component {
  componentWillMount() {
    this.props.fetchProjects()
  }
  render() {
    const projects = quickProjectFilter(this.props.filters)(this.props.projects)
    return (
        <div>
          <Heading>Projects</Heading>
          <div style={{
              height: 'calc(100vh - 160px)',
              overflow: 'auto',
              padding: '1px',
            }}>
              {
                mapIndexed((project, index) => {
                  return <Project
                    project={project}
                    key={index}
                  />
                })(projects)
              }
            </div>
        </div>
    )
  }
}

export default connect(
  ( {
      projects: { items = [], filters },
    } ) => ({ projects: items, filters }),
  { fetchProjects },
)(Projects)

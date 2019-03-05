import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchProjects } from './duck'
import { Project } from '../Project'
import { Heading } from 'react-bulma-components'
import { neighborhoods } from '../redux/constants'
import { filter, map, pipe, reject, not, curry, equals, addIndex } from 'ramda'

const quickProjectFilter = curry(
  (filters, projects) => {
    if (!filters.neighborhood){return projects}
    return filter(
      (project) => {
        return neighborhoods[filters.neighborhood] === project.neighborhood
      })(projects)
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

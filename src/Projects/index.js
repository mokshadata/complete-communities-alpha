import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchProjects } from './duck'
import { Project } from '../Project'
import { Heading } from 'react-bulma-components'

export class Projects extends Component {
  componentWillMount() {
    this.props.fetchProjects()
  }
  render() {
    return (
        <div>
          <Heading>Projects</Heading>
          {
            this.props.projects.map(
              (project, index) => (
                <Project
                  project={project}
                  key={index}
                />
              )
            )
          }
        </div>
    )
  }
}

export default connect(
  ( { projects: { items = [] } } ) => ({ projects: items }),
  { fetchProjects },
)(Projects)

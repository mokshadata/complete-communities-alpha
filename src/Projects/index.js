import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchProjects } from './duck'
import { Project } from '../Project'
import { Heading } from 'react-bulma-components'
import { neighborhoods } from '../redux/constants'

export class Projects extends Component {
  componentWillMount() {
    this.props.fetchProjects()
  }
  render() {
    return (
        <div>
          <Heading>Projects</Heading>
          {
            this.props.projects.filter((project) => {
              if (!this.props.filters.neighborhood) { return true }
              return neighborhoods[this.props.filters.neighborhood] === project.neighborhood
            }).map(
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
  ( {
      projects: { items = [], filters },
    } ) => ({ projects: items, filters }),
  { fetchProjects },
)(Projects)

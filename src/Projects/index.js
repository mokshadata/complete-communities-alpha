import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchProjects } from './duck'

class Projects extends Component {
  componentWillMount() {
    this.props.fetchProjects()
  }
  render() {
    return (
      <div>
        <h1>Hello</h1>
        {
          this.props.projects
            .map((project) => (<h1>{project.Goal}</h1>))
        }
      </div>
    )
  }
}

export default connect(
  ( { projects: { items = [] } } ) => ({ projects: items }),
  { fetchProjects },
)(Projects)

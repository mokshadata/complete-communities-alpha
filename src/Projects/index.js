import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchProjects, setActive } from './duck'
import { Project } from '../Project'
import { Heading } from 'react-bulma-components'
import { neighborhoods } from '../redux/constants'
import { filter, concat, includes, invertObj, toPairs, reduce, map, pipe, reject, not, curry, equals, addIndex } from 'ramda'

const neighborhoodNameToValue = invertObj(neighborhoods)

const filterFns = {
  neighborhood: (value, project) => (neighborhoods[value] === project.neighborhood),
  oz: (isOZ, project) => (isOZ && includes('Opportunity Zone', project.eligiblePrograms || [])) || (!isOZ && true),
  neighborhoods: (activeNeighborhoods, project) => (includes(neighborhoodNameToValue[project.neighborhood], activeNeighborhoods)),
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
    const projects = quickProjectFilter(this.props.activeFilters)(this.props.projects)
    return (
        <div>
          <Heading>Opportunities</Heading>
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
                    makeActive={() => this.props.setActive(project)}
                    isActive={this.props.active === project.id}
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
      projects: { items = [], activeFilters, active },
    } ) => ({ projects: items, activeFilters, active }),
  { fetchProjects, setActive },
)(Projects)

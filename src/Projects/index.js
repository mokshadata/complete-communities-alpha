import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchProjects, setActive } from './duck'
import { Project } from '../Project'
import { neighborhoods } from '../redux/constants'
import {
  filter,
  includes,
  invertObj,
  toPairs,
  reduce,
  map,
  pipe,
  curry,
  addIndex,
} from 'ramda'
import { Form } from 'react-bulma-components'
const {
  Field,
  Input,
} = Form
const neighborhoodNameToValue = invertObj(neighborhoods)

const filterFns = {
  neighborhoods: (activeNeighborhoods, project) => (includes(neighborhoodNameToValue[project.neighborhood], activeNeighborhoods)),
  oz: (isOZ, project) => (isOZ && includes('Opportunity Zone', project.eligiblePrograms || [])) || (!isOZ && true),
}

const quickProjectFilter = curry(
  (filters, projects) => {
    return pipe(
      toPairs,
      reduce((acc, [filterName, value]) => (
        filter(curry(filterFns[filterName])(value))(acc)
      ), projects),
    )(filters)
  }
)

const mapIndexed = addIndex(map)

export function FilteredProjects(props) {
  const projects = quickProjectFilter(props.activeFilters)(props.projects)
  return (<div id='projects'
    style={{
      height: 'calc(100vh - 160px)',
      overflow: 'auto',
      padding: '1px',
    }}>
    {
      mapIndexed((project) => {
        return <Project
          project={project}
          key={project.id}
          makeActive={() => props.setActive(project)}
          isActive={props.active === project.id}
        />
      })(projects)
    }
  </div>)
}

const ConnectedFilteredProjects = connect(
  ( {
      projects: { items = [], activeFilters, active },
    } ) => ({ projects: items, activeFilters, active }),
  { setActive },
)(FilteredProjects)

export class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: ''
    }
  }
  updateSearch = (event) => {
    this.setState({
      search: event.target.value,
    })
  }
  render() {
    return (<div>
      <style>
        {this.state.search && `#projects>:not([data-jets*="${this.state.search.toLowerCase()}"]){display:none}`}
      </style>
      <Field><Input
        placeholder='Find your opportunity...'
        type='search'
        className='is-large'
        id='projects-search'
        value={this.state.search}
        onChange={this.updateSearch}
      /></Field>
    </div>)
  }
}

export class Projects extends Component {
  componentWillMount() {
    this.props.fetchProjects()
  }
  render() {
    return (
        <div>
          <Search/>
          <ConnectedFilteredProjects/>
        </div>
    )
  }
}

export default connect(
  null,
  { fetchProjects },
)(Projects)

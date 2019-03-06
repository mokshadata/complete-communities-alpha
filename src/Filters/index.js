import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchNeighborhoods } from './duck'
import { setFilter } from '../Projects/duck'

import Switch from 'react-bulma-switch/lib'
import { Heading, Tag } from 'react-bulma-components'
import { neighborhoods } from '../redux/constants'

import { Map } from '../Map'
import { FilterTag } from '../Tags'

import { append, reject, equals, includes } from 'ramda'

export class Filters extends Component {
  componentWillMount() {
    this.props.fetchNeighborhoods()
  }
  toggleNeighborhood = (neighborhood) => {
    const activeNeighborhoods = this.props.activeFilters.neighborhoods
    const hasNeighborhood = includes(neighborhood, activeNeighborhoods)

    const updatedNeighborhoods = (
      (hasNeighborhood && reject(equals(neighborhood))) ||
      append(neighborhood)
    )(activeNeighborhoods)

    this.props.setFilter({
      neighborhoods: updatedNeighborhoods,
    })
  }
  toggleOZ = () => {
    this.props.setFilter({
      oz: !this.props.activeFilters.oz
    })
  }
  render() {
    return (
      <div style={{position: 'relative'}}>
        <Map
          data={this.props.neighborhoods}
          onShapeClick={this.toggleNeighborhood}
          activeNeighborhoods={this.props.activeFilters.neighborhoods}
        />
        <Heading size={5} style={{
          marginTop: '1rem',
          marginBottom: '0.25rem',
        }}>Filters</Heading>
        <Tag.Group>{
          this.props.activeFilters.neighborhoods
            .map((neighborhood, index) => <FilterTag
              handleDelete={() => this.toggleNeighborhood(neighborhood)}
              key={index}
              type='neighborhood'>
                {neighborhoods[neighborhood]}
              </FilterTag>
            )
        }</Tag.Group>
        <Switch
          value={this.props.activeFilters.oz}
          onChange={this.toggleOZ}
          rounded
          outlined
          >
          Eligible for Opportunity Zone
        </Switch>
        {/* <Field>
          <Label>Name</Label>
          <Control>
            <Input/>
          </Control>
        </Field> */}
      </div>
    )
  }
}

export default connect(
  ( {
      filters: { neighborhoods = {} },
      projects: { activeFilters = {} },
    } ) => ({ neighborhoods, activeFilters }),
  {
    fetchNeighborhoods,
    setFilter,
  },
)(Filters)

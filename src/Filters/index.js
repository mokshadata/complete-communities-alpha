import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchNeighborhoods } from './duck'
import { setFilter } from '../Projects/duck'

import Switch from 'react-bulma-switch/lib'
import { Form, Field, Label, Control, Input, Heading } from 'react-bulma-components'
import { neighborhoods } from '../redux/constants'

import { Map } from '../Map'
import { FilterTag } from '../Tags' 

export class Filters extends Component {
  componentWillMount() {
    this.props.fetchNeighborhoods()
  }
  setNeighborhood = (neighborhood) => {
    this.props.setFilter({
      neighborhood
    })
  }
  toggleOZ = () => {
    this.props.setFilter({
      oz: !this.props.filters.oz
    })
  }
  render() {
    return (
      <div style={{position: 'relative'}}>
        <Map
          data={this.props.neighborhoods}
          onShapeClick={this.setNeighborhood}
          activeNeighborhood={this.props.filters.neighborhood}
        />
        <Heading size={5} style={{
          marginTop: '1rem',
          marginBottom: 0,
        }}>Filters</Heading>
        <form>
          <Switch
            value={this.props.filters.oz}
            onChange={this.toggleOZ}
            >
            OZ Eligible Only
          </Switch>
          {
            this.props.filters.neighborhood? (<FilterTag
              handleDelete={() => this.setNeighborhood(null)}
              type='neighborhood'>{
              neighborhoods[this.props.filters.neighborhood]
            }</FilterTag>) : null
          }
          {/* <Field>
            <Label>Name</Label>
            <Control>
              <Input/>
            </Control>
          </Field> */}
        </form>
      </div>
    )
  }
}

export default connect(
  ( {
      filters: { neighborhoods = {} },
      projects: { filters = {} },
    } ) => ({ neighborhoods, filters }),
  {
    fetchNeighborhoods,
    setFilter,
  },
)(Filters)

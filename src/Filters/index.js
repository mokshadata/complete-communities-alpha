import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchNeighborhoods } from './duck'
import { setNeighborhood } from '../Projects/duck'

import { Form, Field, Label, Control, Input } from 'react-bulma-components'
// import 'leaflet'
// import { Map, TileLayer, Polygon, GeoJSON } from 'react-leaflet'
import { Map } from '../Map'

export class Filters extends Component {
  componentWillMount() {
    this.props.fetchNeighborhoods()
  }
  setNeighborhood = (neighborhood) => {
    this.props.setNeighborhood(neighborhood)
  }
  render() {
    return (
      <div style={{position: 'relative'}}>
        <Map
          data={this.props.neighborhoods}
          onShapeClick={this.setNeighborhood}
          activeNeighborhood={this.props.filters.neighborhood}
        />
        <form>
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
  { fetchNeighborhoods, setNeighborhood },
)(Filters)

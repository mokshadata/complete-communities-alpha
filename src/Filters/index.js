import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchNeighborhoods } from './duck'
import { setNeighborhood } from '../Projects/duck'

import { Form, Field, Label, Control, Input } from 'react-bulma-components'
import 'leaflet'
import { Map, TileLayer, Polygon } from 'react-leaflet'

export class Filters extends Component {
  componentWillMount() {
    this.props.fetchNeighborhoods()
  }
  setNeighborhood = (neighborhood) => {
    this.props.setNeighborhood(neighborhood)
  }
  render() {
    return (
      <div>
        <Map
          center={[ 29.8, -95.4 ]}
          zoom={11}
          style={{
            height: '400px',
            maxWidth: '432px',
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
            subdomains='abcd'
          />
          {
            this.props.neighborhoods.map((feature, index) => {
              const positions = feature.geometry.coordinates[0].map((pos) => pos.reverse())
              return (
                <Polygon
                  color="purple"
                  weight={1}
                  positions={positions}
                  key={index}
                  onClick={() => this.setNeighborhood(feature.properties.SNBNAME)}
                />
              )
            })
          }
        </Map>
        {/* {this.props.filters.neighborhood} */}
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
      filters: { neighborhoods = [] },
      projects: { filters = {} },
    } ) => ({ neighborhoods }),
  { fetchNeighborhoods, setNeighborhood },
)(Filters)

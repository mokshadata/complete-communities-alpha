import React, { Component } from 'react'
import { StaticMap } from 'react-map-gl'
import DeckGL, { GeoJsonLayer, MapController } from 'deck.gl'
import { map, path, includes, indexOf, partition } from 'ramda'
import { neighborhoods } from '../redux/constants'

import { Tag } from 'react-bulma-components'

const options = {
  pickable: true,
  stroked: false,
  filled: true,
  extruded: true,
  lineWidthScale: 20,
  lineWidthMinPixels: 2,
  getRadius: 100,
  getLineWidth: 1,
  getElevation: 30,
  autoHighlight: true,
}

export class Map extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hoveredNeighborhood: {
        x: 0,
        y: 0,
      },
    }
  }

  updateTooltip = ({object, x, y}) => {
    this.setState({
      hoveredNeighborhood: {
        name: neighborhoods[(object && object.properties.SNBNAME)],
        x, y,
      },
    })
  }

  handleClick = ({object}) => {
    this.props.onShapeClick(object && object.properties.SNBNAME)
  }

  render() {
    const viewport = {
      width: '100%',
      height: 400,
      latitude: 29.8,
      longitude: -95.4,
      zoom: 10,
    }

    const [active, inactive] = partition(
      (layer) => includes(path(['properties', 'SNBNAME'])(layer), this.props.activeNeighborhoods)
    )(this.props.data.features)

    const activeLayers = {
      features: active,
      type: 'FeatureCollection',
    }

    const inactiveLayers = {
      features: inactive,
      type: 'FeatureCollection',
    }
    
    const neighborhoodLayers = map(path(['properties', 'SNBNAME']))(this.props.data.features)

    return (
    <div
      style={{
        height: viewport.height
      }}>
      <DeckGL
        controller={true}
        initialViewState={viewport}
        {...viewport}
      >
        {
          <Tag color='warning' style={{
            position: 'absolute',
            left: this.state.hoveredNeighborhood.x + 10,
            top: this.state.hoveredNeighborhood.y - 20,
            zIndex: 2,
            pointerEvents: 'none',
            display: (this.state.hoveredNeighborhood.name && 'block') || 'none',
          }}>
            {this.state.hoveredNeighborhood.name}
          </Tag>
        }
        <GeoJsonLayer
          id='active-neighborhoods'
          data={activeLayers}
          {...options}
          getFillColor={[255, 221, 87, 255]}
          highlightColor={[255, 221, 87, 200]}
          onClick={this.handleClick}
          onHover={this.updateTooltip}
        />
        <GeoJsonLayer
          id='inactive-neighborhoods'
          data={inactiveLayers}
          {...options}
          getFillColor={[160, 160, 180, 200]}
          onClick={this.handleClick}
          onHover={this.updateTooltip}
        />
        <StaticMap
          {...viewport}
          mapOptions={{
            style: 'mapbox://styles/mapbox/streets-v10',
          }}
        />
      </DeckGL>
    </div>)
  }
}

import React, { Component } from 'react'
import ReactMapGL from 'react-map-gl'
import DeckGL, { GeoJsonLayer, MapController } from 'deck.gl'
import { map, path, indexOf } from 'ramda'

export class Map extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hoveredNeighborhood: null,
    }
  }

  render() {
    const viewport = {
      width: '100%',
      height: 400,
      latitude: 29.8,
      longitude: -95.4,
      zoom: 10,
    }

    const neighborhoodLayers = map(path(['properties', ['SNBNAME']]))(this.props.data.features)

    return (
      <DeckGL
        controller={{ type: MapController }}
        {...viewport}
      >
        <GeoJsonLayer
          id='neighborhoods-layer'
          data={this.props.data}
          pickable={true}
          stroked={false}
          filled={true}
          extruded={true}
          highlightedObjectIndex={indexOf(
            this.props.activeNeighborhood ||
            this.state.hoveredNeighborhood
          )(neighborhoodLayers)}
          lineWidthScale={20}
          lineWidthMinPixels={2}
          getFillColor={[160, 160, 180, 200]}
          getRadius={100}
          getLineWidth={1}
          getElevation={30}
          onClick={({object, x, y}) => {
            const tooltip = (object && object.properties.SNBNAME)
            if (tooltip === this.props.activeNeighborhood) {
              this.props.onShapeClick(null)
            } else {
              this.props.onShapeClick(tooltip)
            }
          }}
          onHover={({object}) => {
            this.setState({
              hoveredNeighborhood: (object && object.properties.SNBNAME),
            })
          }}
        />
        <ReactMapGL
          {...viewport}
          mapOptions={{
            style: 'mapbox://styles/mapbox/streets-v10',
          }}
        />
      </DeckGL>
    )
  }
}

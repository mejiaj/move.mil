
import React, { Component }  from 'react';
import { Map, TileLayer, Marker, Polyline } from 'react-leaflet'
import * as _ from 'lodash';

class ResultMap extends Component {

    markerComponent = () =>{
      return (
        _.map(this.props.map.coords, (coord, i)=>{
          return (
            <Marker position={coord} key={i}>
            </Marker>
          )
        })
      )
    }

    render() {
       let polylinePos = [this.props.map.coords.origin, this.props.map.coords.destination];
       let bounds = [
         [
          this.props.map.coords.destination[0],
          this.props.map.coords.destination[1]
         ],
         [
          this.props.map.coords.origin[0],
          this.props.map.coords.origin[1]
         ]
        ]
       let lineColor = 'blue';
       let zoom = 13;
        return (
          <Map center={this.props.map.center} zoom={zoom} id="map-container" bounds={bounds}>
            <TileLayer
              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {this.markerComponent()}
            <Polyline positions={polylinePos} color={lineColor}/>
          </Map>
        )
      }
}

export default ResultMap;

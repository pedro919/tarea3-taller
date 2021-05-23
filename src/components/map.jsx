import React, { Component } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import './map.css';
import './panel.css';




class Map extends Component {
    constructor(props){
        super(props);
        this.state = {socket: undefined, chat: [], posicion: [], vuelos: [], name: null, message: null};
    }
    

    clickHandler(){
        console.log("Ha sido apretado");
        return(
                <p>
                    Perro no se donde va a aparecer esta wea
                </p>)
               
    }


    render(){
    const position = [51.505, -0.09]
        return (
            <div>
                <MapContainer center={position} zoom={3} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} eventHandlers={{click: () => {this.clickHandler()}}}>
                    <Popup>
                        Buena choro galaxia
                    </Popup>
                    
                </Marker>
                </MapContainer>
            </div>
                )
        }
}
 
export default Map;
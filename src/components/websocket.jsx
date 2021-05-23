import { MapContainer, TileLayer, Polyline, Tooltip, Circle } from 'react-leaflet';
import React, { Component } from 'react';
import './map.css';
import './panel.css'
import "bootstrap/dist/css/bootstrap.css";
import moment from "moment";


class Websocket extends Component {
    constructor(props){
        super(props);
        this.state = {socket: undefined, chat:[], posicion: [], vuelos: [], name:null, message:null, connected:false, actual:{}};
    }

    componentDidMount(){
        const io = require("socket.io-client");
        var socket = io.connect('wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl', {path: '/flights'});
        this.setState({socket: socket});
        //console.log("ESCUCHANDO");
        socket.emit("FLIGHTS");
        //socket.on("POSITION", function(data){console.log('Got announcement:', data)});
        socket.on('POSITION', ({code, position}) => {this.setState({posicion:this.state.posicion.concat({code, position})})});
        socket.on('FLIGHTS', (data) => {this.setState({vuelos: this.state.vuelos.concat(data)})});
        
        socket.on('CHAT', ({name, date, message}) => this.setState({chat: this.state.chat.concat({name, date, message})}));
        let nombrePrueba = "pedro919";
        let mensajePrueba = "Buena los cabros";
        socket.emit("CHAT", {nombrePrueba, mensajePrueba});
        //console.log(this.state.chat);
    
        //console.log(this.state.vuelos);
        //console.log(this.state.posicion);
        //console.log("FIN DATOS");

    }

    componentWillUnmount(){
        this.state.socket.close()
    }

    updateActual({code, position}){
        //console.log("Entró ctm");
        //console.log(code);
        //console.log(position);
        //this.setState({actual:this.state.actual[code] = position});
    }



    planeinfo(codigo){
        let vuelo = this.state.vuelos.find(element => element.code === codigo);
        if (typeof(vuelo) == undefined){
            return "Undefined"
        }
        if (typeof(vuelo)!= "undefined"){
            return (
                <div>
                    <b>Code:</b> {vuelo.code}
                    <br></br>
                    <b>Airline:</b> {vuelo.airline}
                    <br></br>
                    <b>Plane:</b> {vuelo.plane}
                    <br></br>
                    <b>Seats:</b>{vuelo.seats}
                    <br></br>
                    <b>Passengers:</b>
                    {vuelo.passengers.map((pas) =>{
                        return (
                            <div key={pas.name}>{pas.name}, {pas.age}</div>
                        )
                    })}
                </div>
                );
        }
        return "a"
        
    }

    submitMessage(event){
        event.preventDefault();
        //console.log({name: this.state.name, message: this.state.message});
        this.state.socket?.emit("CHAT", {name: this.state.name, message: this.state.message});
        //console.log(Object.keys(this.state.actual));
        //console.log(this.state.actual["0"]);
    }

    changeMessage(event){
        //console.log(event.target.value);
        this.setState({message: event.target.value});
    }

    changeName(event){
        //console.log(event.target.value);
        this.setState({name:event.target.value});
    }

    submitName(event){
        event.preventDefault();
        this.setState({connected:true});
    }

    render() {         
        const position = [0, 0];
        const {posicion, vuelos, chat, name} = this.state;
        const limeOptions = { color: 'black' }

        return ( <div>
                    {this.state.connected ?                    
                    <div>
                        <div>
                            <MapContainer center={position} zoom={3} scrollWheelZoom={false}>
                                    <TileLayer
                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />

                                    {vuelos.map((dat) => {
                                        return (
                                            <div key={dat.code}>
                                            <Polyline pathOptions={limeOptions} positions={[dat.origin, dat.destination]} />
                                            </div>
                                        )
                                    })}
                                
                                    {posicion.map((data) => {
                                        return (
                                            
                                            <div key={data.position}>
                                                <Circle center={data.position} radius={100}>
                                                    <Tooltip>
                                                        {this.planeinfo(data.code)}                                
                                                    </Tooltip>
                                                </Circle>
                                            </div>
                                        )})}
                            
                            </MapContainer>
                        </div>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12 mt-4 mb-4">
                                    <h6>Hello {name}</h6>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-8">
                                    <h6>Messages</h6>
                                    <div id="messages">
                                        {chat.map((msj) => {
                                            return (
                                                <div className="row mb-2" key={msj.date}>
                                                    <div className="col-md-3">{moment(msj.date).format("h:mm:ss a")}</div>
                                                    <div className="col-md-2">{msj.name}</div>
                                                    <div className="col-md-2">{msj.message}</div>
                                                </div>)
                                                })}                                
                                     </div>
                                    <form id="form" onSubmit= {(e, value) => {this.submitMessage(e)}}>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="message"                                    
                                                id="chatbox"
                                                onChange = {(e, value) => {this.changeMessage(e)}}
                                            />
                                            <span className="input-group-btn">
                                                <button id="submit" type="submit" className="btn btn-primary">
                                                    Send
                                                </button>
                                            </span>
                                        </div>
                                    </form>                            
                                </div>
                             </div>
                        </div>
                    </div>


                :
                <div style={{ padding: '200px 40px' }}>
                    <form onSubmit = { (e, value)=> this.submitName(e)}>
                        <div className="input-group">
                        <input
                            type="text"
                            className="message"                                    
                            id="username"
                            placeholder = "Enter User Name"
                            onChange = { (e, value)=> this.changeName(e)}                                              
                        />
                        <span className="input-group-btn">
                            <button id="submit" type="submit" className="btn btn-primary">
                                Enter
                            </button>
                        </span>
                        </div>
                    </form>
                </div>}
                    
    
                </div> );
    }
}
 
export default Websocket;
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Client, Message } from 'react-native-paho-mqtt';

const myStorage = {
    setItem: (key, item) => {
      myStorage[key] = item;
    },
    getItem: (key) => myStorage[key],
    removeItem: (key) => {
      delete myStorage[key];
    },
  };

export default function Options() {
    
    const [temperaturaIdeal, setTemperaturaIdeal] = useState(0);
    const [temperaturaTemp, setTemperaturaTemp] = useState(0);
    const [dioxidoTemp, setDioxidoTemp] = useState(0);
    const [dioxidoIdeal, setDioxidoIdeal] = useState(0);

    //Creacion de cliente
    const myUri = "ws://broker.emqx.io:8083/mqtt"
    const clientId = () => {
        const min = 1;
        const max = 1000;
        var rand = Math.floor(min + Math.random() * (max - min)) + 1;
        var randString = "" + rand
        return randString;
    }
    const topic = "ejemplomqtt/mbaaaam/options";
    const client = new Client({ uri: myUri, clientId: clientId(), storage: myStorage});

    //Eventos de cliente
    client.on('connectionLost', (responseObject) => {
        if (responseObject.errorCode !== 0) {
            console.log(responseObject.errorMessage);
        }
    });
    
    client.on('messageReceived', (message) => {
        //Evento que maneja el mensaje recibido.
        //setMensaje(parseAndSetMqttData(message.payloadString));
    });

    //Despues de que el componente 'Home' se monta o renderiza, se ejecuta lo siguiente:
    useEffect(() => {
        client.connect()
        .then(() => {
            console.log('onConnect');
            return client.subscribe(topic);
        })
        .catch((responseObject) => {
            if (responseObject.errorCode !== 0) {
            console.log('onConnectionLost:' + responseObject.errorMessage);
            }
        });
        return () => null;
    }, []);

    const sendInitialData = () => {
        const stringMessage = 'temperatura:' + 24 + "\n" + 'ppm:' + 24
        const message = new Message(stringMessage);
        message.destinationName = topic
        client.send(message);
    }

    const sendData = (temp,co2) => {
        //Esta funcion es para simular el envio de datos en la aplicacion, debido a que no se pueden enviar datos desde tinkercad.
        //StringMessage es una variable auxiliar. En esta se construye el mensaje que la simulacion debiese enviar
        const stringMessage = 'temperatura:' + temp + "\n" + 'ppm:' + co2
        const message = new Message(stringMessage);
        message.destinationName = topic
        client.send(message);
    }

    return(
        <View style={styles.container}>
            <Text>Ingresa la temperatura ideal</Text>
            <View style={styles.row}>
                <TextInput 
                    keyboardType='numeric'
                    style={styles.input}
                    placeholder='ej. 40°C'
                    onChangeText={(val)=> setTemperaturaTemp(val)}/>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={()=> setTemperaturaIdeal(temperaturaTemp)}>
                        <Text style={styles.textButton}>Actualizar</Text>
                </TouchableOpacity>
            </View>
            

            <Text>Ingresa el CO2 máximo</Text>
            <View style={styles.row}>
                <TextInput 
                    keyboardType='numeric'
                    style={styles.input}
                    placeholder='ej. 40ppm'
                    onChangeText={(val)=> setDioxidoTemp(val)}/>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={()=> setDioxidoIdeal(dioxidoTemp)}>
                        <Text style={styles.textButton}>Actualizar</Text>
                    </TouchableOpacity>
            </View>

            <Text>Temperatura Ideal: {temperaturaIdeal}°C, CO2 Máximo: {dioxidoIdeal}ppm</Text>
            <View>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={()=> sendData(temperaturaIdeal,dioxidoIdeal)}>
                        <Text style={styles.textButton}>Guardar</Text>
                    </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxTemp:{
        flex: 1,
        backgroundColor:'#efefef',
        borderStyle:'solid',
        borderWidth: 1,
        borderColor: 'black'
    },
    input:{
        borderWidth: 1,
        borderColor: '#777',
        padding: 8,
        margin: 10,
        width: 200,
    },
    button:{
        backgroundColor:'#0fa30f',
        borderStyle:'solid',
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
        padding: 10,
    },
    textButton:{
        color: 'white',
    },
    row:{
        flexDirection: 'row',
    }
});
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

export default function Home({navigation}) {
    const [temperaturaActual, setTemperaturaActual] = useState(0);
    const [gasCO2Actual, setGasCO2Actual] = useState(0);
    const [mensaje, setMensaje] = useState('');
    
    useEffect(() => {
        const interval = setInterval(()=>{
            tickTemp();
            tickCO2lecture();
        }, 1000);
        client.connect()
        .then(() => {
            // Once a connection has been made, make a subscription and send a message.
            console.log('onConnect');
            return client.subscribe(topic);
        })
        .then(() => {
            const message = new Message('Magico');
            message.destinationName = topic;
            client.send(message);
        })
        .catch((responseObject) => {
            if (responseObject.errorCode !== 0) {
            console.log('onConnectionLost:' + responseObject.errorMessage);
            }
        });
        return () => clearInterval(interval);
    }, []);

    const tickTemp = () => {
        var newTemp = getTemperaturaActual()
        setTemperaturaActual(newTemp);
    }
    const tickCO2lecture = () => {
        var newCO2lecture = getGasCO2Actual();
        setGasCO2Actual(newCO2lecture);
    }

    const getTemperaturaActual = () => {
        //to-do: comunicar la aplicacion con tinkercad usando mqtt(?)
        const min = 1;
        const max = 100;
        var rand = min + Math.random() * (max - min);
        return rand;
    }
    const getGasCO2Actual = () => {
        //to-do: comunicar la aplicacion con tinkercad usando mqtt(?)
        const min = 1;
        const max = 100;
        var rand = min + Math.random() * (max - min);
        return rand;
    }

    const myUri = "ws://broker.emqx.io:8083/mqtt"
    const clientId = () => {
        const min = 1;
        const max = 1000;
        var rand = Math.floor(min + Math.random() * (max - min)) + 1;
        var randString = "" + rand
        return randString;
    }
    const topic = "ejemplomqtt/mbaaaam";
    // Create a client instance
    const client = new Client({ uri: myUri, clientId: clientId(), storage: myStorage});
    
    // set event handlers
    client.on('connectionLost', (responseObject) => {
    if (responseObject.errorCode !== 0) {
        console.log(responseObject.errorMessage);
    }
    });
    client.on('messageReceived', (message) => {
        setMensaje(message.payloadString);
    });

    return (
        <View style={styles.container}>
            <Text>Temperatura actual</Text>
            <View style={styles.boxTemp}>
                <Text>{temperaturaActual}</Text>
            </View>
            <Text>CO2 actual</Text>
            <View style={styles.boxTemp}>
                <Text>{gasCO2Actual}</Text>
            </View>
            <Text>mensaje</Text>
            <View style={styles.boxTemp}>
                <Text>{mensaje}</Text>
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={()=> navigation.navigate('Options')}
            >
                <Text>Opciones</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
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
        flex: 2,
        backgroundColor:'#efefef',
        borderStyle:'solid',
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
        padding: 10
    },
    button:{
        backgroundColor:'#0fa30f',
        borderStyle:'solid',
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
        padding: 10
    }
});

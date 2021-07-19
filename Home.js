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
    //Variables de estado, para cambiar dinamicamente los valores en la aplicacion.
    const [temperaturaActual, setTemperaturaActual] = useState(0);
    const [gasCO2Actual, setGasCO2Actual] = useState(0);
    const [mensaje, setMensaje] = useState({
        temperatura: '',
        gasCO2Actual: ''
    });

    //Creacion de cliente
    const myUri = "ws://broker.emqx.io:8083/mqtt"
    const clientId = () => {
        const min = 1;
        const max = 1000;
        var rand = Math.floor(min + Math.random() * (max - min)) + 1;
        var randString = "" + rand
        return randString;
    }
    const topic = "ejemplomqtt/mbaaaam";
    const client = new Client({ uri: myUri, clientId: clientId(), storage: myStorage});

    //Eventos de cliente
    client.on('connectionLost', (responseObject) => {
    if (responseObject.errorCode !== 0) {
        console.log(responseObject.errorMessage);
    }
    });
    client.on('messageReceived', (message) => {
        //Evento que maneja el mensaje recibido.
        setMensaje(parseAndSetMqttData(message.payloadString));
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

    //Funcion que parsea los datos recibidos del mensaje mqtt.
    const parseAndSetMqttData = (input) => {
        var partes = input.split('\n');
        var partesTemperatura = partes[0].split(':');
        var partesGasCO2Actual = partes[1].split(':');
        var auxTemp = partesTemperatura[1];
        var auxGasCO2Actual = partesGasCO2Actual[1]
        setTemperaturaActual(auxTemp);
        setGasCO2Actual(auxGasCO2Actual);
        //Este mensaje es solo para demostracion
        var newMsg = {
            temperatura:auxTemp,
            gasCO2Actual:auxGasCO2Actual
        }
        return newMsg;
    }
    
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
            <Text>Mensaje recibido en topico mqtt</Text>
            <View style={styles.boxTemp}>
                <Text>temp: {mensaje.temperatura} {'\n'}ppm: {mensaje.gasCO2Actual}</Text>
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
        maxHeight: 70,
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

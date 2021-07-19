import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef} from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Switch } from 'react-native';
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

const myStorage_default = {
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
    const [isOpen, setIsOpen] = useState(false);
    const [isPuriferOn, setIsPuriferOn] = useState(false);
    const [mensaje, setMensaje] = useState({
        tempMax:"",
        ppmMax:"",
        isOpen:false,
        isPuriferOn:false
    })
    const firstRun = useRef(true);

    //Creacion de cliente
    const myUri = "ws://broker.emqx.io:8083/mqtt"
    const clientId = () => {
        const min = 30000;
        const max = 39999;
        var rand = Math.floor(min + Math.random() * (max - min)) + 1;
        var randString = "" + rand
        return randString;
    }
    const topic = "ejemplomqtt/mbaaaam/config";
    const client = new Client({ uri: myUri, clientId: clientId(), storage: myStorage});

    const clientId_default = () => {
        const min = 40000;
        const max = 49999;
        var rand = Math.floor(min + Math.random() * (max - min)) + 1;
        var randString = "" + rand
        return randString;
    }
    const topic_default = "ejemplomqtt/mbaaaam/config/default"
    const client_default = new Client({ uri: myUri, clientId: clientId_default(), storage: myStorage_default});

    //Eventos de cliente
    client.on('connectionLost', (responseObject) => {
        if (responseObject.errorCode !== 0) {
            console.log(responseObject.errorMessage);
        }
    });
    
    client.on('messageReceived', (message) => {
        //Evento que maneja el mensaje recibido.
        parseAndSetMqttData(message.payloadString);
    });

    client_default.on('connectionLost', (responseObject) => {
        if (responseObject.errorCode !== 0) {
            console.log(responseObject.errorMessage);
        }
    });

    //Despues de que el componente 'Home' se monta o renderiza, se ejecuta lo siguiente:
    useEffect(() => {
        client.connect()
        .then(() => {
            console.log('client onConnect');
            return client.subscribe(topic);
        })
        .catch((responseObject) => {
            if (responseObject.errorCode !== 0) {
            console.log('onConnectionLost:' + responseObject.errorMessage);
            }
        });
        client_default.connect()
        .then(() => {
            console.log('client_default onConnect');
            return client_default.subscribe(topic_default);
        }).then(() => {
            getDefaultConfig();
        })
        .catch((responseObject) => {
            if (responseObject.errorCode !== 0) {
            console.log('onConnectionLost:' + responseObject.errorMessage);
            }
        });
        return () => {
            client.disconnect()
            client_default.disconnect()
        }
    }, []);

    useEffect(() => {
        if (firstRun.current){
            firstRun.current = false;
            return;
        }
        const message = sendData();
        message.destinationName = topic
        client.connect()
        .then(() => {
            console.log('client onConnect');
            return client.subscribe(topic);
        }).then(() => {
            client.send(message)
        })
        .then(() => {
            Alert.alert("Datos enviados correctamente")
        })
        .catch((responseObject) => {
            if (responseObject.errorCode !== 0) {
            console.log('onConnectionLost:' + responseObject.errorMessage);
            }
        });

        return () => {
            client.disconnect()
        }
    },[mensaje])

    const getDefaultConfig = () => {
        const stringMessage = 'default_config'
        const message = new Message(stringMessage);
        message.destinationName = topic_default
        client_default.send(message);
    }

    const sendData = () => {
        var isOpenSend = "False"
        var isPuriferOnSend = "False";
        if(mensaje.isOpen){
            isOpenSend = "True"
        }
        if(mensaje.isPuriferOn){
            isPuriferOnSend = "True"
        }
        const stringMessage = 'temperaturaMax:' + mensaje.tempMax + "\n" + 'ppmMax:' + mensaje.ppmMax + "\n" + "isOpen:" + isOpenSend + "\n" + "isPuriferOn:" + isPuriferOnSend
        const message = new Message(stringMessage);
        
        return message;
    }

    const prepareMsg = (temp,co2,isOpen,isPuriferOn) => {
        setMensaje({
            tempMax:temp,
            ppmMax:co2,
            isOpen:isOpen,
            isPuriferOn:isPuriferOn
        })
    }

    //Funcion que parsea los datos recibidos del mensaje mqtt.
    const parseAndSetMqttData = (input) => {
        var partes = input.split('\n');
        var partesTemperatura = partes[0].split(':');
        var partesGasCO2Actual = partes[1].split(':');
        var partesIsOpen = partes[2].split(':');
        var partesIsPuriferOn = partes[3].split(':');
        var auxTemp = partesTemperatura[1];
        var auxGasCO2Actual = partesGasCO2Actual[1]
        var auxIsOpen = partesIsOpen[1];
        var auxIsPuriferOn = partesIsPuriferOn[1];
        const parsePyBool = (pyBool) => {
            if(pyBool=="True"){
                return true;
            }
            return false;
        }
        setTemperaturaIdeal(auxTemp);
        setDioxidoIdeal(auxGasCO2Actual);
        setIsOpen(parsePyBool(auxIsOpen));
        setIsPuriferOn(parsePyBool(auxIsPuriferOn))
        
    }
    const toggleSwitch = () => setIsOpen(previousState => !previousState);
    const toggleSwitchPurifer = () => setIsPuriferOn(previousState => !previousState);

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
            <View style={styles.row}>
                <Text>Activar ventanas automaticas: </Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isOpen ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isOpen}
                />
            </View>
            <View style={styles.row}>
                <Text>Activar purificador de aire: </Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isPuriferOn ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitchPurifer}
                    value={isPuriferOn}
                />
            </View>
            <View>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={()=> prepareMsg(temperaturaIdeal,dioxidoIdeal,isOpen,isPuriferOn)}>
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
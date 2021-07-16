import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home({navigation}) {
    const [temperaturaActual, setTemperaturaActual] = useState(0);
    const [gasCO2Actual, setGasCO2Actual] = useState(0);

    useEffect(() => {
        const interval = setInterval(()=>{
            tickTemp();
            tickCO2lecture();
        }, 1000);
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

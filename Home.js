import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
    const [temperaturaActual, setTemperaturaActual] = useState(0);

    useEffect(() => {
        const interval = setInterval(()=>{
            tickTemp();
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const tickTemp = () => {
        var newTemp = getTemperaturaActual()
        setTemperaturaActual(newTemp);
    }

    const getTemperaturaActual = () => {
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
            <StatusBar style="auto" />
        </View>
    );
}

function getTemperaturaActual(){
    //to-do: mock
    return 20;
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
    
});

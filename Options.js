import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Home() {
    
    const [temperaturaIdeal, setTemperaturaIdeal] = useState(0);
    const [temperaturaTemp, setTemperaturaTemp] = useState(0);
    const [dioxidoTemp, setDioxidoTemp] = useState(0);
    const [dioxidoIdeal, setDioxidoIdeal] = useState(0);

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
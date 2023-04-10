import React, {useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

import auth from '@react-native-firebase/auth';

export default function SignIn(){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState(false);

    const navigation = useNavigation();

    async function handleLogin(){
        if(type){
            
            if(name === '' || email === '' || password === ''){
                alert('Preencha todos os campos');
                return;
            }

            auth().createUserWithEmailAndPassword(email, password)
            .then((user) => {
                user.user.updateProfile({
                    displayName: name
                })
                .then(() => {
                    navigation.goBack();
                })
                .catch((error) => {

                    if(error.code === 'auth/email-already-in-use'){
                        alert('Este email já está em uso!');
                    }
                    if(error.code === 'auth/invalid-email'){
                        alert('Email invalido!!');
                    }
                })
            })
         
         
        }else{
            auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                navigation.goBack();
            })
            .catch((error) => {

                if(error.code === 'auth/invalid-email'){
                    alert('Email invalido!!');
                }
            })
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            
            <Text style={styles.logo}>ChatCode</Text>
            <Text style={{marginBottom: 20}}>Converse, , ajude, colabore, faça networking!</Text>

        {type && (

            <TextInput
                style={styles.input}
                value={name}
                placeholder="Nome Completo"
                onChangeText={(text) => setName(text)}
                placeholderTextColor="#99999b"
            />
        )}

         

            <TextInput
                style={styles.input}
                value={email}
                placeholder="Seu email"
                onChangeText={(text) => setEmail(text)}
                placeholderTextColor="#99999b"
            />

            <TextInput
                style={styles.input}
                value={password}
                placeholder="************"
                onChangeText={(text) => setPassword(text)}
                placeholderTextColor="#99999b"
                secureTextEntry={true}
            />

            <TouchableOpacity 
                onPress={handleLogin} 
                style={[styles.btnLogin, {backgroundColor: type ? "#F53745" : "#a33ff4"}]}>
                <Text style={styles.txtLogin}>{type ? 'Cadastrar' : 'Acessar'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setType(!type)}>
                <Text>{type ? "Já possuo uma conta!" : "Criar uma nova conta!"}</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    
    logo: {
        marginTop: Platform.OS === 'android' ? 55 : 80,
        fontSize: 28,
        fontWeight: 'bold'
    },

    input: {
        color: '#121212',
        backgroundColor: '#ebebeb',
        width: '90%',
        borderRadius: 6,
        marginBottom: 10,
        padding: 10,
        fontSize: 16
    },

    btnLogin: {
        padding: 10,
        width: 200,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 3,
    },

    txtLogin: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18
    }
})
import React, {useState} from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native";

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function ModalNewRoom({ setVisible, setUpdateScreen }){
    const [roomName, setRoomName] = useState('');

    const user = auth().currentUser.toJSON();

    function handleButtonCreate(){
        if(roomName === '') return;

        //Deixar apenas cada usuario criar 4 grupos
        firestore().collection('MESSAGE_THREADS')
        .get()
        .then((snapshot) => {
            let myThreads = 0;

            snapshot.docs.map( docItem => {
                if(docItem.data().owner === user.uid){
                    myThreads += 1;
                }
            })

            if(myThreads >= 4){
                alert('Você já atingiu o limite de grupos por usuario.');
            }else{
                createRoom();
            }
        })

    }

    //Criar nova sala no firestore
    function createRoom(){
        firestore()
        .collection('MESSAGE_THREADS')
        .add({
            name: roomName,
            owner: user.uid,
            lastMessage: {
                text: `Grupo ${roomName} criado. Bem Vindo(a)!`,
                createdAt: firestore.FieldValue.serverTimestamp(),
            }
        })
        .then((docRef) => {
            docRef.collection("MESSAGES").add({
                text: `Grupo ${roomName} criado. Bem Vindo(a)!`,
                createdAt: firestore.FieldValue.serverTimestamp(),
                system: true,
            })
            .then(() => {
                setVisible();
                setUpdateScreen();
            })
        })
        .catch((err) => {
            console.error(err);
        })
    }



    return (
        <View style={styles.container}> 

            <TouchableWithoutFeedback onPress={setVisible}>
                <View style={styles.modal}></View>
            </TouchableWithoutFeedback>
         

            <View style={styles.modalContent}>
                <Text style={styles.title}>Criar um novo Grupo?</Text>
                <TextInput
                    style={styles.input}
                    value={roomName}
                    onChangeText={(text) => setRoomName(text)}
                    placeholder="Nome da sua sala?"
                />

                <TouchableOpacity style={styles.buttonCreate} onPress={handleButtonCreate}>
                    <Text style={styles.btnText}>Criar sala</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={setVisible}>
                    <Text>Voltar</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(34,34,34, 0.4)'
    },

    modal:{
        flex: 1,
    },

    modalContent: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        padding: 15,
    },

    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },

    input: {
        borderRadius: 4,
        height: 45,
        backgroundColor: '#DDD',
        marginVertical: 15,
        fontSize: 16,
        paddingHorizontal: 5,
        width: '100%'
    },

    buttonCreate: {
        borderRadius: 4,
        backgroundColor: '#a33ff4',
        height: 45,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    btnText: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: 'bold',
    },

    backButton: {
        marginTop: 10,
        alignItems: 'center'
    }
})
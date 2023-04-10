import React, {useState, useEffect} from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    SafeAreaView, 
    KeyboardAvoidingView, 
    TextInput, 
    Platform, 
    TouchableOpacity 
} from "react-native";

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import ChatMessage from "../../components/ChatMessage";

import Feather from '@expo/vector-icons/Feather';

export default function Messages({ route }){

    const { thread } = route.params;
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const user = auth().currentUser.toJSON();

    useEffect(() => {

        const unsubscribeListener = firestore().collection('MESSAGE_THREADS')
        .doc(thread._id)
        .collection('MESSAGES')
        .orderBy('createdAt', 'desc')
        .onSnapshot( querySnapshot => {
            const messages = querySnapshot.docs.map(doc => {
                const firebaseData = doc.data()

                const data = {
                    _id: doc.id,
                    text: '',
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    ...firebaseData
                }

                if(!firebaseData.system){
                    data.user = {
                        ...firebaseData.user,
                        name: firebaseData.user.displayName
                    }
                }

                return data;
            })

            setMessages(messages);

        })


        return () => unsubscribeListener()

    }, []);

    async function handleSend(){
        if(input === '') return;

        await firestore().collection('MESSAGE_THREADS')
        .doc(thread._id)
        .collection('MESSAGES')
        .add({
            text: input,
            createdAt: firestore.FieldValue.serverTimestamp(),
            user: {
                _id: user.uid,
                displayName: user.displayName
            }
        })

        await firestore().collection('MESSAGES_THREADS')
        .doc(thread._id)
        .set(
            {
                lastMessage: {
                    text: input,
                    createdAt: firestore.FieldValue.serverTimestamp()
                }
            },
            {merge: true}
        )
        setInput('');
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList 
            style={{width: '100%'}}
            data={messages}
            keyExtractor={item => item._id}
            renderItem={({item}) => <ChatMessage data={item}/>}
            inverted={true}
            />


            <View 
                behavior={Platform.OS === 'ios' ? "padding" : "height"}
                style={{width: '100%'}}
                keyboardVerticalOffset={100}
            >
               <View style={styles.containerInput}>
                <View style={styles.mainContainerInput}>
                    <TextInput
                        placeholder="Sua mensagem..."
                        style={styles.textInput}
                        value={input}
                        onChangeText={(text) => setInput(text)}
                        multiline={true}
                        autoCorrect={false}
                    />
                </View>
                <TouchableOpacity onPress={handleSend}>
                    <View style={styles.btnContainer}>
                         <Feather name="send" size={22} color="#FFF"/>
                    </View>
                </TouchableOpacity>
               </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerInput: {
        flexDirection:'row',
        margin: 10,
        alignItems: 'flex-end',
    },
    mainContainerInput: {
        flex: 1,
        flexDirection:'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 25,
        marginRight: 10
    },
    textInput: {
        flex: 1,
        marginHorizontal: 10,
        maxHeight: 130,
        minHeight: 48
    },
    btnContainer: {
        backgroundColor: '#51c880',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        width: 48,
        borderRadius: 25
    }
})
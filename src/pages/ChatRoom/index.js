import React, {useState, useEffect} from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    Modal,
    ActivityIndicator,
    FlatList,
    Alert
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Icon from '@expo/vector-icons/MaterialIcons';

import auth from '@react-native-firebase/auth';
import FabButton from "../../components/FabButton";
import ModalNewRoom from "../../components/ModalNewRoom";
import ChatList from "../../components/ChatList";

import firestore from '@react-native-firebase/firestore';


export default function ChatRoom(){
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const [user, setUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateScreen, setUpdateScreen] = useState(false);



    
    useEffect(() => {
        const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
        
        setUser(hasUser);

    }, [isFocused]);




    useEffect(() => {
        let isActive = true;

        function getChats(){

            firestore().collection('MESSAGE_THREADS')
            .orderBy('lastMessage.createdAt', 'desc')
            .limit(10)
            .get()
            .then((snapshot) => {
                const threads = snapshot.docs.map( (documentSnapshot) => {
                    return {
                        _id: documentSnapshot.id,
                        name: '',
                        lastMessage: { text: '' },
                        ...documentSnapshot.data()
                    }
                })

                if(isActive){
                    setThreads(threads);
                    setLoading(false);
                }
            })          
        }   
        getChats();

        return () => {
            isActive = false;
        }
    },[isFocused, updateScreen])




    function handleSignOut(){  
        auth().signOut()
        .then(() => {
            setUser(null);
            navigation.navigate('SignIn')
        })
        .catch((err) => {
            alert('Não possui nenhum usuario!');
        })
    }

    function deleteRoom(ownerId, idRoom){
        // Se o usuario não for dono da sala criada, não vai conseguir deletar
        if(ownerId !== user?.uid) return;

        Alert.alert(
            "Atenção!",
            "Você tem certeza que deseja deletar essa sala?",
            [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                   text: 'OK',
                   onPress: () =>  handleDeleteRoom(idRoom)
                }
            ]
        )
    }

    async function handleDeleteRoom(idRoom){
        await firestore().collection('MESSAGE_THREADS')
        .doc(idRoom)
        .delete();

        setUpdateScreen(!updateScreen);
    }



    if(loading){
        return (
            <ActivityIndicator size="large" color="#a33ff4"/>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>

                <View style={styles.icone}>
                  { user && (
                    <TouchableOpacity onPress={handleSignOut}>
                        <Icon name="arrow-back" size={28} color="#FFF"/>
                    </TouchableOpacity>
                  )}
                    <Text style={styles.title}>Grupos</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                     <Icon name="search" size={28} color ="#FFF"/>
                </TouchableOpacity>
            </View>

            <FlatList
                data={threads}
                keyExtractor={item => item._id}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                    <ChatList data={item} deleteRoom={ () => deleteRoom(item.owner ,item._id) } userStatus={user}/>
                )}
            />

            <FabButton setVisible={() => setModalVisible(true)} userStatus={user}/>

            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <ModalNewRoom 
                setVisible={ () => setModalVisible(false)}
                setUpdateScreen={() => setUpdateScreen(!updateScreen)}
                />
            </Modal>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#a33ff4',
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
    },

    icone: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    title: {
        paddingLeft: 10,
        fontSize: 25,
        fontWeight: 'bold',
        color: '#FFF'
    }
})
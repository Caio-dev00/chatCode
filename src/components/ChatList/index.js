import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ChatList({data, deleteRoom, userStatus}){
    const navigation = useNavigation();

    function openChat(){
        if(userStatus){
            navigation.navigate('Messages', { thread: data})
        }else{
            navigation.navigate('SignIn')
        }
    }

    return(
        <TouchableOpacity onPress={ openChat } onLongPress={() => deleteRoom && deleteRoom() }>
            <View style={styles.row}>
                <View style={styles.content}>

                    <View style={styles.header}>
                        <Text numberOfLines={1} style={styles.nameTxt}>
                            {data.name}
                        </Text>
                    </View>

                    <Text numberOfLines={1} style={styles.contentText}>
                        {data.lastMessage.text}
                    </Text>

                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(241, 240, 245, 0.5)',
        marginVertical: 4
    },

    content: {
        flexShrink: 1
    },

    header:{
        flexDirection: 'row',
    },

    contentText:{
        color: '#b1b1b1',
        fontSize: 16,
        marginTop: 2
    },

    nameTxt: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000'
    }
})
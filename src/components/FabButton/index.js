import React from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";


export default function FabButton({setVisible, userStatus}){
    const navigation = useNavigation();

    function handleNavigateButton(){
        userStatus ? setVisible() : navigation.navigate('SignIn');
    }

    return(
        <TouchableOpacity onPress={handleNavigateButton} style={styles.container} activeOpacity={0.8}>
            <View>
                <Text style={styles.buttonText}>+</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#a33ff4",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: 'center',
        position: 'absolute',
        right: '6%',
        bottom: '5%'
    },

    buttonText: {
        fontSize: 26,
        color: "#FFF",
        fontWeight: "bold",
    }
})
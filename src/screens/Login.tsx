import { KeyboardAvoidingView, StyleSheet, TextInput, View } from 'react-native'
import React, { FC } from 'react'
import { Button, Text } from 'react-native-elements';
interface props {
    navigation: any;
}
const Login: FC<props> = ({ navigation }) => {

    const onLogin = () => {
        navigation.replace('Home', { token: 'myToken' });
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.inpts}>
                <TextInput placeholder='Username' style={styles.inpt}/>
                <TextInput placeholder='Password' style={styles.inpt} secureTextEntry={true} />
            </View>

            <View style={styles.lgn}>
                <Button style={styles.lgnbtn} containerStyle={styles.lgnbtn} buttonStyle={styles.lgnbtn} title='login' onPress={onLogin} />
                <Text style={{textAlign:'right',margin:10}}>forget password?</Text>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:20,
    },
    inpts:{
        flex:3,
        justifyContent:'center'
    },
    inpt:{
        borderWidth:1,
        height:50,
        borderRadius:15,
        textAlign:'center',
        margin:10
    },
    lgn:{
        
    },
    lgnbtn:{
        backgroundColor:'#252528b8',
        borderRadius:15
    }
})
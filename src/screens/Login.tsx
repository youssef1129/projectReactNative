import { KeyboardAvoidingView, StyleSheet, TextInput, View } from 'react-native'
import React, { FC, useEffect, useLayoutEffect, useState } from 'react'
import { Button, Text } from 'react-native-elements';
import Loading from '../components/Loading';
import { getData, setData } from '../functions/localStorage';
import axios from 'axios';

interface props {
    navigation: any;
}
const Login: FC<props> = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const onLogin = async () => {
        setIsLoading(true)
        await axios.post('https://balisage.herokuapp.com/api/auth',user).then((res)=>{
            if(res.data.token){
                setData('auth', { token: res.data.token, username: user.username })
                navigation.replace('Home', { token: 'myToken', username: user.username })
            }
        }).catch(()=>{
            setIsLoading(false)
            alert('Invalid username or password')
        })
    }

    useLayoutEffect(() => {
        getData('auth').then((res) => res.token && navigation.replace('Home', { username: res.username }))
    }, [])

    const [user, setUser] = useState({ username: '', password: '' })
    const [eror, setEror] = useState(false)
    const [errs, setErrs] = useState({ uErr: false, pErr: false })


    return (
        <>
            {
                isLoading ? <Loading />
                    :
                    <KeyboardAvoidingView style={styles.container}>
                        <View style={styles.inpts}>
                            <TextInput placeholder='Username' style={[styles.inpt, { borderColor: errs.uErr ? 'red' : 'black' }]} onChangeText={(e) => { setUser({ ...user, username: e }); e.length < 5 ? setErrs({ ...errs, uErr: true }) : setErrs({ ...errs, uErr: false }) }} />
                            <TextInput secureTextEntry placeholder='Password' style={[styles.inpt, { borderColor: errs.pErr ? 'red' : 'black' }]} onChangeText={(e) => { setUser({ ...user, password: e }); e.length < 5 ? setErrs({ ...errs, pErr: true }) : setErrs({ ...errs, pErr: false }) }} />
                            {eror && <Text style={{ color: 'red', textAlign: 'center' }}>Invalid username or password</Text>}
                        </View>


                        <View style={styles.lgn}>
                            <Button style={styles.lgnbtn} containerStyle={styles.lgnbtn} buttonStyle={styles.lgnbtn} title='login' onPress={onLogin} />
                        </View>
                    </KeyboardAvoidingView>
            }
        </>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    inpts: {
        flex: 3,
        justifyContent: 'center'
    },
    inpt: {
        borderWidth: 1,
        height: 50,
        borderRadius: 15,
        textAlign: 'center',
        margin: 10
    },
    lgn: {

    },
    lgnbtn: {
        backgroundColor: '#252528b8',
        borderRadius: 15
    }
})
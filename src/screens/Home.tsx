import { StyleSheet, TextInput, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { CheckBox, Input, Text } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

interface props {
    route: any;
    navigation: any;
}
const Home: FC<props> = ({ route, navigation }) => {

    useEffect(() => {
        !route.params.token && navigation.replace('login');
        route.params.barCode && setBarCode(route.params.barCode);
    }, [route.params])


    const [barCode, setBarCode] = useState<string>('');
    const [check1, setCheck1] = useState(false);
    const [check2, setCheck2] = useState(false);

    return (
        
        <View style={styles.container}>
            <StatusBar style='light'/>

            <View style={styles.cnt1}>
                <TextInput editable={false} value={barCode} style={styles.barcode} placeholder='barcode' />
                <Ionicons name="camera" size={40} color="black" onPress={() => navigation.navigate('Scanner')} />
            </View>

            <View style={styles.price}>
                <Text h1>20 MAD</Text>
            </View>
            <View style={styles.cbs}>
                <CheckBox containerStyle={{ width: '50%', borderRadius: 15 }}
                    center
                    title="Changed"
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={check1}
                    disabled
                />
                <CheckBox containerStyle={{ width: '50%', borderRadius: 15 }}
                    center
                    title="Not Changed"
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={check2}
                    disabled
                />
            </View>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    cnt1: {
        flexDirection: 'row',
        padding: 10,
        height: 60,
        marginTop:30
    },
    barcode: {
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        flex: 1,
        marginRight: 5,
        color: 'black'
    },
    price: {
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cbs: {
        flexDirection: 'row',
        justifyContent: 'center',
    }
})
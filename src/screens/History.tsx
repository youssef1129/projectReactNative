import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { FC, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { AntDesign, Feather, Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getData, removeData, setData } from '../functions/localStorage';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Idata } from '../interfaces/Idata';
import { Dialog } from 'react-native-elements';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

interface props {
    route: any;
    navigation: any;
}
const History: FC<props> = ({ navigation }) => {

    const [products, setProducts] = useState<Array<Idata>>([])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerRight: () => (
                    <MaterialIcons name="delete" size={24} color="#ea3c3c" onPress={() => toggleAlert()} />
            )
        })
    }, [])


    useEffect(() => {
        getData('hist').then(res => setProducts(res))
    }, [products])

    

    const Item = ({ articleName, barCode, price, qte, time }: Idata) => {

        return (
             <View style={styles.item}>
                <Text style={{ textTransform: 'capitalize', fontWeight: '800', fontSize: 20, textAlign: 'center' }}>Product name : {articleName}</Text>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: '500' }}>Price : {price.toString().substring(0, 4)} MAD</Text>
                    <Text style={{ fontWeight: '500' }}>Amount : {qte}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12 }}>{barCode}</Text>
                    <Text style={{ fontSize: 12 }}>{time}</Text>
                </View>
            </View>
            )
    }

    const renderItem = ({ item }: any) => <Item time={item.time} articleName={item.articleName} barCode={item.barCode} price={item.price} qte={item.qte} />;

    const [isVisible, setIsVisible] = useState(false);
    const toggleAlert = () => setIsVisible(l => !l)
    return (
        <View style={{ flex: 1 }}>
            <Dialog
                isVisible={isVisible}
                onBackdropPress={toggleAlert}>
                <Dialog.Title title="Logout?" />
                <Dialog.Actions>
                    <Dialog.Button titleStyle={{ color: '#5eba7d' }}
                        title="CONFIRM"
                        onPress={() => {
                            setData('hist', [])
                            toggleAlert();
                        }}
                    />
                    <Dialog.Button titleStyle={{ color: '#ea3c3c' }} title="CANCEL" onPress={toggleAlert} />
                </Dialog.Actions>
            </Dialog>

            <StatusBar style='dark' />
            <FlatList data={products} renderItem={renderItem}
                keyExtractor={(item: Idata) => item.barCode.toString()} />
        </View>
    )
}

export default History

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#d3d3d3',
        margin: 10,
        borderRadius: 15,
        padding: 10,
    }
})
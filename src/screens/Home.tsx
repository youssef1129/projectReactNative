import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import React, { FC, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Button, CheckBox, Dialog, Input, Text } from 'react-native-elements';
import { AntDesign, Entypo, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Loading from '../components/Loading';
import { getData, removeData, setData } from '../functions/localStorage';
import DropDownPicker from 'react-native-dropdown-picker';
import { Idata } from '../interfaces/Idata';
import { fData } from '../data/fData';
import { fGroup } from '../data/fGroup';
import { Igroup } from '../interfaces/Igroup';
import { Idept } from '../interfaces/Idept';
import * as io from 'socket.io-client';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';

 const socket = io.connect("https://balisage.herokuapp.com/");

interface props {
    route: any;
    navigation: any;
}
const Home: FC<props> = ({ route, navigation }) => {
    const [fdata, setfdata] = useState<Array<Idata>>(fData);

    const [openDept, setOpenDept] = useState(false);
    const [valueDept, setValueDept] = useState(null);
    const [openGroup, setOpenGroup] = useState(false);
    const [valueGroup, setValueGroup] = useState(null);
    const [depts, setDepts] = useState([{ label: '', value: '' }]);
    const [grps, setGroups] = useState(
        fGroup.map((g:Igroup)=>{
            return {label:g.groupName,value:g.groupName}
        })
    )

    const [isLoading, setIsLoading] = useState(false);

    const [products, setProducts] = useState<Array<Idata>>([]);
    const [product, setProduct] = useState<Idata>({ articleName: '', barCode: '', price: '', qte: '', time: '',isChanged:false,dept:'',group:'' });

    const logout = () => {
        removeData('auth').then(() => {
            navigation.replace('Login')
        })
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: route.params.username !== undefined ? route.params.username.substring(0, 8) : '',
            headerLeft: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('History')}><MaterialCommunityIcons name="history" size={34} color="black" /></TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View>
                    <TouchableOpacity>
                        <Entypo onPress={toggleAlert2} name="log-out" size={24} color="black" />
                    </TouchableOpacity>
                </View>

            )
        })
    }, [])

    useEffect(() => {
        route.params.barCode && search();
    }, [route.params])


    useLayoutEffect(() => {
        getData('auth').then((res) => !res.token ? navigation.replace('login') : alert(`welcome ${res.username} to hyper temara balisage (store : hyper temara)`))
    }, [])

   
    // const txt = (): string => {
    //     let t = [];
    //     t = products.map((p: Idata) => {
    //         return {barcode:p.barCode,qte:p.qte};
    //     })
    //     return JSON.stringify(t);
    // }
    const download = async () => {
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if (status === "granted") {
            let fileUri = FileSystem.documentDirectory + "Balisage.json";
            await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(products), { encoding: FileSystem.EncodingType.UTF8 });
            const asset = await MediaLibrary.createAssetAsync(fileUri)
            await MediaLibrary.createAlbumAsync("Download", asset, false)
        }
    }

    const save = () => {
        if (products.length > 0) {
            getData('hist').then(res => {
                setData('hist', [...res, ...products]);
            })
            download()
            
            socket.emit('onSend',products);
            axios.post('https://balisage.herokuapp.com/api/article',products)
            

            setIsLoading(true)
            setTimeout(() => {
                setIsLoading(false)
                setProduct({ articleName: '', barCode: '', price: '', qte: '', time: '',isChanged:false })
                setProducts([])
            }, 2000);
        }
        else {
            alert('no product to save')
        }
    }

    const onGroupSelected = (val:any) => {
        const g = fGroup.filter(v=>v.groupName===val)
        const dpts = g[0].depts.map((d:Idept)=>{
            return {label:d.deptName.toString(),value:d.deptName.toString()}
        })
        setDepts(dpts);
    }
    const onDeptChange = (val:any) => {

    }

    const [isVisible, setIsVisible] = useState(false)
    const [isVisible2, setIsVisible2] = useState(false)

    const toggleAlert = () => {
        setIsVisible((re) => !re)
    }
    const toggleAlert2 = () => {
        setIsVisible2((l) => !l)
    }

    const isChanged = () => {
        products.push({ ...product, time: new Date().toISOString(),dept:valueDept,group:valueGroup,isChanged:true})
        setProduct({ articleName: '', barCode: '', price: '', qte: '', time: '',isChanged:false})
        console.log(products);
    }
    const notChanged = () => {
        products.push({ ...product,qte:0, time: new Date().toISOString(),dept:valueDept,group:valueGroup,isChanged:false})
        setProduct({ articleName: '', barCode: '', price: '', qte: '', time: '',isChanged:false })
        console.log(products);
        
    }

    const search = () => {
        const item = fdata.filter((r)=>r.barCode.toString()===product.barCode)
        item.length ? setProduct(item[0])
        : alert('Article not found')
    }

    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <Dialog
                isVisible={isVisible2}
                onBackdropPress={toggleAlert2}>
                <Dialog.Title title="Logout?" />
                <Dialog.Actions>
                    <Dialog.Button titleStyle={{ color: '#5eba7d' }}
                        title="CONFIRM"
                        onPress={() => {
                            logout()
                            toggleAlert2();
                        }}
                    />
                    <Dialog.Button titleStyle={{ color: '#ea3c3c' }} title="CANCEL" onPress={toggleAlert2} />
                </Dialog.Actions>
            </Dialog>

            {
                !valueGroup ?
                    <DropDownPicker
                        style={{ borderWidth: 0, borderRadius: 15 }}
                        textStyle={{ textAlign: 'center', fontWeight: '700' }}
                        placeholder='PICK A GROUP'
                        open={openGroup}
                        value={valueGroup}
                        items={grps}
                        setOpen={setOpenGroup}
                        setValue={setValueGroup}
                        setItems={setGroups}
                        onSelectItem={({value}) => onGroupSelected(value)}
                    />

                    :
                    (
                        (!valueDept && valueGroup) ?
                            <DropDownPicker
                                style={{ borderWidth: 0, borderRadius: 15 }}
                                textStyle={{ textAlign: 'center', fontWeight: '700' }}
                                placeholder='PICK A DEPARTEMENT'
                                open={openDept}
                                value={valueDept}
                                items={depts}
                                setOpen={setOpenDept}
                                setValue={setValueDept}
                                setItems={setDepts}
                                onSelectItem={({value}) => onDeptChange(value)}
                            />
                            :
                            <View style={styles.cnt1}>
                                <Ionicons name="camera" size={40} color="black" onPress={() => navigation.navigate('Scanner')} />
                                <TextInput keyboardType='numeric' value={product.barCode.toString()} style={styles.barcode} placeholder='barcode' onChangeText={(val) => setProduct({ ...product, barCode: val })} />
                                <TouchableOpacity onPress={search}><FontAwesome5 name="search" size={30} color="black" /></TouchableOpacity>
                            </View>
                    )
            }
            <>
                {isLoading ?
                    <Loading />
                    :
                    <>
                        <View style={styles.price}>
                            <Text h1>{product.articleName ? product.articleName : ''}</Text>
                            <Text h1>{product.articleName ? product.price.toString().substring(0, 5) + ' MAD' : ''}</Text>
                        </View>
                        {product.articleName ? <View style={styles.ops}>
                            <TouchableOpacity onPress={() => notChanged()}><AntDesign name="checkcircleo" size={50} color="#5eba7d" /></TouchableOpacity>
                            <TouchableOpacity onPress={() => toggleAlert()}><AntDesign name="closecircleo" size={50} color="#ea3c3c" /></TouchableOpacity>
                            <Dialog
                                isVisible={isVisible}
                                onBackdropPress={toggleAlert}
                            >
                                <Dialog.Title title="Select the number of tickets" />
                                <TextInput maxLength={100} keyboardType='number-pad' value={product?.qte?.toString()} onChangeText={(e) => setProduct({ ...product, qte: e })} style={styles.noItems} placeholder='number of tickets' />

                                <Dialog.Actions>
                                    <Dialog.Button titleStyle={{ color: '#5eba7d' }}
                                        title="CONFIRM"
                                        onPress={() => {
                                            isChanged()
                                            toggleAlert();
                                        }}
                                    />
                                    <Dialog.Button titleStyle={{ color: '#ea3c3c' }} title="CANCEL" onPress={toggleAlert} />
                                </Dialog.Actions>
                            </Dialog>
                        </View>
                            :
                            <View></View>
                        }
                    </>
                }
            </>
            {
                (valueDept && valueGroup && products.length>0) &&
                <View style={styles.cbs}>
                    <Text style={{ textAlign: 'center', fontSize: 11, padding: 10, color: products.length > 0 ? 'red' : 'green' }}>number of changed items : {products.length}</Text>
                    <Button onPress={save} containerStyle={styles.save} buttonStyle={styles.save} title='save' />
                </View>
            }
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    cnt1: {
        flexDirection: 'row',
        padding: 10,
        height: 60,
        marginTop: 30,
        alignItems: 'center',
    },
    barcode: {
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        flex: 1,
        marginRight: 5,
        color: 'black',
        marginHorizontal: 5,
        height: 40
    },
    price: {
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cbs: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    noItems: {
        color: 'black',
        textAlign: 'center',
        marginBottom: 15,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        padding: 5
    },
    save: {
        borderRadius: 15,
        borderColor: 'white',
        backgroundColor: 'black'
    },
    ops: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})
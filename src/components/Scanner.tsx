import { StyleSheet, Text, Vibration, View } from 'react-native'
import React, { FC, useEffect, useRef, useState } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button } from 'react-native-elements';
import { Camera } from 'expo-camera';

interface props{
    navigation: any;
}

const Scanner:FC<props> = ({navigation}) => {

    const [hasPermission, setHasPermission] = useState(false);
    const lastScanTime = useRef(0);
    const [lastScan, setLastScan] = useState<any>();

    const [barCode,setBarCode]= useState<string>('');

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(()=>{
        barCode && navigation.navigate('Home',{barCode})
    },[barCode])

    const handleBarCodeScanned = (event: any) => {
        if (
            event.data === lastScan?.data &&
            Date.now() - lastScanTime.current < 1000
        ) {
            lastScanTime.current = Date.now();
            return;
        }
        Vibration.vibrate(100);
        lastScanTime.current = Date.now();
        setLastScan(event);
        // alert(JSON.stringify(event, null, 2));
        // alert(JSON.stringify(event.data, null, 2));
        setBarCode(event.data);
    };

    if (hasPermission === undefined) {
        return <Text>Requesting permissions...</Text>;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                barCodeScannerSettings={{
                    barCodeTypes: [BarCodeScanner.Constants.BarCodeType.ean13, BarCodeScanner.Constants.BarCodeType.upc_a]
                }}
                onBarCodeScanned={handleBarCodeScanned}
            />
        </View>
    )
}

export default Scanner

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    camera: {
      flex: 1,
    },
  });
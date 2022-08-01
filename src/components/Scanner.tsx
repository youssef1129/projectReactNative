import { Dimensions, Platform, StyleSheet, Text, Vibration, View } from 'react-native'
import React, { FC, useEffect, useRef, useState } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button } from 'react-native-elements';
import { Camera } from 'expo-camera';

interface props {
    navigation: any;
}

const Scanner: FC<props> = ({ navigation }) => {

    const [hasPermission, setHasPermission] = useState(false);
    const lastScanTime = useRef(0);
    const [lastScan, setLastScan] = useState<any>();

    const [barCode, setBarCode] = useState<string>('');


    const [imagePadding, setImagePadding] = useState(0);
    const [ratio, setRatio] = useState('4:3');
    const { height, width } = Dimensions.get('window');
    const screenRatio = height / width;
    const [isRatioSet, setIsRatioSet] = useState(false);
    const [camera, setCamera] = useState<any>();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        barCode && navigation.navigate('Home', { barCode })
    }, [barCode])

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

    const prepareRatio = async () => {
        let desiredRatio = '4:3';  // Start with the system default
        // This issue only affects Android
        if (Platform.OS === 'android') {
            const ratios = await camera.getSupportedRatiosAsync();

            let distances: any;
            let realRatios: any;
            let minDistance = null;
            for (const ratio of ratios) {
                const parts = ratio.split(':');
                const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
                realRatios[ratio] = realRatio;
                const distance = screenRatio - realRatio;
                distances[ratio] = realRatio;
                if (minDistance == null) {
                    minDistance = ratio;
                } else {
                    if (distance >= 0 && distance < distances[minDistance]) {
                        minDistance = ratio;
                    }
                }
            }
            desiredRatio = minDistance;
            const remainder = Math.floor(
                (height - realRatios[desiredRatio] * width) / 2
            );
            setImagePadding(remainder);
            setRatio(desiredRatio);
            setIsRatioSet(true);
        }
    };

    const setCameraReady = async () => {
        if (!isRatioSet) {
            await prepareRatio();
        }
    };

    return (
        <View style={styles.container}>
            <Camera
                ratio={ratio}
                ref={(ref) => {
                    setCamera(ref);
                }}
                onCameraReady={setCameraReady}
                style={[styles.camera, { marginTop: imagePadding, marginBottom: imagePadding }]}
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
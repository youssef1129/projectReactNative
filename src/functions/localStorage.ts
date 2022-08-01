import AsyncStorage from "@react-native-async-storage/async-storage";

export const setData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    alert("eror" + e);
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    alert("eror" + e);
  }
};

export const removeData = async (key: string) => {
    try {
      const jsonValue = JSON.stringify(null);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      alert("eror" + e);
    }
  };


  

import AsyncStorage from '@react-native-async-storage/async-storage';

export const removeItem = ({ itemId }) => {
    getData()
        .then(response => {
            const filteredData = response.filter(item => item.id !== itemId)
            storeItem(filteredData)
        })
}

export const removeAll = async () => {
    try {
        await AsyncStorage.removeItem('@trips');
        return true;
    }
    catch (exception) {
        return false;
    }
}

export const addToStore = (data) => {
    getItem().then(response => {
        const newData = [...response, {
            id: response.length,
            coordinates: data[0].coordinates,
            totalDistance: data[0].totalDistance
        }]
        storeItem(newData)
    })
}

export const storeItem = async (value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('@trips', jsonValue)
    } catch (e) {
        console.log(e, "Error when storing data")
    }
}


export const getItem = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@trips')
        return jsonValue != null ? JSON.parse(jsonValue) : []
    } catch (e) {
        console.log(e, "Error when reading data")
    }
}
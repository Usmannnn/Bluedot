
import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureScreen } from "react-native-view-shot";

const GOOGLE_PLACES_API_KEY = ""

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
            totalDistance: data[0].totalDistance,
            date: data[0].date,
            screenshot: data[0].screenshot
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

const haversine = (coords1, coords2) => {
    const R = 6371e3; // metres
    const φ1 = coords1.latitude * Math.PI / 180; // φ, λ in radians
    const φ2 = coords2.latitude * Math.PI / 180;
    const Δφ = (coords2.latitude - coords1.latitude) * Math.PI / 180;
    const Δλ = (coords2.longitude - coords1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
}

export const calculateDistance = (arr) => {

    let totalDistance = 0
    for (let i = 1; i < arr.length; i++) {
        totalDistance += haversine(arr[i - 1], arr[i])
    }
    return (totalDistance / 1000).toFixed(2)
}

export const takeScreenshot = async () => {
    let source = await captureScreen({ format: "jpg", quality: 0.8 }).
        then(uri => {
            return uri
        }, error => console.error("Oops, snapshot failed", error));

    return source
}

export const placeApi = async (query, currentPosition) => {
    const result = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${currentPosition?.latitude},${currentPosition?.longitude}&radius=1000&region=tr&key=${GOOGLE_PLACES_API_KEY}`)
        // fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentPosition?.latitude},${currentPosition?.longitude}&radius=1000&type=point_of_interest&keyword=divvy&key=${GOOGLE_PLACES_API_KEY}`)
        .then(res => res.json())
        .then(res => res)
    return result
}
import { StyleSheet, TextInput, View, Text, Keyboard, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import data from '../placeapiresponse.json'
import { placeApi } from '../utils/methods';


const Search = ({ currentPosition, setSelectedLocation }) => {

    const [query, setQuery] = useState("")
    const [places, setPlaces] = useState(null)
    const [isFocused, setIsFocused] = useState(false)

    useEffect(async () => {
        setPlaces(await placeApi(query, currentPosition))
    }, [query,currentPosition])


    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setIsFocused(true)
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setIsFocused(false)
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);


    const handleSelect = (loc) => {
        setQuery("")
        setSelectedLocation({ latitude: loc.lat, longitude: loc.lng })
        Keyboard.dismiss()
    }


    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => handleSelect(item.geometry.location)}
                key={index}
                style={{ backgroundColor: "whitesmoke", marginBottom: 5, paddingVertical: 10, paddingHorizontal: 10 }}
            >
                <Text>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <TextInput
                placeholder='Search'
                onChangeText={setQuery}
                value={query}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{ backgroundColor: "white", padding: 10, height: 50, borderRadius: 10 }}
            />

            {isFocused && query !== "" && (
                <View style={styles.listContainer}>
                    <FlatList
                        keyboardShouldPersistTaps='always'
                        data={places.results}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={renderItem}
                    />
                </View>
            )}






            {/* <GooglePlacesAutocomplete
                placeholder='Search'
                onPress={(data, details = null) => {
                    console.log(data, details);
                }}
                query={{
                    key: GOOGLE_PLACES_API_KEY,
                    language: 'en',
                }}
            /> */}
        </View>
    )
}

export default Search

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    listContainer: {
        width: "100%",
        borderRadius: 15,
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 15,
        height: 200,
        backgroundColor: 'white',
    }
})
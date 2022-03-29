import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'

import { MaterialIcons } from '@expo/vector-icons';

const MyLocation = ({ onAction }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={() => onAction()}>
            <MaterialIcons name={"my-location"} size={22} color={"black"} />
        </TouchableOpacity>
    )
}

export default MyLocation

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 200,
        padding: 10
    }
})
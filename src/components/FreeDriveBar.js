import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const FreeDriveBar = ({ onAction }) => {


    const onPressedButton = () => { }

    return (
        <TouchableOpacity style={styles.container} onPress={() => {
            onAction()
            onPressedButton()
        }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Free Driving</Text>
        </TouchableOpacity>
    )
}

export default FreeDriveBar

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginRight: 25,
        backgroundColor: "#333C83",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 10
    }
})
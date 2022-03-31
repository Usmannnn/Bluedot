import { StyleSheet, View, TouchableOpacity, Text, Animated } from 'react-native'
import React, { useRef } from 'react'

import { Entypo } from '@expo/vector-icons';

const TripsHeaderRight = () => {

    var toggle = false
    const animatedHeight = useRef(new Animated.Value(55)).current

    const toggleHeader = () => {
        Animated.spring(animatedHeight, {
            toValue: toggle ? 55 : 200,
            useNativeDriver: false
        }).start()
        toggle = !toggle
    }

    return (
        <Animated.View style={[styles.container, { height: animatedHeight }]}>
            <View style={{ flex: 1, alignItems: "center", paddingLeft: 75 }}>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>Trips</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => toggleHeader()}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>Edit</Text>
                <Entypo name="chevron-down" size={20} color="black" />
            </TouchableOpacity>
        </Animated.View>
    )
}

export default TripsHeaderRight

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flexDirection: "row",
        paddingTop: 15
    },
    editButton: {
        marginRight: 25,
        flexDirection: "row",
    }
})
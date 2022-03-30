import { StyleSheet, Text, TouchableOpacity, Animated, View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Feather } from '@expo/vector-icons';

const FreeDriveBar = ({ onAction }) => {

    const animatedFlex = useRef(new Animated.Value(1)).current
    const [toggle, setToggle] = useState(false)

    useEffect(() => {
        Animated.spring(animatedFlex, {
            toValue: toggle ? 0.2 : 1,
            useNativeDriver: false
        }).start()
    }, [toggle])


    return (
        <Animated.View style={[styles.container, { flex: animatedFlex }]}>
            <TouchableOpacity style={{ ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" }} onPress={() => {
                onAction()
                setToggle(!toggle)
            }}>
                {toggle ?
                    <Feather name="check-circle" size={24} color="white" /> :
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Feather name="circle" size={24} color="white" />
                        <Text style={{ color: "white", fontWeight: "bold", marginLeft: 15 }}>Start Free Drive</Text>
                    </View>
                }
            </TouchableOpacity>
        </Animated.View>
    )
}

export default FreeDriveBar

const styles = StyleSheet.create({
    container: {
        marginRight: 25,
        backgroundColor: "#333C83",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 10
    }
})
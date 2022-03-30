import { StyleSheet, Text, View, AppState } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getItem } from '../utils/methods'

import * as LocalAuthentication from 'expo-local-authentication';
import { useIsFocused } from '@react-navigation/native';


const Trips = () => {

	const isFocused = useIsFocused();
	const [data, setData] = useState(null)
	const [cookie, setCookie] = useState(false)


	useEffect(async () => {
		if (isFocused && !cookie) {
			const { success } = await LocalAuthentication.authenticateAsync()
			if (success) getItem().then(res => {
				setData(res)
				setCookie(true)
			})
		}
	}, [isFocused, cookie])

	useEffect(() => {
		const subscription = AppState.addEventListener("change", nextAppState => {
			if (nextAppState === 'active') setCookie(false)
		})

		return () => {
			subscription.remove();
		}
	}, []);

	return (
		<View style={styles.container}>
			{data && data.map((item, index) => {
				return <Text key={index}>{item.id}</Text>
			})}
		</View>
	)
}

export default Trips

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "pink"
	}
})
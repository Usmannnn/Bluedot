import { StyleSheet, Text, View, ScrollView, Image, AppState } from 'react-native'
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

		return () => subscription.remove();
	}, []);


	const TripCard = ({ item, index }) => {

		return (
			<View style={styles.cardContainer} key={index}>
				<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10, paddingBottom: 15 }}>
					<Text>{item.totalDistance} Km</Text>
					<Text>{item.date}</Text>
				</View>
				<View style={{ flex: 1, height: 200}}>
					<Image
						source={{ uri: item.screenshot }}
						style={{ ...StyleSheet.absoluteFillObject }}
					/>
				</View>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<ScrollView>
				{data && data.map((item, index) => {
					return TripCard({ item, index })
				})}
			</ScrollView>
		</View>
	)
}

export default Trips

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	cardContainer: {
		backgroundColor: "white",
		padding: 10,
		marginTop: 15,
		elevation: 4,
		marginBottom: 10,
		marginHorizontal: 20,
		borderRadius: 10
	}
})
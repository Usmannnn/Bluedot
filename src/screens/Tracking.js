import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Dimensions, View } from 'react-native'
import MapView, { Polyline } from 'react-native-maps';
import FreeDriveBar from '../components/FreeDriveBar';
import MyLocation from '../components/MyLocation';
import * as Location from 'expo-location';



const Tracking = () => {

	const mapRef = useRef();
	const [currentPosition, setCurrentPosition] = useState(null)
	const [foreground, requestForegroundPermission] = Location.useForegroundPermissions();
	const [drivingCoordinates, setDrivingCoordinates] = useState([])

	useEffect(async () => {
		await requestForegroundPermission()
		// ask background
	}, [])

	const getCurrentPosition = async () => {
		const { coords } = await Location.getCurrentPositionAsync({})
		setCurrentPosition({ latitude: coords.latitude, longitude: coords.longitude })
		mapRef.current.animateToRegion({
			latitude: coords.latitude,
			longitude: coords.longitude,
			latitudeDelta: 1,
			longitudeDelta: 1,
		});
	}

	useEffect(() => { getCurrentPosition() }, [])

	const toggleFreeDriving = () => {
		if (drivingCoordinates.length > 0) setDrivingCoordinates([])
		else setDrivingCoordinates([currentPosition])
	}

	useEffect(() => { console.log(drivingCoordinates.length) }, [drivingCoordinates])


	return (
		<View style={styles.container}>
			{foreground?.granted && currentPosition &&
				<MapView
					ref={mapRef}
					style={styles.map}
					showsUserLocation={true}
					showsMyLocationButton={false}
					initialRegion={{
						latitude: currentPosition.latitude,
						longitude: currentPosition.longitude,
						latitudeDelta: 1,
						longitudeDelta: 1,
					}}
					onUserLocationChange={({ nativeEvent }) => {
						drivingCoordinates.length > 0 && setDrivingCoordinates(prev => [...prev, {
							latitude: nativeEvent.coordinate.latitude,
							longitude: nativeEvent.coordinate.longitude
						}])
					}}
				>
					<Polyline
						coordinates={drivingCoordinates}
						strokeColor="#000"
						strokeColors={[
							'#7F0000',
							'#00000000',
							'#B24112',
							'#E5845C',
							'#238C23',
							'#7F0000'
						]}
						strokeWidth={6}
					/>
				</MapView>
			}
			<View style={styles.bottomContentContainer}>
				<FreeDriveBar onAction={() => toggleFreeDriving()} />
				<MyLocation onAction={() => getCurrentPosition()} />
			</View>
		</View>
	)
}

export default Tracking

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
	bottomContentContainer: {
		position: "absolute",
		bottom: 20,
		left: 70,
		right: 70,
		flexDirection: "row",
		justifyContent: "space-between"
	}
})
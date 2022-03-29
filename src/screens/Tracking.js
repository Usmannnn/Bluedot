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
		console.log(coords)
		setCurrentPosition({ latitude: coords.latitude, longitude: coords.longitude })
		mapRef.current.animateToRegion({
			latitude: coords.latitude,
			longitude: coords.longitude,
			latitudeDelta: 1,
			longitudeDelta: 1,
		});
	}

	useEffect(() => {
		getCurrentPosition()
		// fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.8538996,29.3002546&radius=1000&type=point_of_interest&keyword=divvy&key=AIzaSyA8Fc0HE-Vphp5UVgmFlPa0Od_-w8H2YJI`)
		// 	.then(res => res.json())
		// 	.then(res => console.log(res))
	}, [])

	const toggleFreeDriving = () => {
		if (drivingCoordinates.length > 0) setDrivingCoordinates([])
		else setDrivingCoordinates([currentPosition])
	}

	useEffect(() => {
		console.log(drivingCoordinates.length)
		calculateDistance(drivingCoordinates)
	}, [drivingCoordinates])


	const calculateDistance = (arr) => {

		let totalDistance = 0
		for (let i = 1; i < arr.length; i++) {
			totalDistance += haversine(arr[i - 1], arr[i])
		}
		console.log(totalDistance)
	}

	function haversine(coords1, coords2) {
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
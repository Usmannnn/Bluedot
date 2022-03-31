import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Dimensions, View, Text, TouchableOpacity, AppState } from 'react-native'
import MapView, { Polyline } from 'react-native-maps';
import FreeDriveBar from '../components/FreeDriveBar';
import MyLocation from '../components/MyLocation';
import * as Location from 'expo-location';
import { addToStore, calculateDistance, removeAll, takeScreenshot } from '../utils/methods'
import * as TaskManager from 'expo-task-manager';
import Search from '../components/Search';


const LOCATION_TRACKING = 'location-tracking';


const Tracking = () => {

	const mapRef = useRef();
	const [currentPosition, setCurrentPosition] = useState(null)
	const [permissons, setPermissions] = useState(false)
	const [drivingCoordinates, setDrivingCoordinates] = useState([])
	const [totalDistance, setTotalDistance] = useState(0)
	const [driveMode, setDriveMode] = useState(false)


	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}

			const { coords } = await Location.getCurrentPositionAsync({})
			setCurrentPosition({ latitude: coords.latitude, longitude: coords.longitude })

			let backPerm = await Location.requestBackgroundPermissionsAsync();
			setPermissions(backPerm);

		})();
	}, [])


	const getCurrentPosition = async () => {
		const { coords } = await Location.getCurrentPositionAsync({})
		setCurrentPosition({ latitude: coords.latitude, longitude: coords.longitude })
		mapRef.current.animateToRegion({
			latitude: coords.latitude,
			longitude: coords.longitude,
			latitudeDelta: 0.008,
			longitudeDelta: 0.008,
		});
	}

	const setSelectedLocation = (coords) => {
		console.log(coords, "sad")
		mapRef.current.animateToRegion({
			latitude: coords.latitude,
			longitude: coords.longitude,
			latitudeDelta: 0.008,
			longitudeDelta: 0.008,
		});
	}

	useEffect(() => {
		AppState.addEventListener("change", async (nextAppState) => {
			if (nextAppState === 'active') {
				console.log("active")
				TaskManager.unregisterAllTasksAsync()
				await getCurrentPosition()
			}
			else if (nextAppState == 'background' && driveMode) {
				console.log("background", driveMode)
				await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
					accuracy: Location.Accuracy.BestForNavigation,
					timeInterval: 500,
					distanceInterval: 1,
					foregroundService: {
						notificationTitle: 'Live Tracker',
						notificationBody: 'Live Tracker is on.'
					}
				});
			}
			else TaskManager.unregisterAllTasksAsync()
		})

	}, [driveMode]);





	const toggleFreeDriving = async () => {
		if (drivingCoordinates.length > 0) {

			let uri = await takeScreenshot()
			console.log(uri, "in to")

			setDriveMode(false)
			addToStore([{
				coordinates: drivingCoordinates,
				totalDistance,
				date: new Date().toDateString(),
				screenshot: uri
			}])
			setDrivingCoordinates([])
		}
		else {
			setDriveMode(true)
			setDrivingCoordinates([currentPosition])
		}
	}

	useEffect(() => {
		setTotalDistance(calculateDistance(drivingCoordinates))
	}, [drivingCoordinates])



	return (
		<View style={styles.container}>

			{permissons && currentPosition &&
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
			<View style={styles.searchContainer}>
				<Search currentPosition={currentPosition} setSelectedLocation={setSelectedLocation}/>
			</View>
			<View style={styles.bottomContentContainer}>
				<FreeDriveBar onAction={() => toggleFreeDriving()} />
				<MyLocation onAction={() => getCurrentPosition()} />
			</View>
			{driveMode && <View style={styles.distanceContainer}>
				<Text style={{ color: "white", fontWeight: "bold" }}>{totalDistance} Km</Text>
			</View>}
		</View>
	)
}

export default Tracking



TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
	console.log("in back")
	if (error) {
		console.log('LOCATION_TRACKING task ERROR:', error);
		return;
	}
	if (data) {
		const { locations } = data;
		let lat = locations[0].coords.latitude;
		let long = locations[0].coords.longitude;

		console.log(
			`${new Date(Date.now()).toLocaleString()}: ${lat},${long}`
		);
	} else console.log("not data")
});


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
	},
	distanceContainer: {
		position: "absolute",
		top: 80,
		right: 20,
		backgroundColor: "#333C83",
		width: 80,
		height: 40,
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center"
	},
	searchContainer: {
		left: 10,
		right: 10,
		position: "absolute",
		top: 10,
		zIndex:10000
	}
})
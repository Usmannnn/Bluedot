import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigationContainer from './src/navigations';

export default function App() {
	return (
		<View style={styles.container}>
			<StatusBar style="auto" />
			<AppNavigationContainer />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingTop: 35
	},
});

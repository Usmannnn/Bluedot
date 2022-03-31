import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Trips from "../screens/Trips";
import Transactions from "../screens/Transactions";
import Tracking from "../screens/Tracking";
import Tax from "../screens/Tax";
import { Ionicons, Feather } from 'react-native-vector-icons';
import TripsHeader from "../components/TripsHeader";


const Tab = createBottomTabNavigator();

export const TabStack = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Trips') iconName = focused ? 'car-sport' : 'car-sport-outline';
                    else if (route.name === 'Tracking') iconName = focused ? 'add' : 'add-outline';
                    else if (route.name === 'Transactions') {
                        iconName = 'dollar-sign'
                        return <Feather name={iconName} size={size} color={color} />;
                    } else iconName = focused ? 'folder' : 'folder-outline';

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#333C83',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={Home} options={{ headerTitleAlign: "center" }} />
            <Tab.Screen name="Trips" component={Trips} options={{ header: () => <TripsHeader /> }} />
            <Tab.Screen name="Tracking" component={Tracking} options={{ headerShown: false, tabBarHideOnKeyboard: true }} />
            <Tab.Screen name="Transactions" component={Transactions} options={{ headerTitleAlign: "center" }} />
            <Tab.Screen name="Tax" component={Tax} options={{ headerTitleAlign: "center" }} />
        </Tab.Navigator>
    )
}
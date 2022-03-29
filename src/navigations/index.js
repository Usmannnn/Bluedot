import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TabStack } from './TabStack';

export default function AppNavigationContainer() {
    return (
        <NavigationContainer>
            <TabStack />
        </NavigationContainer>
    );
}
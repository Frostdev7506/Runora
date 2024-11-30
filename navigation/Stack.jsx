import React, {lazy, Suspense} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoadingComponent from '../components/LoadingComponent';

// Lazy load all components
const Initial = lazy(() => import('../components/Initial'));
const Home = lazy(() => import('../components/Home'));
const Questionnaire = lazy(() => import('../components/Questionnaire'));
const Stats = lazy(() => import('../components/Stats'));
const SettingsScreen = lazy(() => import('../components/SettingScreen'));

const Stack = createStackNavigator();

const screens = [
  {name: 'Initial', component: Initial},
  {name: 'Questionnaire', component: Questionnaire},
  {name: 'Home', component: Home},
  {name: 'Stats', component: Stats},
  {name: 'Settings', component: SettingsScreen},
];

function MyStack() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Stack.Navigator
        initialRouteName="Initial"
        screenOptions={{headerShown: false}}>
        {screens.map((screen, index) => (
          <Stack.Screen
            key={index}
            name={screen.name}
            component={screen.component}
            options={screen.options}
          />
        ))}
      </Stack.Navigator>
    </Suspense>
  );
}

export default MyStack;

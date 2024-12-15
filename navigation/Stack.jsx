import React, {lazy, Suspense, useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import LoadingComponent from '../components/LoadingComponent';
import CurrentRouteName from '../components/ReuseableComponents/CurrentRouteName';


// Lazy load all components
const Initial = lazy(() => import('../components/Initial'));
const Home = lazy(() => import('../components/Home'));
const Questionnaire = lazy(() => import('../components/Questionnaire'));
const Stats = lazy(() => import('../components/Stats'));
const SettingsScreen = lazy(() => import('../components/SettingScreen'));
const EditExpenseScreen = lazy(() => import('../components/ReuseableComponents/EditExpenseScreen'));

const Stack = createStackNavigator();

const screens = [
  {name: 'Initial', component: Initial},
  {name: 'Questionnaire', component: Questionnaire},
  {name: 'Home', component: Home},
  {name: 'Stats', component: Stats},
  {name: 'Settings', component: SettingsScreen},
  {name: 'EditExpense', component: EditExpenseScreen},

];

function MyStack() {
  const navigation = useNavigation();
  const [currentRouteName, setCurrentRouteName] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      const newRouteName = navigation.getCurrentRoute()?.name;
      setCurrentRouteName(newRouteName);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Suspense fallback={<LoadingComponent />}>
      <View style={{flex: 1}}>
        <CurrentRouteName routeName={currentRouteName} /> 
        <Stack.Navigator initialRouteName="Initial" screenOptions={{headerShown: false}}>
          {screens.map((screen) => (
            <Stack.Screen
              key={screen.name}
              name={screen.name}
              component={screen.component}
              options={screen.options}
            />
          ))}
        </Stack.Navigator>
      </View>
    </Suspense>
  );
}

export default MyStack;
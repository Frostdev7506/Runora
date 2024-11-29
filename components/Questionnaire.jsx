import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Switch,
  Alert,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import useStore from '../store/store';
import currencyData from '../utils/currencies'; // Import the currency data

const Questionnaire = ({navigation}) => {
  const [animatedValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.timing(animatedValue, {
      toValue: 0.9,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };
  const {
    monthlyBudget,
    symbol,
    currency,
    region,
    carryOverBudget,
    setCurrency,
    setRegion,
    setSymbol,
    setCarryOverBudget,
    setMonthlyBudget,
    saveToStorage,
    getMonthlyBudget,
    getCurrency,
    getRegion,
    getCarryOverBudget,
    getSymbol,
  } = useStore();

  useEffect(() => {
    const loadDefaultValues = async () => {
      const storedMonthlyBudget = await getMonthlyBudget();
      const storedCurrency = await getCurrency();
      const storedRegion = await getRegion();
      const storedCarryOverBudget = await getCarryOverBudget();

      if (storedMonthlyBudget) {
        setMonthlyBudget(storedMonthlyBudget);
      }
      if (storedCurrency) {
        setCurrency(storedCurrency);
      }
      if (storedRegion) {
        setRegion(storedRegion);
      }
      if (storedCarryOverBudget !== undefined) {
        setCarryOverBudget(storedCarryOverBudget);
      }
    };

    loadDefaultValues();
  }, [
    setMonthlyBudget,
    setCurrency,
    setRegion,
    setCarryOverBudget,
    getMonthlyBudget,
    getCurrency,
    getRegion,
    getCarryOverBudget,
  ]);

  const handleRegionChange = selectedRegion => {
    setRegion(selectedRegion);
    const selectedCurrencyData = currencyData.find(
      item => item.Region === selectedRegion,
    );
    if (selectedCurrencyData) {
      setCurrency(selectedCurrencyData.Currency);
      setSymbol(selectedCurrencyData.Symbol);
    }
  };

  const handleSubmit = async () => {
    const budget = parseFloat(monthlyBudget);
    if (isNaN(budget) || budget <= 0) {
      Alert.alert(
        'Invalid Input',
        'Please enter a valid positive monthly budget.',
      );
      return;
    }

    setMonthlyBudget(monthlyBudget);
    setCurrency(currency);
    setRegion(region);
    setCarryOverBudget(carryOverBudget);

    await saveToStorage();

    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Runora</Text>
      <Text style={styles.label}>Monthly Budget:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={monthlyBudget}
        onChangeText={setMonthlyBudget}
        placeholder="Enter your monthly budget"
      />

      <Text style={styles.label}>Region:</Text>
      <Picker
        selectedValue={region}
        style={styles.picker}
        onValueChange={handleRegionChange}>
        {currencyData.map(item => (
          <Picker.Item
            key={item.Region}
            label={item.Region}
            value={item.Region}
          />
        ))}
      </Picker>

      <Text style={styles.label}>
        Currency: {symbol}-{currency}
      </Text>

      <View style={styles.switchContainer}>
        <Text style={styles.Switchlabel}>Carry Over Unused Budget:</Text>
        <Switch value={carryOverBudget} onValueChange={setCarryOverBudget} />
      </View>
      <TouchableOpacity
        activeOpacity={1} // Disable default opacity change
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.button}
        onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f5fcff',
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'center',

    width: '100%',
  },
  Switchlabel: {
    fontSize: 18,
    marginVertical: 15,
    textAlign: 'center',

    width: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#008080', // Turquoise color
    padding: 15,
    borderRadius: 10,
    overflow: 'hidden', // Ensure ripple effect stays within bounds
    marginBottom: 30,
    width: 200,
    alignItems: 'center',
    elevation: 5, //for android shadow
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonInner: {},
});

export default Questionnaire;

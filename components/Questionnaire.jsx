import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  Alert,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import useStore from '../store/store';
import currencyData from '../utils/currencies';

const Questionnaire = ({navigation}) => {
  const [animatedValue] = useState(new Animated.Value(1));
  const [focusedInput, setFocusedInput] = useState(false);

  const handlePressIn = () => {
    Animated.timing(animatedValue, {
      toValue: 0.95,
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

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Monthly Budget</Text>
        <View
          style={[
            styles.inputWrapper,
            focusedInput && styles.inputWrapperFocused,
          ]}>
          <Text style={styles.currencySymbol}>{symbol}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={monthlyBudget}
            onChangeText={setMonthlyBudget}
            placeholder="Enter monthly budget"
            placeholderTextColor="#888"
            onFocus={() => setFocusedInput(true)}
            onBlur={() => setFocusedInput(false)}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Region</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={region}
            style={styles.picker}
            onValueChange={handleRegionChange}>
            {currencyData.map(item => (
              <Picker.Item
                key={item.Region}
                label={item.Region}
                value={item.Region}
                style={styles.pickerItem}
              />
            ))}
          </Picker>
        </View>
      </View>

      <Text style={styles.currencyText}>
        Currency: {symbol}-{currency}
      </Text>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Carry Over Unused Budget</Text>
        <Switch
          value={carryOverBudget}
          onValueChange={setCarryOverBudget}
          trackColor={{false: '#767577', true: '#008080'}}
          thumbColor={carryOverBudget ? '#f55' : '#f4f3f4'}
        />
      </View>

      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{scale: animatedValue}],
          },
        ]}>
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleSubmit}
          style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f8',
  },
  title: {
    fontSize: 36,
    fontWeight: '300',
    marginBottom: 30,
    color: '#008080',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
    paddingHorizontal: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputWrapperFocused: {
    borderColor: '#008080',
  },
  currencySymbol: {
    fontSize: 16,
    marginLeft: 15,
    color: '#666',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#333',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
  },
  currencyText: {
    fontSize: 16,
    marginVertical: 15,
    color: '#666',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#008080',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Questionnaire;

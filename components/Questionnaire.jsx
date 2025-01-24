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
  Image,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {PaperProvider, MD3LightTheme as DefaultTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';

import useStore from '../store/store';
import currencyData from '../utils/currencies';

// Replace with your SVG or local image
const welcomeImage = require('../assets/welcome-image.png');

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#008080',
    accent: '#f55',
    background: '#f4f4f8',
    surface: '#ffffff',
    text: '#333333',
    placeholder: '#888888',
  },
};

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
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Image source={welcomeImage} style={styles.welcomeImage} />

        <Text style={styles.title}>Welcome to Runora</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Monthly Budget</Text>
          <View
            style={[
              styles.inputWrapper,
              focusedInput && styles.inputWrapperFocused,
            ]}>
            <Icon name="money-bill" size={24} color={theme.colors.primary} />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={monthlyBudget}
              onChangeText={setMonthlyBudget}
              placeholder="Enter monthly budget"
              placeholderTextColor={theme.colors.placeholder}
              onFocus={() => setFocusedInput(true)}
              onBlur={() => setFocusedInput(false)}
            />
            <Text style={styles.currencySymbol}>{symbol}</Text>
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
            trackColor={{false: '#767577', true: theme.colors.primary}}
            thumbColor={carryOverBudget ? theme.colors.accent : '#f4f3f4'}
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
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  welcomeImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 36,
    fontWeight: '300',
    marginBottom: 30,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: theme.colors.text,
    paddingHorizontal: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surface,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    elevation: 2,
    paddingHorizontal: 10,
  },
  inputWrapperFocused: {
    borderColor: theme.colors.primary,
  },
  currencySymbol: {
    fontSize: 16,
    color: theme.colors.text,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: theme.colors.text,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.surface,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
    color: theme.colors.text,
  },
  currencyText: {
    fontSize: 16,
    marginVertical: 15,
    color: theme.colors.text,
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
    color: theme.colors.text,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Questionnaire;
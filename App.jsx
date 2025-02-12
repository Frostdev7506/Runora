// App.js (or your main app file)
import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper'; // Import
import { NavigationContainer } from '@react-navigation/native'; // Import
import MyStack from './navigation/Stack';  // Assuming you have a Stack Navigator
import useStore, { initializeBudgetUpdater } from './store/store'; // Import initializeBudgetUpdater


// Define your custom theme
const theme = {
    ...DefaultTheme, // Start with the default theme
    colors: {
        ...DefaultTheme.colors, // Include default colors
        primary: '#008080',        // Your main color
        onPrimary: '#ffffff',      // Color of text/icons on primary color
        primaryContainer: '#e0f7fa', // Lighter shade of primary
        onPrimaryContainer: '#004d4d', // Darker shade of primary, for text on primaryContainer
        secondary: '#00B4A2',      // Your secondary color
        onSecondary: '#ffffff',    // Color of text/icons on secondary color
        secondaryContainer: '#c2f5ed', // Lighter shade of secondary
        onSecondaryContainer: '#006b60', // Darker shade of secondary
        tertiary: '#e0f7fa',       // Light teal background
        surface: '#ffffff',        // Background of modal, cards
        onSurface: '#000000',     // Text color on surface
        surfaceVariant: '#f0f0f0',  // A slightly different surface color (e.g., for input fields)
        onSurfaceVariant: '#757575', // Placeholder text color
        outline: '#008080',        // Input border color, other outlines
        error: '#B00020',          // Error color
        onError: '#ffffff',        // Text color on error color
        background: '#ffffff',      // App background
        onBackground: '#000000',    // Text color on background
        inverseSurface: '#333333',    // Inverse of surface (for dark mode, if needed)
        inverseOnSurface: '#ffffff',  // Text color on inverseSurface
        inversePrimary: '#90ee90',      // Light green, for example.  A "reversed" primary.

    },
};

const App = () => {
    

    React.useEffect(() => {
      initializeBudgetUpdater();
    }, []);


  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <NavigationContainer>
          <MyStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
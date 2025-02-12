// App.js (or your main app file)
import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import MyStack from './navigation/Stack';
import useStore, { initializeBudgetUpdater } from './store/store';

// Create custom MD3 theme
const customTheme = {
  ...MD3LightTheme,
  "colors": {
    "primary": "rgb(0, 128, 128)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(224, 247, 250)",
    "onPrimaryContainer": "rgb(0, 77, 77)",
    "secondary": "rgb(0, 180, 162)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(194, 245, 237)",
    "onSecondaryContainer": "rgb(0, 107, 96)",
    "tertiary": "rgb(224, 247, 250)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(240, 247, 250)",
    "onTertiaryContainer": "rgb(0, 77, 77)",
    "error": "rgb(176, 0, 32)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "rgb(255, 255, 255)",
    "onBackground": "rgb(25, 28, 29)",
    "surface": "rgb(255, 255, 255)",
    "onSurface": "rgb(25, 28, 29)",
    "surfaceVariant": "rgb(240, 240, 240)",
    "onSurfaceVariant": "rgb(117, 117, 117)",
    "outline": "rgb(0, 128, 128)",
    "outlineVariant": "rgb(224, 247, 250)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(51, 51, 51)",
    "inverseOnSurface": "rgb(255, 255, 255)",
    "inversePrimary": "rgb(144, 238, 144)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(247, 247, 247)",
      "level2": "rgb(242, 242, 242)",
      "level3": "rgb(237, 237, 237)",
      "level4": "rgb(235, 235, 235)",
      "level5": "rgb(232, 232, 232)"
    }
  }
};

// Adapt the navigation theme
const { LightTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
});

// Combine the themes
const theme = {
  ...customTheme,
  ...LightTheme,
};

const App = () => {

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <NavigationContainer theme={theme}>
          <MyStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
import React from 'react';
import { View, StyleSheet, Animated, StatusBar } from 'react-native';
import { Text, IconButton, useTheme, Surface } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedTitle from './AnimatedTitle';

const Header = ({ opacity, handleSettings, handleOpenBackupMenu }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      paddingTop: insets.top,
      backgroundColor: theme.colors.elevation.level2,
    },
    headerStyles: {
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.elevation.level3,
    },
    headerTitle: {
      fontSize: 28,
      fontFamily: theme.fonts.headlineMedium.fontFamily,
      color: theme.colors.primary,
      letterSpacing: 0.5,
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    iconButton: {
      margin: 0,
      borderRadius: theme.roundness * 2,
    },
    iconButtonRipple: {
      borderless: true,
      color: theme.colors.primary,
    },
    leftSection: {
      flex: 1,
    },
    centerSection: {
      flex: 2,
      alignItems: 'center',
    },
    rightSection: {
      flex: 1,
      alignItems: 'flex-end',
    },
  });

  return (
    <Surface style={styles.container} elevation={2}>
      <StatusBar
        backgroundColor={theme.colors.elevation.level2}
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />
      <Animated.View 
        style={[
          styles.headerStyles,
          { opacity }
        ]}
      >
        <View style={styles.leftSection} />
        <View style={styles.centerSection}>
          <Text style={styles.headerTitle}>
            <AnimatedTitle>Home</AnimatedTitle>
          </Text>
        </View>
        <View style={styles.rightSection}>
          <View style={styles.iconContainer}>
            <IconButton
              icon="cog-outline"
              iconColor={"#008080"}
              size={24}
              onPress={handleSettings}
              style={styles.iconButton}
              rippleColor={"#008080"}
              animated={true}
            />
            <IconButton
              icon="cloud-upload-outline"
              iconColor={"#008080"}
              size={24}
              onPress={handleOpenBackupMenu}
              style={styles.iconButton}
              rippleColor={"#008080"}
              animated={true}
            />
          </View>
        </View>
      </Animated.View>
    </Surface>
  );
};

export default Header;
// Header.jsx
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import AnimatedTitle from './AnimatedTitle';

const Header = ({ opacity, handleSettings, handleOpenBackupMenu }) => {
  return (
    <View style={styles.headerStyles}>
      <Animated.View style={{ opacity }} />
      <Text style={styles.headerTitle}>
        <AnimatedTitle>Home</AnimatedTitle>
      </Text>

      <View style={styles.iconContainer}>
        <IconButton
          icon="cog-outline"
          iconColor="#008080"
          size={28}
          onPress={handleSettings}
        />
        <IconButton
          icon="cloud-upload-outline"
          iconColor="#008080"
          size={28}
          onPress={handleOpenBackupMenu}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyles: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
  },
  iconContainer: {
    flexDirection: 'row',
  },
});

export default Header;
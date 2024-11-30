import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
const SettingsScreen = () => {
  const navigation = useNavigation();

  const settings = [
    {title: 'Profile', icon: 'person-circle-outline', screen: 'Stats'},
    {
      title: 'General Settings',
      icon: 'pencil-outline',
      screen: 'Questionnaire',
    },

    // {
    //   title: 'Notifications',
    //   icon: 'notifications-outline',
    //   screen: 'Notifications',
    // },
    // {title: 'Appearance', icon: 'color-palette-outline', screen: 'Appearance'},
    // {title: 'Security', icon: 'lock-closed-outline', screen: 'Security'},
    // {title: 'About', icon: 'information-circle-outline', screen: 'About'},
    // {title: 'Logout', icon: 'log-out-outline', screen: 'Logout'},
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* User Header */}
      <View style={styles.header}>
        const navigation = useNavigation();
        <Text style={styles.headerText}>Settings</Text>
      </View>

      {/* Settings Items */}
      {settings.map((item, index) => (
        <SettingItem
          key={index}
          title={item.title}
          icon={item.icon}
          onPress={() => navigation.navigate(item.screen)}
        />
      ))}
    </ScrollView>
  );
};

const SettingItem = ({title, icon, onPress}) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <Icon name={icon} size={24} color="#666" />
    <Text style={styles.settingText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#008080',
    paddingVertical: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingText: {
    color: '#333',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default SettingsScreen;

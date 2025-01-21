import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import useStore from '../store/store';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For icons

const BackupMenu = ({ visible, onClose }) => {
  const { exportData, loadFromStorage } = useStore();
  const [backupPath, setBackupPath] = useState('');

  const handleExportData = async () => {
    try {
      const filePath = await exportData(); // Call the exportData method from the store
      setBackupPath(filePath); // Save the backup path to state
      Alert.alert('Success', `Data exported successfully to:\n${filePath}`);
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data.');
    }
  };

  const handleImportData = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      if (results.length > 0) {
        const fileContent = await RNFS.readFile(results[0].uri, 'utf8');
        const parsedData = JSON.parse(fileContent);

        // Update the state with the imported data
        await AsyncStorage.setItem('@budgetAppData', JSON.stringify(parsedData));
        await loadFromStorage(); // Reload the state from storage
        Alert.alert('Success', 'Data imported successfully.');
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the import process');
      } else {
        console.error('Error importing data:', err);
        Alert.alert('Error', 'Failed to import data.');
      }
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.title}>Backup & Restore</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleExportData}>
              <Icon name="backup" size={20} color="#fff" />
              <Text style={styles.buttonText}>Export Data</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleImportData}>
              <Icon name="restore" size={20} color="#fff" />
              <Text style={styles.buttonText}>Import Data</Text>
            </TouchableOpacity>
          </View>

          {backupPath && (
            <View style={styles.backupInfo}>
              <Text style={styles.backupInfoText}>
                Your backup is stored at:
              </Text>
              <Text style={styles.backupPathText}>{backupPath}</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  backupInfo: {
    width: '100%',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  backupInfoText: {
    fontSize: 14,
    color: '#333',
  },
  backupPathText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});

export default BackupMenu;
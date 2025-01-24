import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';
import useStore from '../store/store';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '@react-navigation/native';
import { Surface, Divider } from 'react-native-paper';
import { Alert } from 'react-native';

const BackupMenu = ({ visible, onClose }) => {
  const { exportData, loadFromStorage } = useStore();
  const [backupPath, setBackupPath] = useState('');
  const { colors } = useTheme();

    const handleExportData = async () => {
      try {
        const filePath = await exportData();
        setBackupPath(filePath);
        Alert.alert(
          'Success',
          `Data exported to your Downloads folder`,
        );
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

          await AsyncStorage.setItem('@budgetAppData', JSON.stringify(parsedData));
          await loadFromStorage();
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
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
        <View style={styles.modalContainer}>
            <Surface style={[styles.modalContent, {}]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="times" size={24} color={colors.onSurface} />
          </TouchableOpacity>
                <Text style={[styles.modalTitle, {color: colors.onSurface}]}>Backup & Restore</Text>

          <View style={styles.contentContainer}>
            <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>
              Safely backup your financial data or restore from a previous backup
            </Text>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.button, {}]}
                  onPress={handleExportData}
                  activeOpacity={0.9}
                >
                <View style={styles.buttonContent}>
                  <Icon 
                    name="cloud-upload" 
                    size={24} 
                    color={colors.onPrimary} 
                    style={styles.buttonIcon}
                  />
                  <View>
                    <Text style={[styles.buttonTitle, { color: colors.onPrimary }]}>
                      Export Backup
                    </Text>
                    <Text style={[styles.buttonSubtitle, { color: colors.onSurfaceVariant }]}>
                      Save to your device
                    </Text>
                  </View>
                  </View>
                  <Icon 
                      name="chevron-right" 
                      size={24} 
                      color={colors.onPrimary} 
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, {}]}
                  onPress={handleImportData}
                  activeOpacity={0.9}
                >
                   <View style={styles.buttonContent}>
                    <Icon 
                      name="cloud-download" 
                      size={24} 
                      color={colors.onPrimary} 
                      style={styles.buttonIcon}
                  />
                    <View>
                      <Text style={[styles.buttonTitle, { color: colors.onPrimary }]}>
                        Import Backup
                      </Text>
                      <Text style={[styles.buttonSubtitle, { color: colors.onSurfaceVariant }]}>
                        Restore from file
                      </Text>
                  </View>
                </View>
                 <Icon 
                      name="chevron-right" 
                      size={24} 
                      color={colors.onPrimary} 
                  />
                </TouchableOpacity>
            </View>
            {backupPath && (
                <Surface
                  style={[styles.backupInfo, { backgroundColor: colors.surfaceVariant }]}
                  elevation={1}
                >
                  <Icon
                    name="check-circle"
                    size={20}
                    color={colors.onSurfaceVariant}
                    style={styles.successIcon}
                  />
                  <View style={styles.backupTextContainer}>
                    <Text style={[styles.backupInfoText, { color: colors.onSurfaceVariant }]}>
                      Backup created successfully
                    </Text>
                    <Text
                      style={[styles.backupPathText, { color: colors.onSurfaceVariant }]}
                      selectable
                    >
                      {backupPath}
                    </Text>
                  </View>
                </Surface>
              )}
          </View>
            </Surface>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
     modalContent: {
    backgroundColor: '#fff',
    padding: 24, // Increased padding
    borderRadius: 16, // Rounded corners
    width: '90%', // Wider modal
    alignItems: 'center',
    elevation: 8, // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
   contentContainer: {
      marginTop: 16,
    },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
   buttonGroup: {
    gap: 12,
  },
    button: {
        borderRadius: 16,
        backgroundColor: '#008080',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 2,
  },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        
    },
    buttonIcon: {
        marginRight: 16,
    },
    buttonTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
  buttonSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
    backupInfo: {
        marginTop: 24,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    successIcon: {
        marginRight: 12,
    },
    backupTextContainer: {
        flex: 1,
    },
    backupInfoText: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    backupPathText: {
        fontSize: 13,
        fontFamily: Platform.OS === 'android' ? 'monospace' : 'Menlo',
        opacity: 0.9,
    },
});

export default BackupMenu;
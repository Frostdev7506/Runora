import React, { useRef } from 'react';
import { View, Animated, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useStore from '../store/store';
import { 
  Text, 
  IconButton, 
  useTheme, 
  Surface,
  Chip
} from 'react-native-paper';

const ExpenseCard = ({ expense }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const deleteExpense = useStore((state) => state.deleteExpense);
  const theme = useTheme();
  const { symbol } = useStore();
  const getTags = useStore(state => state.getTags);
  const allTags = getTags();

  // Get tags for this expense
  const expenseTags = expense.tags?.map(tagId => 
    allTags.find(tag => tag.id === tagId)
  ).filter(Boolean) || [];

  // Get the main tag (first tag or default)
  const mainTag = expenseTags[0] || {
    name: expense.category || 'other',
    color: '#6C5CE7',
    icon: '📝',
    label: expense.category || 'Other'
  };

  const animate = (value) => {
    Animated.spring(scaleAnim, {
      toValue: value,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleExpensePress = () => {
    const month = expense.date.substring(0, 7);
    navigation.navigate('EditExpense', {
      ...expense,
      month,
      expenseId: expense?.id,
      date: expense.date,
    });
  };

  const handleDelete = () => {
    if (expense?.id) {
      Alert.alert(
        'Delete Expense',
        'Are you sure you want to delete this expense?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: async () => {
              try {
                const month = expense.date.substring(0, 7);
                await deleteExpense(month, expense.id);
              } catch (error) {
                console.error('Error deleting expense:', error);
                Alert.alert('Error', 'Failed to delete expense. Please try again.');
              }
            }
          },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleExpensePress}
        onPressIn={() => animate(0.98)}
        onPressOut={() => animate(1)}
      >
        <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]} elevation={2}>
          <View style={styles.contentContainer}>
            <View style={[styles.categoryIcon, { backgroundColor: `${mainTag.color}15` }]}>
              <Text style={{ fontSize: 24 }}>{mainTag.icon}</Text>
            </View>

            <View style={styles.mainContent}>
              <Text style={[styles.title, { color: theme.colors.onSurface }]} numberOfLines={1}>
                {expense.name}
              </Text>
              <Text style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>
                {new Date(expense.date).toLocaleDateString('en-US', { 
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
              <View style={styles.amountContainer}>
                <Text style={[styles.symbol, { color: mainTag.color }]}>{symbol}</Text>
                <Text style={[styles.amount, { color: mainTag.color }]}>
                  {Number(expense.amount).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Text>
              </View>
              
              {expenseTags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {expenseTags.map((tag) => (
                    <Chip
                      key={tag.id}
                      mode="outlined"
                      compact
                      style={[
                        styles.tag,
                        {
                          backgroundColor: `${tag.color}15`,
                          borderColor: tag.color,
                        }
                      ]}
                      textStyle={{ color: tag.color, fontSize: 12 }}
                    >
                      {tag.label || tag.name}
                    </Chip>
                  ))}
                </View>
              )}
            </View>

            <IconButton
              icon="trash-can-outline"
              iconColor={theme.colors.error}
              size={20}
              onPress={handleDelete}
              style={styles.deleteButton}
            />
          </View>
        </Surface>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 2,
    marginVertical: 8,
  },
  surface: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  contentContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mainContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    marginBottom: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
  },
  symbol: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 2,
  },
  deleteButton: {
    margin: 0,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  tag: {
    height: 30,
  },
});

export default ExpenseCard;
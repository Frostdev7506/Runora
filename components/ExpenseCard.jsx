import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ExpenseCard = ({expense}) => {
  return (
    <View style={styles.card}>
      <Icon name="calendar" size={24} color="#008080" />
      <Text style={styles.cardText}>{expense.date}</Text>
      <Icon name="tag" size={24} color="#008080" />
      <Text style={styles.cardText}>{expense.name}</Text>
      <Icon name="dollar" size={24} color="#008080" />
      <Text style={styles.cardText}>{expense.amount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 14,
    color: '#008080',
    marginLeft: 10,
  },
});

export default ExpenseCard;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import useStore from '../../store/store';
import DateTimePickerModal from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditExpenseScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { month, expenseId, date: expenseDate, name, amount } = route.params;

    console.log("route params", typeof amount);

    const updateExpense = useStore(state => state.editExpense);
    const getExpenses = useStore(state => state.getExpenses);

    const [expenseName, setExpenseName] = useState(name || '');
    const [expenseAmount, setExpenseAmount] = useState(String(amount) || '');
    const [date, setDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    useEffect(() => {
        const expenses = getExpenses(month);
         console.log('Expenses:------------', expenses);

        const expense = expenses.find(e => e.id === expenseId);
        console.log("Selected Expense", expense);


        if (expense) {
            const parsedDate = new Date(expense.date);
            if (isNaN(parsedDate.getTime())) {
                console.error('Invalid date:', expense.date);
                setDate(new Date());
            } else {
                setDate(parsedDate);
                setExpenseName(expense.name);
                setExpenseAmount(String(expense.amount));
            }
        } else if (expenseDate) {
            const parsedDate = new Date(expenseDate);
            if (isNaN(parsedDate.getTime())) {
                setDate(new Date());
            } else {
                setDate(parsedDate);
            }
        }
    }, [month, expenseId, getExpenses, expenseDate]);



    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (selectedDate) => {
        setDate(selectedDate);
        hideDatePicker();
    };

    const handleUpdateExpense = () => {
        const updatedExpense = {
            name: expenseName,
            amount: parseFloat(expenseAmount),
            date: date.toISOString().split('T')[0],
        };
        updateExpense(month, expenseId, updatedExpense);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
             <Icon name="money" size={60} color="#008080" style={styles.icon} />
            <Text style={styles.title}>Edit Expense</Text>
            <TextInput
                style={styles.input}
                placeholder="Expense Name"
                value={expenseName}
                onChangeText={setExpenseName}
            />
            <TextInput
                style={styles.input}
                placeholder="Expense Amount"
                value={expenseAmount}
                onChangeText={setExpenseAmount}
                keyboardType="numeric"
            />

           <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
                <Text style={styles.datePickerButtonText}>
                    {date ? date.toLocaleDateString() : 'Select Date'}
                </Text>
            </TouchableOpacity>

            {isDatePickerVisible && (
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    value={date}
                />
            )}

           <TouchableOpacity style={styles.button} onPress={handleUpdateExpense}>
                <Text style={styles.buttonText}>Update Expense</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
     container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
        fontSize: 18,
        width: '90%',
    },
     datePickerButton: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#000',
        padding: 15,
        
        marginBottom: 20,
        borderRadius: 8,
        alignItems: 'center',
        width: '90%', // Same width as text input
    },
    datePickerButtonText: {
        fontSize: 18,
        color: '#333',
    },
    button: {
        backgroundColor: '#008080', // Primary color
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        width: '90%',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default EditExpenseScreen;
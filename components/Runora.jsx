// import React from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   FlatList,
//   StyleSheet,
// } from 'react-native';
// import useStore from '../store/store';

// const Runora = () => {
//   const {budgets, addBudget, updateBudget} = useStore();

//   const [month, setMonth] = React.useState('');
//   const [budget, setBudget] = React.useState('');

//   const handleAddBudget = () => {
//     addBudget(month, budget);
//     setMonth('');
//     setBudget('');
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Runora - Budget Tracker</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Month"
//         value={month}
//         onChangeText={setMonth}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Budget"
//         value={budget}
//         onChangeText={setBudget}
//         keyboardType="numeric"
//       />
//       <Button title="Add/Update Budget" onPress={handleAddBudget} />
//       <FlatList
//         data={Object.keys(budgets)}
//         keyExtractor={item => item}
//         renderItem={({item}) => (
//           <View style={styles.budgetItem}>
//             <Text>
//               {item}: ₹{budgets[item]}
//             </Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f0f0f0',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 20,
//     paddingLeft: 10,
//   },
//   budgetItem: {
//     padding: 10,
//     marginVertical: 5,
//     backgroundColor: '#fff',
//     borderColor: '#ddd',
//     borderWidth: 1,
//   },
// });

// export default Runora;

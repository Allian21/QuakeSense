import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const data = [
  { magnitude: 5.8, date: '1/1/2024 4:12 AM' },
  { magnitude: 6.1, date: '12/5/2023 2:47 PM' },
  { magnitude: 4.9, date: '9/10/2023 10:15 AM' },
  { magnitude: 6.5, date: '7/8/2023 3:00 PM' },
  { magnitude: 5.0, date: '3/3/2023 1:00 AM' },
  { magnitude: 4.8, date: '1/1/2023 8:00 PM' },
  { magnitude: 6.2, date: '11/12/2022 2:00 PM' },
];

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Full Earthquake History</Text>
      <Text style={styles.subtitle}>All recorded events</Text>

      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.historyText}>{item.magnitude} Magnitude</Text>
            <Text style={styles.historyDate}>{item.date}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 16,
  },
  historyItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: 12,
  },
  historyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

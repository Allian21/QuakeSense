import { View, Text, FlatList, StyleSheet } from 'react-native';

const data = [
  { magnitude: 11, date: '2/2/2023 12:00 AM' },
  { magnitude: 9, date: '3/2/2023 9:00 PM' },
  { magnitude: 7, date: '6/2/2022 1:00 AM' },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Magnitude Circle */}
      <View style={styles.magnitudeContainer}>
        <Text style={styles.label}>magnitude</Text>
        <Text style={styles.magnitude}>10</Text>
      </View>

      {/* History Header */}
      <Text style={styles.historyTitle}>History</Text>
      <Text style={styles.subtext}>Last Five Earthquakes</Text>

      {/* Earthquake List */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.historyText}>{item.magnitude} Magnitude</Text>
            <Text style={styles.historyDate}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  magnitudeContainer: {
    backgroundColor: '#87CEFA',
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    textTransform: 'uppercase',
  },
  magnitude: {
    fontSize: 72,
    color: '#fff',
    fontWeight: 'bold',
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
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
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
  },
});

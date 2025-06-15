import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Button,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { height } = Dimensions.get('window');

const data = [
  { magnitude: 5.8, date: '1/1/2024 4:12 AM' },
  { magnitude: 6.1, date: '12/5/2023 2:47 PM' },
  { magnitude: 4.9, date: '9/10/2023 10:15 AM' },
  { magnitude: 6.5, date: '7/8/2023 3:00 PM' },
  { magnitude: 5.0, date: '3/3/2023 1:00 AM' },
  { magnitude: 6.3, date: '2/14/2023 11:00 PM' },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Top Half - Magnitude */}
      <LinearGradient
        colors={['#A1CEDC', '#69AFC9']}
        style={styles.magnitudeSection}
      >
        <Text style={styles.magnitudeLabel}>Magnitude</Text>
        <Text style={styles.magnitudeValue}>10</Text>
      </LinearGradient>

      {/* Bottom Half - History Card */}
      <View style={styles.historyCard}>
        <Text style={styles.historyTitle}>History</Text>
        <Text style={styles.subtext}>Last Earthquakes</Text>

        <FlatList
          data={data}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.historyText}>{item.magnitude} Magnitude</Text>
              <Text style={styles.historyDate}>{item.date}</Text>
            </View>
          )}
        />

        <View style={styles.buttonContainer}>
          <Button title="Go to History" onPress={() => router.push('/history')} color="#2979FF" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  magnitudeSection: {
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 40 : 60,
  },
  magnitudeLabel: {
    fontSize: 22,
    fontWeight: '600',
    color: '#003B4D',
    marginBottom: 10,
  },
  magnitudeValue: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#003B4D',
  },
  historyCard: {
    height: height * 0.5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingTop: 20,
    marginTop: -40, // to slightly overlap
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  subtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  historyItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 24,
    marginBottom: 12,
  },
  historyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  historyDate: {
    fontSize: 14,
    color: '#555',
  },
  buttonContainer: {
    marginTop: 10,
  },
});

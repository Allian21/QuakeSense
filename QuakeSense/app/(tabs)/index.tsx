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
  { magnitude: 5.9, date: '1/1/2024 4:12 AM' },
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
      <View style={styles.historyHeader}>
      <Text style={styles.historyTitle}>History</Text>
      <Text style={styles.subtext}>Past Earthquakes</Text>
  </View>

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
  historyHeader: {
    marginLeft: 30,   
    marginBottom: 12, 
  },
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
    color: '#FFFFFF',
    marginBottom: 1,
  },
  magnitudeValue: {
    fontSize: 200,
    color: '#FFFFFF'
  },
  historyCard: {
    height: height * 0.5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingTop: 20,
    marginTop: -40, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  historyTitle: {
    fontSize: 40,
  
    marginBottom: 4,
    color: '#000',
  },
  subtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 32,         
    paddingVertical: 20,      
    paddingHorizontal: 24,    
    marginBottom: 16,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
},
  historyText: {
    fontSize: 30,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 17,
    color: '#555',
  },
  buttonContainer: {
    marginTop: 10,
  },
});

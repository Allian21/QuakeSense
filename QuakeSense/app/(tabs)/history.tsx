import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { router } from 'expo-router';
import { db } from '../../firebaseCfg';
import { ref, onValue, get } from 'firebase/database';

// Classification function
function classifyMagnitude(Mw: number) {
  if (Mw < 2.0) return "Micro";
  else if (Mw < 3.0) return "Minor";
  else if (Mw < 4.0) return "Light";
  else if (Mw < 5.0) return "Moderate";
  else if (Mw < 6.0) return "Strong";
  else if (Mw < 7.0) return "Major";
  else return "Great";
}

export default function HistoryScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    const earthquakesRef = ref(db, 'earthquake/events');
    const snapshot = await get(earthquakesRef);
    const val = snapshot.val();
    if (val) {
      const arr = Object.values(val);
      setData(arr.reverse());
    } else {
      setData([]);
    }
    setRefreshing(false);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // Also listen for live updates
    const earthquakesRef = ref(db, 'earthquake/events');
    const unsubscribe = onValue(earthquakesRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const arr = Object.values(val);
        setData(arr.reverse());
      } else {
        setData([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleItemPress = (item: any) => {
    Alert.alert(
      `Earthquake Details`,
      `Magnitude: ${Number(item.magnitude).toFixed(1)}\nClassification: ${item.classification || classifyMagnitude(item.magnitude)}\nTime: ${item.timestamp ? new Date(item.timestamp * 1000).toLocaleString() : ''}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Full Earthquake History</Text>
      <Text style={styles.subtitle}>All recorded events (pull down to refresh, tap for details)</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(_, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchData} colors={['#4A90E2']} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.historyItem}
              activeOpacity={0.8}
              onPress={() => handleItemPress(item)}
            >
              <Text style={styles.historyText}>
                Magnitude {Number(item.magnitude).toFixed(1)}
              </Text>
              <Text style={styles.historyDate}>
                {item.timestamp
                  ? new Date(item.timestamp * 1000).toLocaleString()
                  : ''}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
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
    backgroundColor: '#f4faff',
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
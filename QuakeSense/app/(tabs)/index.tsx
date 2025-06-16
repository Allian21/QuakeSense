import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Button,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { db } from '../../firebaseCfg';
import { ref, onValue } from 'firebase/database';

const { height } = Dimensions.get('window');

function classifyMagnitude(Mw: number) {
  if (Mw < 2.0) return "Micro";
  else if (Mw < 3.0) return "Minor";
  else if (Mw < 4.0) return "Light";
  else if (Mw < 5.0) return "Moderate";
  else if (Mw < 6.0) return "Strong";
  else if (Mw < 7.0) return "Major";
  else return "Great";
}

export default function HomeScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
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
      setRefreshing(false);
    });
    return () => unsubscribe();
  }, []);

  // Pulse animation for magnitude
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const latest = data.length > 0 ? data[0] : null;
  const latestMagnitude =
    latest && latest.magnitude !== undefined
      ? Number(latest.magnitude).toFixed(1)
      : '-';
  const latestClassification =
    latest && latest.magnitude !== undefined
      ? classifyMagnitude(latest.magnitude)
      : '';

  const handleRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    // The onValue listener will handle updating data and loading state
  };

  return (
    <View style={styles.container}>
      {/* Top Half - Magnitude */}
      <LinearGradient
        colors={['#A1CEDC', '#69AFC9']}
        style={styles.magnitudeSection}
      >
        <Text style={styles.magnitudeLabel}>Latest Magnitude</Text>
        <Animated.Text
          style={[
            styles.magnitudeValue,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          {loading ? <ActivityIndicator color="#fff" /> : latestMagnitude}
        </Animated.Text>
        {latest && latest.timestamp && (
          <Text style={styles.latestTime}>
            {new Date(latest.timestamp * 1000).toLocaleString()}
          </Text>
        )}
      </LinearGradient>

      {/* Bottom Half - History Card */}
      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Recent Events</Text>
          <Text style={styles.subtext}>Tap an event for details</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2979FF" />
        ) : (
          <FlatList
            data={data.slice(0, 5)}
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            // Removed refreshing and onRefresh props
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.historyItem}
                activeOpacity={0.8}
                onPress={() =>
                  alert(
                    `Magnitude: ${Number(item.magnitude).toFixed(1)}\nClassification: ${item.classification || classifyMagnitude(item.magnitude)}\nTime: ${item.timestamp ? new Date(item.timestamp * 1000).toLocaleString() : ''}`
                  )
                }
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
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  classificationText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '600',
    marginTop: 8,
  },
  tapHint: {
    fontSize: 14,
    color: '#e0f7fa',
    marginTop: 4,
  },
  latestTime: {
    fontSize: 16,
    color: '#e0f7fa',
    marginTop: 10,
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
    backgroundColor: '#f4faff',
    borderRadius: 32,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 16,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  historyText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 15,
    color: '#555',
  },
  buttonContainer: {
    marginTop: 10,
  },
});
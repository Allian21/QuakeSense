import React, { useEffect, useState, useRef } from 'react';
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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { db } from '../../firebaseCfg';
import { ref, onValue } from 'firebase/database';
import * as Notifications from 'expo-notifications';

const { height } = Dimensions.get('window');

type EarthquakeEvent = {
  magnitude: number;
  timestamp?: number;
  classification?: string;
};

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
  const [data, setData] = useState<EarthquakeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [lastEventId, setLastEventId] = useState<string | null>(null);

  // Notification listeners (optional, for completeness)
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    Notifications.requestPermissionsAsync();

    notificationListener.current = Notifications.addNotificationReceivedListener(() => {
      // handle notification received in foreground if needed
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(() => {
      // handle notification response
    });

    return () => {
      if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const earthquakesRef = ref(db, 'earthquake/events');
    const unsubscribe = onValue(earthquakesRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        // arr: [ [id, data], ... ]
        const arr = Object.entries(val).reverse() as [string, EarthquakeEvent][];
        setData(arr.map(([_, v]) => v));
        const [latestId, latestEvent] = arr[0];

        // Only show alert if this is a new event
        if (lastEventId && latestId !== lastEventId) {
          // In-app alert for any new event
          Alert.alert(
            "New Earthquake Detected",
            `Magnitude ${Number(latestEvent.magnitude).toFixed(1)} at ${latestEvent.timestamp ? new Date(latestEvent.timestamp * 1000).toLocaleString() : ''}`
          );

          // Push notification for strong/major
          if (latestEvent.magnitude >= 5 && latestEvent.magnitude < 6) {
            Notifications.scheduleNotificationAsync({
              content: {
                title: "Warning: Strong Earthquake",
                body: `Magnitude ${Number(latestEvent.magnitude).toFixed(1)}. Be cautious of visible damage around you and get away from dangerous areas.`,
              },
              trigger: null,
            });
          } else if (latestEvent.magnitude >= 6) {
            Notifications.scheduleNotificationAsync({
              content: {
                title: "Evacuate Immediately!",
                body: `Magnitude ${Number(latestEvent.magnitude).toFixed(1)}. Evacuate quickly away from buildings. Do not stay indoors!`,
              },
              trigger: null,
            });
          }
        }
        setLastEventId(latestId);
      } else {
        setData([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEventId]);

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
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.historyItem}
                activeOpacity={0.8}
                onPress={() =>
                  Alert.alert(
                    `Earthquake Details`,
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
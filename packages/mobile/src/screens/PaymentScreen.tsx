import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useMovieStore } from '../store/movieStore';

type PaymentScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Payment'>;
  route: RouteProp<RootStackParamList, 'Payment'>;
};

interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

export default function PaymentScreen({ navigation, route }: PaymentScreenProps) {
  const { showtimeId, selectedSeats, ticketQuantities } = route.params;
  const { getShowtimeById, purchaseTickets } = useMovieStore();
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const showtime = getShowtimeById(showtimeId);

  useEffect(() => {
    if (showtime) {
      navigation.setOptions({
        title: 'Payment',
      });
    }
  }, [showtime, navigation]);

  const totalPrice = Object.entries(ticketQuantities).reduce(
    (sum, [type, quantity]) => {
      const price = type === 'adult' ? 14.99 : type === 'child' ? 9.99 : 11.99;
      return sum + price * quantity;
    },
    0
  );

  const handleCardNumberChange = (text: string) => {
    // Format card number with spaces every 4 digits
    const formatted = text.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || text;
    setCardDetails((prev) => ({ ...prev, number: formatted }));
  };

  const handleExpiryChange = (text: string) => {
    // Format expiry as MM/YY
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 2) {
      setCardDetails((prev) => ({ ...prev, expiry: numbers }));
    } else {
      setCardDetails((prev) => ({
        ...prev,
        expiry: `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`,
      }));
    }
  };

  const handleCvvChange = (text: string) => {
    // Only allow numbers and max 4 digits
    const numbers = text.replace(/\D/g, '').slice(0, 4);
    setCardDetails((prev) => ({ ...prev, cvv: numbers }));
  };

  const validateCard = (): boolean => {
    if (cardDetails.number.replace(/\s/g, '').length < 16) {
      Alert.alert('Invalid Card', 'Please enter a valid card number');
      return false;
    }

    if (cardDetails.expiry.length < 5) {
      Alert.alert('Invalid Expiry', 'Please enter a valid expiry date');
      return false;
    }

    if (cardDetails.cvv.length < 3) {
      Alert.alert('Invalid CVV', 'Please enter a valid CVV');
      return false;
    }

    if (cardDetails.name.trim().length < 3) {
      Alert.alert('Invalid Name', 'Please enter the cardholder name');
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateCard()) return;

    setLoading(true);
    try {
      // In a real app, this would make an API call to process the payment
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const orderId = await purchaseTickets();
      navigation.replace('OrderConfirmation', { orderId });
    } catch (error) {
      Alert.alert(
        'Payment Failed',
        'There was an error processing your payment. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!showtime) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Showtime not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Seats:</Text>
            <Text style={styles.summaryValue}>{selectedSeats.length} selected</Text>
          </View>
          {Object.entries(ticketQuantities).map(([type, quantity]) => {
            if (quantity === 0) return null;
            return (
              <View key={type} style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}:
                </Text>
                <Text style={styles.summaryValue}>{quantity}</Text>
              </View>
            );
          })}
          <View style={[styles.summaryItem, styles.totalItem]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              value={cardDetails.number}
              onChangeText={handleCardNumberChange}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChangeText={handleExpiryChange}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                value={cardDetails.cvv}
                onChangeText={handleCvvChange}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              value={cardDetails.name}
              onChangeText={(text) => setCardDetails((prev) => ({ ...prev, name: text }))}
              autoCapitalize="words"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.disabledButton]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Pay ${totalPrice.toFixed(2)}</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Processing payment...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
  },
  totalItem: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  payButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#ff3b30',
    marginTop: 32,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#007AFF',
  },
}); 
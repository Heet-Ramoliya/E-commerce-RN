import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, CreditCard, MapPin, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Typography from '@/constants/Typography';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/data/orders';
import {
  confirmPlatformPayPayment,
  isPlatformPaySupported,
  PlatformPay,
} from '@stripe/stripe-react-native';

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState('shipping');
  const [processing, setProcessing] = useState(false);
  const [isExpressShipping, setIsExpressShipping] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  useEffect(() => {
    (async function () {
      if (!(await isPlatformPaySupported({ googlePay: { testEnv: true } }))) {
        console.log("Google Pay isn't supported on this device");
        Alert.alert('Google Pay is not supported on this device.');
        setSelectedPaymentMethod('card'); // Fallback to card if Google Pay is unsupported
      }
    })();
  }, []);

  // Shipping address form state
  const [shippingForm, setShippingForm] = useState({
    name: user?.name || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    nameOnCard: user?.name || '',
    expiration: '',
    cvv: '',
  });

  // Calculate order totals
  const subtotal = getCartTotal();
  const standardShipping = subtotal > 100 ? 0 : 10;
  const expressShippingCost = 80;
  const shipping = isExpressShipping ? expressShippingCost : standardShipping;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleShippingChange = (field, value) => {
    setShippingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field, value) => {
    setPaymentForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateShippingForm = () => {
    const { name, street, city, state, zip } = shippingForm;
    return name && street && city && state && zip;
  };

  const validatePaymentForm = () => {
    const { cardNumber, nameOnCard, expiration, cvv } = paymentForm;
    return cardNumber && nameOnCard && expiration && cvv;
  };

  const handleContinueToPayment = () => {
    if (validateShippingForm()) {
      setActiveStep('payment');
    } else {
      Alert.alert(
        'Missing Information',
        'Please fill in all shipping details.'
      );
    }
  };

  console.log('Payment Intent ID :: ', paymentIntentId);

  const fetchPaymentIntentClientSecret = async (paymentAmount) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/create-payment-intent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currency: 'usd', amount: paymentAmount }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const data = await response.json();
      setPaymentIntentId(data.paymentIntentId);
      return data.clientSecret;
    } catch (error) {
      console.error('Error fetching client secret:', error.message);
      Alert.alert('Error', error.message);
      return null;
    }
  };

  const pay = async () => {
    try {
      setProcessing(true);
      const paymentAmount = Math.round(total * 100);

      if (isNaN(paymentAmount) || paymentAmount <= 0) {
        Alert.alert('Invalid Amount', 'Please enter a valid amount.');
        setProcessing(false);
        return false;
      }

      const clientSecret = await fetchPaymentIntentClientSecret(paymentAmount);

      if (!clientSecret) {
        Alert.alert('Error', 'Failed to get client secret.');
        setProcessing(false);
        return false;
      }

      const { error, paymentIntent } = await confirmPlatformPayPayment(
        clientSecret,
        {
          googlePay: {
            testEnv: true,
            merchantName: 'Your Store Name',
            merchantCountryCode: 'US',
            currencyCode: 'USD',
            billingAddressConfig: {
              format: PlatformPay.BillingAddressFormat.Full,
              isPhoneNumberRequired: true,
              isRequired: true,
            },
            existingPaymentMethodRequired: false,
            isEmailRequired: true,
          },
        }
      );

      if (error) {
        console.error('Google Pay error:', error);
        Alert.alert(
          'Payment Error',
          error.message || 'Something went wrong with the payment.'
        );
        setProcessing(false);
        return false;
      }

      setPaymentIntentId(paymentIntent.id);
      Alert.alert('Success', 'The payment was confirmed successfully.');
      return true;
    } catch (error) {
      console.error('Unexpected payment error:', error);
      Alert.alert('Error', 'An unexpected error occurred during payment.');
      setProcessing(false);
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    if (selectedPaymentMethod === 'card' && !validatePaymentForm()) {
      Alert.alert('Missing Information', 'Please fill in all payment details.');
      return;
    }

    if (selectedPaymentMethod === 'googlePay') {
      const paymentSuccess = await pay();
      if (!paymentSuccess) {
        return; // Stop if payment fails
      }
    }

    setProcessing(true);

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newOrder = createOrder({
      userId: user.id,
      status: 'Processing',
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress: shippingForm,
      shippingMethod: isExpressShipping ? 'Express' : 'Standard',
      paymentMethod:
        selectedPaymentMethod === 'card'
          ? `Credit Card (ending in ${paymentForm.cardNumber.slice(-4)})`
          : 'Google Pay',
      paymentIntentId, // Include paymentIntentId for tracking
    });

    // Clear cart after successful order
    clearCart();
    setProcessing(false);

    // Navigate to order confirmation
    router.replace('/');

    // Show success message
    Alert.alert(
      'Order Placed Successfully',
      `Your order #${newOrder.id} has been placed and is being processed.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (activeStep === 'payment') {
              setActiveStep('shipping');
            } else {
              router.back();
            }
          }}
        >
          <ChevronLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressStep,
            activeStep === 'shipping' && styles.activeProgressStep,
          ]}
        >
          <MapPin
            size={20}
            color={
              activeStep === 'shipping'
                ? Colors.text.inverse
                : Colors.text.tertiary
            }
          />
          <Text
            style={[
              styles.progressStepText,
              activeStep === 'shipping' && styles.activeProgressStepText,
            ]}
          >
            Shipping
          </Text>
        </View>

        <View style={styles.progressLine} />

        <View
          style={[
            styles.progressStep,
            activeStep === 'payment' && styles.activeProgressStep,
          ]}
        >
          <CreditCard
            size={20}
            color={
              activeStep === 'payment'
                ? Colors.text.inverse
                : Colors.text.tertiary
            }
          />
          <Text
            style={[
              styles.progressStepText,
              activeStep === 'payment' && styles.activeProgressStepText,
            ]}
          >
            Payment
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {activeStep === 'shipping' && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Shipping Information</Text>

            <InputField
              label="Full Name"
              placeholder="Enter your full name"
              value={shippingForm.name}
              onChangeText={(value) => handleShippingChange('name', value)}
              required
            />

            <InputField
              label="Street Address"
              placeholder="Enter your street address"
              value={shippingForm.street}
              onChangeText={(value) => handleShippingChange('street', value)}
              required
            />

            <InputField
              label="City"
              placeholder="Enter your city"
              value={shippingForm.city}
              onChangeText={(value) => handleShippingChange('city', value)}
              required
            />

            <View style={styles.rowFields}>
              <InputField
                label="State"
                placeholder="State"
                value={shippingForm.state}
                onChangeText={(value) => handleShippingChange('state', value)}
                required
                style={styles.halfField}
              />

              <InputField
                label="ZIP Code"
                placeholder="ZIP"
                value={shippingForm.zip}
                onChangeText={(value) => handleShippingChange('zip', value)}
                keyboardType="numeric"
                required
                style={styles.halfField}
              />
            </View>

            <InputField
              label="Country"
              value={shippingForm.country}
              onChangeText={(value) => handleShippingChange('country', value)}
              editable={false}
            />

            <View style={styles.shippingOptions}>
              <Text style={styles.shippingOptionsTitle}>Shipping Method</Text>

              <TouchableOpacity
                style={[
                  styles.shippingOption,
                  !isExpressShipping && styles.selectedShippingOption,
                ]}
                onPress={() => setIsExpressShipping(false)}
              >
                <View style={styles.shippingOptionRadio}>
                  {!isExpressShipping && (
                    <View style={styles.shippingOptionRadioInner} />
                  )}
                </View>
                <View style={styles.shippingOptionContent}>
                  <View style={styles.shippingOptionHeader}>
                    <Text style={styles.shippingOptionName}>
                      Standard Shipping
                    </Text>
                    <Text style={styles.shippingOptionPrice}>
                      {standardShipping === 0
                        ? 'Free'
                        : `$${standardShipping.toFixed(2)}`}
                    </Text>
                  </View>
                  <Text style={styles.shippingOptionDescription}>
                    Estimated delivery in 5-7 business days
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.shippingOption,
                  styles.expressShippingOption,
                  isExpressShipping && styles.selectedShippingOption,
                ]}
                onPress={() => setIsExpressShipping(true)}
              >
                <View style={styles.shippingOptionRadio}>
                  {isExpressShipping && (
                    <View style={styles.shippingOptionRadioInner} />
                  )}
                </View>
                <View style={styles.shippingOptionContent}>
                  <View style={styles.shippingOptionHeader}>
                    <Text style={styles.shippingOptionName}>
                      Express Shipping
                    </Text>
                    <Text style={styles.shippingOptionPrice}>
                      ${expressShippingCost.toFixed(2)}
                    </Text>
                  </View>
                  <Text style={styles.shippingOptionDescription}>
                    Guaranteed delivery in 1-2 business days
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeStep === 'payment' && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Payment Information</Text>

            {/* Payment Method Selector */}
            <View style={styles.paymentOptions}>
              <Text style={styles.paymentOptionsTitle}>
                Select Payment Method
              </Text>

              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  selectedPaymentMethod === 'card' &&
                    styles.selectedPaymentOption,
                ]}
                onPress={() => setSelectedPaymentMethod('card')}
              >
                <View style={styles.paymentOptionRadio}>
                  {selectedPaymentMethod === 'card' && (
                    <View style={styles.paymentOptionRadioInner} />
                  )}
                </View>
                <View style={styles.paymentOptionContent}>
                  <View style={styles.paymentOptionHeader}>
                    <Text style={styles.paymentOptionName}>
                      Credit/Debit Card
                    </Text>
                    <CreditCard size={20} color={Colors.text.primary} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  selectedPaymentMethod === 'googlePay' &&
                    styles.selectedPaymentOption,
                ]}
                onPress={() => setSelectedPaymentMethod('googlePay')}
              >
                <View style={styles.paymentOptionRadio}>
                  {selectedPaymentMethod === 'googlePay' && (
                    <View style={styles.paymentOptionRadioInner} />
                  )}
                </View>
                <View style={styles.paymentOptionContent}>
                  <View style={styles.paymentOptionHeader}>
                    <Text style={styles.paymentOptionName}>Google Pay</Text>
                    <Image
                      source={{
                        uri: 'https://img.icons8.com/?size=100&id=d3FdjviJ7gNe&format=png&color=000000',
                      }}
                      style={styles.paymentOptionIcon}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Credit Card Form */}
            {selectedPaymentMethod === 'card' && (
              <View style={styles.paymentForm}>
                <InputField
                  label="Card Number"
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={paymentForm.cardNumber}
                  onChangeText={(value) =>
                    handlePaymentChange('cardNumber', value)
                  }
                  keyboardType="numeric"
                  required
                />
                <InputField
                  label="Name on Card"
                  placeholder="Enter name on card"
                  value={paymentForm.nameOnCard}
                  onChangeText={(value) =>
                    handlePaymentChange('nameOnCard', value)
                  }
                  required
                />
                <View style={styles.rowFields}>
                  <InputField
                    label="Expiration Date"
                    placeholder="MM/YY"
                    value={paymentForm.expiration}
                    onChangeText={(value) =>
                      handlePaymentChange('expiration', value)
                    }
                    required
                    style={styles.halfField}
                  />
                  <InputField
                    label="Security Code"
                    placeholder="CVV"
                    value={paymentForm.cvv}
                    onChangeText={(value) => handlePaymentChange('cvv', value)}
                    keyboardType="numeric"
                    required
                    style={styles.halfField}
                  />
                </View>
              </View>
            )}

            {/* Google Pay Placeholder */}
            {selectedPaymentMethod === 'googlePay' && (
              <View style={styles.paymentForm}>
                <Text style={styles.googlePayText}>
                  You will be prompted to pay with Google Pay when you place the
                  order.
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        {activeStep === 'shipping' ? (
          <Button
            title="Continue to Payment"
            onPress={handleContinueToPayment}
            fullWidth
          />
        ) : (
          <Button
            title="Place Order"
            onPress={handlePlaceOrder}
            loading={processing}
            fullWidth
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text.primary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.radius.full,
    backgroundColor: Colors.neutral[100],
    backgroundColor: Colors.neutral[100],
  },
  activeProgressStep: {
    backgroundColor: Colors.primary[600],
  },
  progressStepText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.sm,
    color: Colors.text.tertiary,
    marginLeft: Spacing.xs,
  },
  activeProgressStepText: {
    color: Colors.text.inverse,
  },
  progressLine: {
    height: 1,
    width: 40,
    backgroundColor: Colors.neutral[300],
    marginHorizontal: Spacing.md,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: Spacing.lg,
  },
  formTitle: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  rowFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfField: {
    width: '48%',
  },
  shippingOptions: {
    marginTop: Spacing.md,
  },
  shippingOptionsTitle: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  shippingOption: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: Spacing.radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  selectedShippingOption: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  expressShippingOption: {
    borderStyle: 'dashed',
  },
  shippingOptionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.neutral[400],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  shippingOptionRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary[600],
  },
  shippingOptionContent: {
    flex: 1,
  },
  shippingOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  shippingOptionName: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
  },
  shippingOptionPrice: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.primary[600],
  },
  shippingOptionDescription: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.text.tertiary,
  },
  paymentOptions: {
    marginTop: Spacing.md,
  },
  paymentOptionsTitle: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  paymentOption: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: Spacing.radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  selectedPaymentOption: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  paymentOptionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.neutral[400],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  paymentOptionRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary[600],
  },
  paymentOptionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentOptionHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentOptionName: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
  },
  paymentOptionIcon: {
    width: 20,
    height: 20,
  },
  paymentForm: {
    marginTop: Spacing.md,
  },
  googlePayText: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  orderSummary: {
    padding: Spacing.lg,
    backgroundColor: Colors.neutral[50],
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[300],
  },
  summaryTitle: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.md,
    color: Colors.text.tertiary,
  },
  summaryValue: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
  },
  totalRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  totalLabel: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text.primary,
  },
  totalValue: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.primary[600],
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    backgroundColor: Colors.background,
  },
});
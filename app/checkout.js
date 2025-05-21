import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, CreditCard, MapPin, Truck, X } from 'lucide-react-native';
import { useStripe, useGooglePay } from '@stripe/stripe-react-native';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Typography from '@/constants/Typography';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/data/orders';

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { isGooglePaySupported, initGooglePay, presentGooglePay } =
    useGooglePay();
  const [googlePaySupported, setGooglePaySupported] = useState(false);

  const [activeStep, setActiveStep] = useState('shipping');
  const [processing, setProcessing] = useState(false);
  const [isExpressShipping, setIsExpressShipping] = useState(false);

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
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // Initialize Google Pay
  React.useEffect(() => {
    async function checkGooglePay() {
      if (Platform.OS === 'android') {
        const supported = await isGooglePaySupported({
          testEnv: true, // Set to false in production
          existingPaymentMethodRequired: false,
          merchantName: 'Your Store Name',
        });
        setGooglePaySupported(supported);

        if (supported) {
          await initGooglePay({
            testEnv: true, // Set to false in production
            merchantName: 'Your Store Name',
            countryCode: 'US',
            billingAddressConfig: {
              format: 'FULL',
              isPhoneNumberRequired: true,
              isRequired: true,
            },
          });
        }
      }
    }
    checkGooglePay();
  }, [isGooglePaySupported, initGooglePay]);

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

  const handleGooglePay = async () => {
    try {
      setProcessing(true);

      // This would typically come from your backend
      const clientSecret = 'your_payment_intent_client_secret';

      const { error } = await presentGooglePay({
        clientSecret,
        forSetupIntent: false,
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      // Create new order
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
        paymentMethod: 'Google Pay',
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
    } catch (error) {
      Alert.alert('Error', error.message);
      setProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validatePaymentForm()) {
      Alert.alert('Missing Information', 'Please fill in all payment details.');
      return;
    }

    setProcessing(true);

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create new order
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
      paymentMethod: `Credit Card (ending in ${paymentForm.cardNumber.slice(
        -4
      )})`,
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

              <TouchableOpacity style={styles.shippingOption}>
                <View style={styles.shippingOptionRadio}>
                  <View style={styles.shippingOptionRadioInner} />
                </View>
                <View style={styles.shippingOptionContent}>
                  <View style={styles.shippingOptionHeader}>
                    <Text style={styles.shippingOptionName}>
                      Standard Shipping
                    </Text>
                    <Text style={styles.shippingOptionPrice}>
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </Text>
                  </View>
                  <Text style={styles.shippingOptionDescription}>
                    Estimated delivery in 5-7 business days
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeStep === 'payment' && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Payment Information</Text>

            {Platform.OS === 'android' && googlePaySupported && (
              <Button
                title="Pay with Google Pay"
                onPress={handleGooglePay}
                loading={processing}
                style={styles.googlePayButton}
                fullWidth
              />
            )}

            <View style={styles.paymentDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or pay with card</Text>
              <View style={styles.dividerLine} />
            </View>

            <InputField
              label="Card Number"
              placeholder="XXXX XXXX XXXX XXXX"
              value={paymentForm.cardNumber}
              onChangeText={(value) => handlePaymentChange('cardNumber', value)}
              keyboardType="numeric"
              required
            />

            <InputField
              label="Name on Card"
              placeholder="Enter name on card"
              value={paymentForm.nameOnCard}
              onChangeText={(value) => handlePaymentChange('nameOnCard', value)}
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
  googlePayButton: {
    marginBottom: Spacing.lg,
    backgroundColor: '#000',
  },
  paymentDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral[300],
  },
  dividerText: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.text.tertiary,
    marginHorizontal: Spacing.md,
  },
  orderSummary: {
    padding: Spacing.lg,
    backgroundColor: Colors.neutral[50],
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
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

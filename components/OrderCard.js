import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Typography from '@/constants/Typography';

const OrderCard = ({ order, onPress }) => {
  // Function to format date
  const formatDate = (date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get status color based on order status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return Colors.warning[500];
      case 'Shipped':
        return Colors.primary[500];
      case 'Delivered':
        return Colors.success[500];
      case 'Cancelled':
        return Colors.error[500];
      default:
        return Colors.neutral[500];
    }
  };
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.date}>{formatDate(order.date)}</Text>
        </View>
        
        <View style={[styles.statusContainer, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
          <Text style={[styles.status, { color: getStatusColor(order.status) }]}>
            {order.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.itemsContainer}>
        <Text style={styles.itemsText}>
          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
        </Text>
        <Text style={styles.total}>${order.total.toFixed(2)}</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.viewDetails}>View Details</Text>
        <ChevronRight size={16} color={Colors.primary[600]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: Spacing.radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  orderId: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
  },
  date: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
  },
  statusContainer: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Spacing.radius.sm,
  },
  status: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.xs,
  },
  itemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  itemsText: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.text.tertiary,
  },
  total: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetails: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.sm,
    color: Colors.primary[600],
    marginRight: Spacing.xs,
  },
});

export default OrderCard;
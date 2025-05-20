import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Typography from '@/constants/Typography';
import { useCart } from '@/context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };
  
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(item.id);
  };
  
  const totalPrice = item.price * item.quantity;
  
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      
      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        
        <View style={styles.actionsContainer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={handleDecrement}
            >
              <Minus size={16} color={Colors.neutral[700]} />
            </TouchableOpacity>
            
            <Text style={styles.quantity}>{item.quantity}</Text>
            
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={handleIncrement}
            >
              <Plus size={16} color={Colors.neutral[700]} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={handleRemove}
          >
            <Trash2 size={16} color={Colors.error[600]} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Spacing.radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: Spacing.radius.sm,
    marginRight: Spacing.md,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  price: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.regular,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: Spacing.radius.sm,
    overflow: 'hidden',
  },
  quantityButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.neutral[100],
  },
  quantity: {
    paddingHorizontal: Spacing.md,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.medium,
  },
  removeButton: {
    marginLeft: Spacing.md,
    padding: Spacing.xs,
  },
  totalPrice: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.semiBold,
    color: Colors.primary[600],
  },
});

export default CartItem;
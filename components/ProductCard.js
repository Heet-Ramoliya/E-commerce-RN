import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Typography from '@/constants/Typography';
import { useCart } from '@/context/CartContext';

const ProductCard = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  
  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };
  
  const handleAddToCart = () => {
    addToCart(product);
  };
  
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} />
        {product.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Star size={14} color={Colors.warning[500]} fill={Colors.warning[500]} />
          <Text style={styles.rating}>{product.rating}</Text>
          <Text style={styles.reviewCount}>({product.reviewCount})</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: Spacing.radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Platform.select({
      web: {
        width: '100%',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ':hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        },
      },
      default: {
        elevation: 3,
        shadowColor: Colors.neutral[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
  },
  imageContainer: {
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  newBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.accent[500],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.radius.sm,
  },
  newBadgeText: {
    color: Colors.text.inverse,
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.medium,
  },
  contentContainer: {
    padding: Spacing.md,
  },
  category: {
    color: Colors.text.tertiary,
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.regular,
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    height: 44,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  rating: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.medium,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  reviewCount: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.regular,
    color: Colors.text.tertiary,
    marginLeft: Spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fonts.semiBold,
    color: Colors.primary[600],
  },
  addButton: {
    backgroundColor: Colors.primary[50],
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Spacing.radius.sm,
  },
  addButtonText: {
    color: Colors.primary[600],
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.medium,
  },
});

export default ProductCard;
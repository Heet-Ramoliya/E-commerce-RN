import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Star,
  Plus,
  Minus,
  Heart,
  Share,
  Check,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Typography from '@/constants/Typography';
import Button from '@/components/Button';
import { getProductById } from '@/data/products';
import { useCart } from '@/context/CartContext';

const { width } = Dimensions.get('window');

export default function ProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 500));

      const productData = getProductById(id);
      setProduct(productData);

      if (productData && productData.colors && productData.colors.length > 0) {
        setSelectedColor(productData.colors[0]);
      }

      setLoading(false);
    };

    loadProduct();
  }, [id]);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);

    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 800));

    addToCart(product, quantity);
    setAdding(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary[600]} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          variant="outline"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header/Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Heart size={20} color={Colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Share size={20} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Info Section */}
        <View style={styles.infoContainer}>
          {/* Title and Price */}
          <View style={styles.titleSection}>
            <Text style={styles.category}>{product.category}</Text>
            <Text style={styles.title}>{product.name}</Text>

            <View style={styles.ratingContainer}>
              <Star
                size={16}
                color={Colors.warning[500]}
                fill={Colors.warning[500]}
              />
              <Text style={styles.rating}>{product.rating}</Text>
              <Text style={styles.reviewCount}>
                ({product.reviewCount} reviews)
              </Text>
            </View>

            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <View style={styles.selectorSection}>
              <Text style={styles.selectorTitle}>Color</Text>
              <View style={styles.colorOptions}>
                {product.colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      selectedColor === color && styles.selectedColorOption,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <Text style={styles.colorText}>{color}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quantity Selection */}
          <View style={styles.selectorSection}>
            <Text style={styles.selectorTitle}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleDecrement}
                disabled={quantity <= 1}
              >
                <Minus size={16} color={Colors.text.primary} />
              </TouchableOpacity>

              <Text style={styles.quantity}>{quantity}</Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncrement}
              >
                <Plus size={16} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Product Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>Features</Text>
            <View style={styles.featuresList}>
              {product.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Check size={16} color={Colors.success[500]} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomContainer}>
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          loading={adding}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.lg,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  imageContainer: {
    height: width * 0.9,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  imageActions: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  infoContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.background,
    borderTopLeftRadius: Spacing.radius.xl,
    borderTopRightRadius: Spacing.radius.xl,
    marginTop: -Spacing.xl,
  },
  titleSection: {
    marginBottom: Spacing.lg,
  },
  category: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
  },
  title: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: Typography.sizes.xxl,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  rating: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  reviewCount: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.text.tertiary,
    marginLeft: Spacing.xs,
  },
  price: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: Typography.sizes.xl,
    color: Colors.primary[600],
  },
  selectorSection: {
    marginBottom: Spacing.lg,
  },
  selectorTitle: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  colorOptions: {
    flexDirection: 'row',
  },
  colorOption: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: Spacing.radius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginRight: Spacing.sm,
  },
  selectedColorOption: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  colorText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: Spacing.radius.md,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    paddingHorizontal: Spacing.md,
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    minWidth: 40,
    textAlign: 'center',
  },
  featuresSection: {
    marginBottom: Spacing.lg,
  },
  featuresTitle: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  featuresList: {
    marginTop: Spacing.xs,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  featureText: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  descriptionSection: {
    marginBottom: Spacing.xl,
  },
  descriptionTitle: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  description: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeights.normal * Typography.sizes.md,
  },
  bottomContainer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    backgroundColor: Colors.background,
  },
});

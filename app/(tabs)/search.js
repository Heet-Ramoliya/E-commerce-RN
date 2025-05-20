import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useSearchParams, useRouter, useLocalSearchParams } from 'expo-router';
import { Search as SearchIcon, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Typography from '@/constants/Typography';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import {
  searchProducts,
  getCategories,
  getProductsByCategory,
  getFeaturedProducts,
  getNewProducts,
} from '@/data/products';

export default function SearchScreen() {
  const router = useRouter();
  const { category, featured, new: isNew } = useLocalSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 300));

      const allCategories = getCategories();
      setCategories(allCategories);

      // Handle initial search results based on params
      if (featured) {
        setSearchResults(getFeaturedProducts());
      } else if (isNew) {
        setSearchResults(getNewProducts());
      } else if (category) {
        setSelectedCategory(category);
        setSearchResults(getProductsByCategory(category));
      } else {
        setSearchResults([]);
      }

      setLoading(false);
    };

    loadData();
  }, [category, featured, isNew]);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      if (selectedCategory) {
        setSearchResults(getProductsByCategory(selectedCategory));
      } else {
        setSearchResults([]);
      }
      return;
    }

    const results = searchProducts(query);
    setSearchResults(results);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchResults(getProductsByCategory(category));
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (selectedCategory) {
      setSearchResults(getProductsByCategory(selectedCategory));
    } else {
      setSearchResults([]);
    }
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator size="large" color={Colors.primary[600]} />
        </View>
      );
    }

    if (searchQuery.trim() !== '' && searchResults.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>No results found</Text>
          <Text style={styles.emptyStateText}>
            We couldn't find any products matching "{searchQuery}"
          </Text>
        </View>
      );
    }

    if (!selectedCategory && searchQuery.trim() === '') {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>Find products</Text>
          <Text style={styles.emptyStateText}>
            Search for products or select a category to start browsing
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderItem = ({ item }) => (
    <View style={styles.productCardContainer}>
      <ProductCard product={item} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Products</Text>
      </View>

      <View style={styles.searchContainer}>
        <SearchIcon size={18} color={Colors.neutral[500]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={Colors.neutral[400]}
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <X size={18} color={Colors.neutral[500]} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContainer}
        >
          {categories.map((category) => (
            <CategoryCard
              key={category}
              category={category}
              isSelected={selectedCategory === category}
              onPress={() => handleCategorySelect(category)}
            />
          ))}
        </ScrollView>
      </View>

      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.resultsContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
  },
  title: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: Typography.sizes.xxl,
    color: Colors.text.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    borderRadius: Spacing.radius.md,
    marginHorizontal: Spacing.lg,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    paddingVertical: Spacing.md,
    marginLeft: Spacing.sm,
  },
  categoriesContainer: {
    marginBottom: Spacing.md,
  },
  categoriesScrollContainer: {
    paddingHorizontal: Spacing.lg,
  },
  resultsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productCardContainer: {
    width: '48%',
    marginBottom: Spacing.md,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyStateTitle: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: Typography.sizes.xl,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyStateText: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.md,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.normal * Typography.sizes.md,
  },
});

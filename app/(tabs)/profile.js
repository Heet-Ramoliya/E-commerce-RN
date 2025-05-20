import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User as UserIcon,
  Package,
  Settings,
  CreditCard,
  Mail,
  Phone,
  Bell,
  LogOut,
  Lock,
  ChevronRight,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Typography from '@/constants/Typography';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { useAuth } from '@/context/AuthContext';
import { getUserOrders } from '@/data/orders';
import OrderCard from '@/components/OrderCard';

export default function ProfileScreen() {
  const router = useRouter();
  const {
    user,
    login,
    register,
    logout,
    loading: authLoading,
    error: authError,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const handleAuth = async () => {
    setFormSubmitting(true);

    if (isLogin) {
      await login(email, password);
    } else {
      await register(name, email, password);
    }

    setFormSubmitting(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Get order history for logged in user
  const userOrders = user ? getUserOrders(user.id) : [];

  if (authLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary[600]} />
      </View>
    );
  }

  // Auth Form (when not logged in)
  if (!user) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </Text>
          <Text style={styles.subtitle}>
            {isLogin
              ? 'Sign in to access your orders and account details'
              : 'Create an account to start shopping with us'}
          </Text>
        </View>

        {!isLogin && (
          <InputField
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            required
          />
        )}

        <InputField
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          required
        />

        <InputField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          required
        />

        {authError && <Text style={styles.errorText}>{authError}</Text>}

        <Button
          title={isLogin ? 'Sign In' : 'Create Account'}
          onPress={handleAuth}
          loading={formSubmitting}
          fullWidth
          style={styles.authButton}
        />

        <TouchableOpacity
          style={styles.switchAuthMode}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.switchAuthText}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Sign In'}
          </Text>
        </TouchableOpacity>

        {/* Demo Account Info */}
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>Demo Account</Text>
          <Text style={styles.demoText}>Email: user@example.com</Text>
          <Text style={styles.demoText}>Password: password123</Text>
        </View>
      </ScrollView>
    );
  }

  // Profile Screen (when logged in)
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <UserIcon size={40} color={Colors.neutral[400]} />
            </View>
          )}
        </View>
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
      </View>

      {/* Recent Orders */}
      {userOrders.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>

          {userOrders.slice(0, 2).map((order) => (
            <OrderCard key={order.id} order={order} onPress={() => {}} />
          ))}
        </View>
      )}

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <UserIcon size={20} color={Colors.primary[600]} />
          </View>
          <Text style={styles.menuItemText}>Personal Information</Text>
          <ChevronRight size={18} color={Colors.neutral[400]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Package size={20} color={Colors.primary[600]} />
          </View>
          <Text style={styles.menuItemText}>Orders & Returns</Text>
          <ChevronRight size={18} color={Colors.neutral[400]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <CreditCard size={20} color={Colors.primary[600]} />
          </View>
          <Text style={styles.menuItemText}>Payment Methods</Text>
          <ChevronRight size={18} color={Colors.neutral[400]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Lock size={20} color={Colors.primary[600]} />
          </View>
          <Text style={styles.menuItemText}>Security & Privacy</Text>
          <ChevronRight size={18} color={Colors.neutral[400]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Bell size={20} color={Colors.primary[600]} />
          </View>
          <Text style={styles.menuItemText}>Notifications</Text>
          <ChevronRight size={18} color={Colors.neutral[400]} />
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={18} color={Colors.error[600]} style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.sizes.xxl,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.md,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  authButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary[600],
    borderRadius: Spacing.radius.lg,
    paddingVertical: Spacing.md,
    elevation: 3,
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  switchAuthMode: {
    marginTop: Spacing.lg,
    alignSelf: 'center',
  },
  switchAuthText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.primary[600],
    textDecorationLine: 'underline',
  },
  errorText: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.error[600],
    backgroundColor: Colors.error[50],
    padding: Spacing.sm,
    borderRadius: Spacing.radius.sm,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  demoContainer: {
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: Colors.neutral[50],
    borderRadius: Spacing.radius.lg,
    elevation: 2,
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  demoTitle: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  demoText: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  profileHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: Typography.sizes.xl,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  profileEmail: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.md,
    color: Colors.text.tertiary,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  sectionAction: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.sm,
    color: Colors.primary[600],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuItemText: {
    flex: 1,
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.error[100],
    borderRadius: Spacing.radius.md,
    backgroundColor: Colors.error[50],
  },
  logoutIcon: {
    marginRight: Spacing.sm,
  },
  logoutText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.error[600],
  },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../types';
import Header from '../../components/common/Header';
import Avatar from '../../components/common/Avatar';
import Card from '../../components/common/Card';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItem {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  screen?: keyof RootStackParamList;
  action?: () => void;
  showArrow?: boolean;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Account',
      items: [
        {
          id: 'edit-profile',
          icon: 'person-outline',
          title: 'Edit Profile',
          subtitle: 'Update your details',
          screen: 'EditProfile',
          showArrow: true,
        },
        {
          id: 'addresses',
          icon: 'location-outline',
          title: 'Saved Addresses',
          subtitle: 'Manage your addresses',
          screen: 'SavedAddresses',
          showArrow: true,
        },
        {
          id: 'payments',
          icon: 'card-outline',
          title: 'Payment Methods',
          subtitle: 'Manage payment options',
          screen: 'PaymentMethods',
          showArrow: true,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          icon: 'notifications-outline',
          title: 'Notifications',
          subtitle: 'Manage notification settings',
          screen: 'Settings',
          showArrow: true,
        },
        {
          id: 'language',
          icon: 'language-outline',
          title: 'Language',
          subtitle: 'English',
          showArrow: true,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          icon: 'help-circle-outline',
          title: 'Help & Support',
          screen: 'Help',
          showArrow: true,
        },
        {
          id: 'about',
          icon: 'information-circle-outline',
          title: 'About',
          showArrow: true,
        },
        {
          id: 'terms',
          icon: 'document-text-outline',
          title: 'Terms & Conditions',
          showArrow: true,
        },
        {
          id: 'privacy',
          icon: 'shield-outline',
          title: 'Privacy Policy',
          showArrow: true,
        },
      ],
    },
  ];

  const handleMenuPress = (item: MenuItem) => {
    if (item.action) {
      item.action();
    } else if (item.screen) {
      navigation.navigate(item.screen as any);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Profile" showBack={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar
              source={user?.avatar ? { uri: user.avatar } : undefined}
              name={user?.name || 'User'}
              size={70}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
              <Text style={styles.profilePhone}>{user?.phone || '+91 XXXXXXXXXX'}</Text>
              {user?.email && (
                <Text style={styles.profileEmail}>{user.email}</Text>
              )}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Avg. Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₹2,450</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
          </View>
        </Card>

        {/* Menu Sections */}
        {menuSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card style={styles.menuCard}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    index !== section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={() => handleMenuPress(item)}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIcon}>
                      <Ionicons
                        name={item.icon as any}
                        size={22}
                        color={COLORS.primary}
                      />
                    </View>
                    <View>
                      <Text style={styles.menuTitle}>{item.title}</Text>
                      {item.subtitle && (
                        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                      )}
                    </View>
                  </View>
                  {item.showArrow && (
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={COLORS.gray400}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SIZES.padding,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.lg,
    color: COLORS.textPrimary,
  },
  profilePhone: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  profileEmail: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray100,
    borderRadius: SIZES.radius,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.lg,
    color: COLORS.primary,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.gray300,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
  },
  menuSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: `${COLORS.error}10`,
    borderRadius: SIZES.radius,
    marginBottom: 16,
  },
  logoutText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.error,
    marginLeft: 8,
  },
  version: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: COLORS.gray400,
    textAlign: 'center',
  },
});

export default ProfileScreen;

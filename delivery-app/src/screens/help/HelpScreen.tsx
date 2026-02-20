import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../utils/constants';
import { RootStackParamList } from '../../types';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';

type HelpNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HelpScreen: React.FC = () => {
  const navigation = useNavigation<HelpNavigationProp>();
  const insets = useSafeAreaInsets();

  const helpOptions = [
    {
      id: 'faq',
      icon: 'help-circle-outline',
      title: 'FAQs',
      description: 'Find answers to common questions',
      onPress: () => navigation.navigate('FAQ'),
    },
    {
      id: 'tickets',
      icon: 'chatbubbles-outline',
      title: 'My Support Tickets',
      description: 'View and manage your support requests',
      onPress: () => navigation.navigate('SupportTickets'),
    },
    {
      id: 'new-ticket',
      icon: 'create-outline',
      title: 'Create New Ticket',
      description: 'Report an issue or ask a question',
      onPress: () => navigation.navigate('CreateTicket'),
    },
  ];

  const contactOptions = [
    {
      id: 'call',
      icon: 'call-outline',
      title: 'Call Us',
      description: '24/7 Customer Support',
      value: '+91 1800-XXX-XXXX',
      onPress: () => Linking.openURL('tel:+911800XXXXXXX'),
    },
    {
      id: 'email',
      icon: 'mail-outline',
      title: 'Email Us',
      description: 'We reply within 24 hours',
      value: 'support@carryon.com',
      onPress: () => Linking.openURL('mailto:support@carryon.com'),
    },
    {
      id: 'chat',
      icon: 'chatbox-ellipses-outline',
      title: 'Live Chat',
      description: 'Chat with our support team',
      onPress: () => {},
    },
  ];

  return (
    <View style={styles.container}>
      <Header title="Help & Support" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Help Options */}
        <Text style={styles.sectionTitle}>How can we help?</Text>
        <Card style={styles.optionsCard}>
          {helpOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                index !== helpOptions.length - 1 && styles.optionBorder,
              ]}
              onPress={option.onPress}
            >
              <View style={styles.optionIcon}>
                <Ionicons name={option.icon as any} size={24} color={COLORS.primary} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
            </TouchableOpacity>
          ))}
        </Card>

        {/* Contact Options */}
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Card style={styles.optionsCard}>
          {contactOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                index !== contactOptions.length - 1 && styles.optionBorder,
              ]}
              onPress={option.onPress}
            >
              <View style={styles.optionIcon}>
                <Ionicons name={option.icon as any} size={24} color={COLORS.primary} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
                {option.value && (
                  <Text style={styles.optionValue}>{option.value}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
            </TouchableOpacity>
          ))}
        </Card>

        {/* Emergency */}
        <Card style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <Ionicons name="warning-outline" size={24} color={COLORS.error} />
            <Text style={styles.emergencyTitle}>Emergency?</Text>
          </View>
          <Text style={styles.emergencyText}>
            If you have an urgent safety concern, please contact local emergency services immediately.
          </Text>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => Linking.openURL('tel:112')}
          >
            <Ionicons name="call" size={20} color={COLORS.white} />
            <Text style={styles.emergencyButtonText}>Call Emergency: 112</Text>
          </TouchableOpacity>
        </Card>
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
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  optionsCard: {
    padding: 0,
    marginBottom: 8,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
  },
  optionDescription: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  optionValue: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.primary,
    marginTop: 2,
  },
  emergencyCard: {
    backgroundColor: `${COLORS.error}10`,
    marginTop: 16,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.lg,
    color: COLORS.error,
    marginLeft: 8,
  },
  emergencyText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
  },
  emergencyButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.white,
    marginLeft: 8,
  },
});

export default HelpScreen;

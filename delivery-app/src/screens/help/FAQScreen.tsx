import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../utils/constants';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'Booking',
    question: 'How do I book a delivery?',
    answer: 'To book a delivery, open the app, enter your pickup and drop locations, select a vehicle type, review the estimated fare, and confirm your booking. A nearby driver will be assigned to your order.',
  },
  {
    id: '2',
    category: 'Booking',
    question: 'Can I book a delivery for someone else?',
    answer: 'Yes, you can book a delivery for someone else. Simply enter their pickup and drop locations, and you can add their contact number for the driver to coordinate with.',
  },
  {
    id: '3',
    category: 'Payment',
    question: 'What payment methods are accepted?',
    answer: 'We accept multiple payment methods including Credit/Debit Cards, UPI, Net Banking, Digital Wallets, and Cash on Delivery. You can manage your payment methods in the Profile section.',
  },
  {
    id: '4',
    category: 'Payment',
    question: 'How do I apply a promo code?',
    answer: 'Before confirming your booking, tap on "Apply Promo Code" on the fare estimation screen. Enter your valid promo code and the discount will be applied to your fare.',
  },
  {
    id: '5',
    category: 'Delivery',
    question: 'How can I track my delivery?',
    answer: 'Once your order is confirmed and a driver is assigned, you can track the delivery in real-time on the map. You will also receive notifications at each stage of the delivery.',
  },
  {
    id: '6',
    category: 'Delivery',
    question: 'What items can I send?',
    answer: 'You can send most legal items including documents, parcels, food packages, gifts, and small to medium-sized goods. We do not allow illegal items, flammable materials, or hazardous substances.',
  },
  {
    id: '7',
    category: 'Cancellation',
    question: 'How do I cancel my order?',
    answer: 'You can cancel your order before the driver picks up your package. Go to the active order, tap "Cancel Order", and select a reason. Cancellation charges may apply based on the stage of delivery.',
  },
  {
    id: '8',
    category: 'Cancellation',
    question: 'What is the cancellation policy?',
    answer: 'Cancellations made within 2 minutes of booking are free. After that, a small cancellation fee may apply. Once the driver has picked up the package, the order cannot be cancelled.',
  },
  {
    id: '9',
    category: 'Safety',
    question: 'How do you ensure safety of my package?',
    answer: 'All our delivery partners are verified and trained. Your package is tracked throughout the journey, and we offer insurance coverage for valuable items. You can also share your live tracking with trusted contacts.',
  },
  {
    id: '10',
    category: 'Safety',
    question: 'What if my package is damaged or lost?',
    answer: 'In the rare event of damage or loss, please report it immediately through the app. We have a dedicated resolution team that will investigate and provide appropriate compensation as per our policy.',
  },
];

const FAQScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqData.map((faq) => faq.category)))];

  const filteredFAQs = selectedCategory === 'All'
    ? faqData
    : faqData.filter((faq) => faq.category === selectedCategory);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <Header title="FAQs" />

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryTab,
              selectedCategory === category && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAQ List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {filteredFAQs.map((faq) => (
          <Card key={faq.id} style={styles.faqCard}>
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() => toggleExpand(faq.id)}
            >
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Ionicons
                name={expandedId === faq.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORS.gray400}
              />
            </TouchableOpacity>
            {expandedId === faq.id && (
              <View style={styles.faqAnswerContainer}>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </View>
            )}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  categoriesContainer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.white,
  },
  categoryTabActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  scrollContent: {
    padding: SIZES.padding,
  },
  faqCard: {
    marginBottom: 12,
    padding: 0,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
    marginRight: 12,
  },
  faqAnswerContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    padding: 16,
  },
  faqAnswer: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});

export default FAQScreen;

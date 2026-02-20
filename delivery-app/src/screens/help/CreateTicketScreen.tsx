import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { COLORS, FONTS, SIZES } from '../../utils/constants';
import { apiService } from '../../services/api';
import { RootStackParamList } from '../../types';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

type CreateTicketNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ISSUE_CATEGORIES = [
  { id: 'delivery', label: 'Delivery Issue', icon: 'cube-outline' },
  { id: 'payment', label: 'Payment Issue', icon: 'card-outline' },
  { id: 'driver', label: 'Driver Behavior', icon: 'person-outline' },
  { id: 'app', label: 'App Issue', icon: 'phone-portrait-outline' },
  { id: 'other', label: 'Other', icon: 'help-circle-outline' },
];

const CreateTicketScreen: React.FC = () => {
  const navigation = useNavigation<CreateTicketNavigationProp>();
  const insets = useSafeAreaInsets();

  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!category) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select an issue category',
      });
      return;
    }

    if (!subject.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a subject',
      });
      return;
    }

    if (!description.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please describe your issue',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.createSupportTicket({
        category,
        subject: subject.trim(),
        description: description.trim(),
        orderId: orderId.trim() || undefined,
      });

      Toast.show({
        type: 'success',
        text1: 'Ticket Created',
        text2: 'Our support team will get back to you soon',
      });
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create support ticket',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Create Ticket" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* Category Selection */}
        <Text style={styles.label}>What is your issue about?</Text>
        <View style={styles.categoriesGrid}>
          {ISSUE_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryItem,
                category === cat.id && styles.categoryItemSelected,
              ]}
              onPress={() => setCategory(cat.id)}
            >
              <Ionicons
                name={cat.icon as any}
                size={24}
                color={category === cat.id ? COLORS.primary : COLORS.gray500}
              />
              <Text
                style={[
                  styles.categoryLabel,
                  category === cat.id && styles.categoryLabelSelected,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Subject */}
        <Input
          label="Subject"
          placeholder="Brief summary of your issue"
          value={subject}
          onChangeText={setSubject}
        />

        {/* Order ID (Optional) */}
        <Input
          label="Order ID (Optional)"
          placeholder="Enter related order ID"
          value={orderId}
          onChangeText={setOrderId}
        />

        {/* Description */}
        <Text style={styles.label}>Describe your issue</Text>
        <Card style={styles.descriptionCard}>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Please provide as much detail as possible..."
            placeholderTextColor={COLORS.gray500}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </Card>

        {/* Attachments Hint */}
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="attach" size={20} color={COLORS.primary} />
          <Text style={styles.attachText}>Add attachments (optional)</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Submit Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Button
          title="Submit Ticket"
          onPress={handleSubmit}
          loading={isSubmitting}
        />
      </View>
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
  label: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  categoryItem: {
    width: '47%',
    padding: 16,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  categoryLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: COLORS.primary,
  },
  descriptionCard: {
    padding: 0,
    marginBottom: 16,
  },
  descriptionInput: {
    padding: 16,
    fontFamily: FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
    minHeight: 150,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  attachText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.primary,
    marginLeft: 8,
  },
  footer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
});

export default CreateTicketScreen;

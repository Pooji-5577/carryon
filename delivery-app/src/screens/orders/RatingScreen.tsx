import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types';

type RatingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Rating'>;
type RatingRouteProp = RouteProp<RootStackParamList, 'Rating'>;

const FEEDBACK_TAGS = ['Good communication', 'Excellent Service', 'Clean & Comfy'];
const TIP_AMOUNTS = [10, 20, 50, 80, 100];

const RatingScreen: React.FC = () => {
  const navigation = useNavigation<RatingNavigationProp>();
  const route = useRoute<RatingRouteProp>();
  const insets = useSafeAreaInsets();

  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [comment, setComment] = useState('');
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState('');

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  };

  const handleSubmit = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn}>
          <Ionicons name="menu" size={26} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.brandTitle}>
          <Text style={styles.brandCarry}>Carry</Text>
          <Text style={styles.brandOn}> On</Text>
        </Text>
        <TouchableOpacity style={styles.bellBtn}>
          <Ionicons name="notifications-outline" size={24} color="#212121" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page subtitle */}
        <Text style={styles.pageSubtitle}>Give Rating for Driver</Text>

        {/* How was the driver? */}
        <Text style={styles.sectionTitle}>How was the driver?</Text>

        {/* Driver Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🐧</Text>
          </View>
        </View>

        {/* Driver Name + Badge */}
        <View style={styles.driverNameRow}>
          <Text style={styles.driverName}>Josh Knight</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingBadgeStar}>⭐</Text>
            <Text style={styles.ratingBadgeText}>5.0</Text>
          </View>
        </View>

        {/* Star Rating */}
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity key={star} onPress={() => setRating(star)} style={styles.starBtn}>
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={38}
                color={star <= rating ? '#FFB800' : '#D0D0D0'}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback prompt */}
        <Text style={styles.feedbackPrompt}>Yay!What impressed you?</Text>

        {/* Feedback chips — row 1 */}
        <View style={styles.tagsRow}>
          {FEEDBACK_TAGS.slice(0, 2).map(tag => (
            <TouchableOpacity
              key={tag}
              style={[styles.chip, selectedTags.has(tag) && styles.chipSelected]}
              onPress={() => toggleTag(tag)}
            >
              <Text style={[styles.chipText, selectedTags.has(tag) && styles.chipTextSelected]}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback chips — row 2 (centred) */}
        <View style={styles.tagsRowCenter}>
          <TouchableOpacity
            style={[styles.chip, selectedTags.has(FEEDBACK_TAGS[2]) && styles.chipSelected]}
            onPress={() => toggleTag(FEEDBACK_TAGS[2])}
          >
            <Text style={[styles.chipText, selectedTags.has(FEEDBACK_TAGS[2]) && styles.chipTextSelected]}>
              {FEEDBACK_TAGS[2]}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Comment field */}
        <TextInput
          style={styles.commentInput}
          placeholder="Say something nice to your driver"
          placeholderTextColor="#BDBDBD"
          value={comment}
          onChangeText={setComment}
        />

        {/* Tips section */}
        <Text style={styles.tipsTitle}>Tips to make your driver's happy</Text>

        <View style={styles.tipsRow}>
          {TIP_AMOUNTS.map(amount => (
            <TouchableOpacity
              key={amount}
              style={[styles.tipChip, selectedTip === amount && styles.tipChipSelected]}
              onPress={() => setSelectedTip(prev => (prev === amount ? null : amount))}
            >
              <Text style={[styles.tipChipText, selectedTip === amount && styles.tipChipTextSelected]}>
                ${amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom tip field */}
        <TextInput
          style={styles.commentInput}
          placeholder="Enter your tips here"
          placeholderTextColor="#BDBDBD"
          value={customTip}
          onChangeText={setCustomTip}
          keyboardType="numeric"
        />

        {/* Submit button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="search-outline" size={24} color="#757575" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubbles-outline" size={24} color="#757575" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Ionicons name="home" size={24} color="#1E88E5" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#757575" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  menuBtn: { padding: 4 },
  brandTitle: { fontSize: 24, fontWeight: 'bold' },
  brandCarry: { color: '#1E88E5', fontWeight: 'bold' },
  brandOn: { color: '#1565C0', fontWeight: 'bold' },
  bellBtn: { padding: 4 },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E88E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 40,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFB800',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 2,
  },
  ratingBadgeStar: { fontSize: 12 },
  ratingBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#212121',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  starBtn: { padding: 2 },
  feedbackPrompt: {
    fontSize: 15,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  tagsRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  chipSelected: {
    borderColor: '#1E88E5',
    backgroundColor: '#E3F2FD',
  },
  chipText: {
    fontSize: 13,
    color: '#212121',
  },
  chipTextSelected: {
    color: '#1E88E5',
  },
  commentInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#212121',
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  tipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 14,
  },
  tipChip: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  tipChipSelected: {
    borderColor: '#1E88E5',
    backgroundColor: '#E3F2FD',
  },
  tipChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#212121',
  },
  tipChipTextSelected: {
    color: '#1E88E5',
  },
  submitBtn: {
    width: '100%',
    height: 54,
    backgroundColor: '#1E88E5',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    marginHorizontal: 4,
  },
});

export default RatingScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'SenderReceiver'>;

const PRIMARY = '#1E88E5';
const PRIMARY_DARK = '#1565C0';

export default function SenderReceiverScreen({ navigation }: Props) {
  const [locationType, setLocationType] = useState('Current Location');
  const [whatSending, setWhatSending] = useState('');
  const [sampleType, setSampleType] = useState('');
  const [request, setRequest] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [senderName, setSenderName] = useState('');
  const [overallTrack, setOverallTrack] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [recipientContact, setRecipientContact] = useState('');
  const [address, setAddress] = useState('');

  const handleContinue = () => {
    navigation.navigate('Payment', {
      senderName: senderName || 'Phoebe',
      senderPhone: recipientContact || '028607329',
      receiverName: receiverName || 'Paul',
      receiverPhone: recipientContact || '028607329',
      notes: request,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.titleRow}>
          <Text style={styles.titleBlue}>Carry</Text>
          <Text style={styles.titleDark}> On</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Request for Ride</Text>

        {/* Location Type Toggle */}
        <View style={styles.toggleRow}>
          {['Current Location', 'Office'].map((label) => (
            <TouchableOpacity
              key={label}
              style={[styles.toggleBtn, locationType === label && styles.toggleBtnActive]}
              onPress={() => setLocationType(label)}
            >
              <Text style={[styles.toggleText, locationType === label && styles.toggleTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form Fields */}
        <InputField label="What are you sending?" value={whatSending} placeholder="e.g. Electronics, Clothes" onChangeText={setWhatSending} />
        <InputField label="Sample type" value={sampleType} placeholder="e.g. Fragile, Standard" onChangeText={setSampleType} />
        <InputField label="Request" value={request} placeholder="e.g. Handle with care" onChangeText={setRequest} />
        <InputField label="Payment Type" value={paymentType} placeholder="e.g. Cash, Card" onChangeText={setPaymentType} />
        <InputField label="Sender Name" value={senderName} placeholder="e.g. Phoebe" onChangeText={setSenderName} />
        <InputField label="Overall Track" value={overallTrack} placeholder="Track ID" onChangeText={setOverallTrack} />
        <InputField label="Receiver Name" value={receiverName} placeholder="e.g. Paul" onChangeText={setReceiverName} />
        <InputField label="Recipient contact number" value={recipientContact} placeholder="e.g. 028607329" onChangeText={setRecipientContact} keyboardType="phone-pad" />
        <InputField label="Address" value={address} placeholder="e.g. Vill.Chalishin" onChangeText={setAddress} />

        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InputField({
  label, value, placeholder, onChangeText, keyboardType = 'default',
}: {
  label: string; value: string; placeholder: string; onChangeText: (t: string) => void; keyboardType?: 'default' | 'phone-pad';
}) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#BDBDBD"
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backArrow: { fontSize: 22, color: '#212121' },
  titleRow: { flexDirection: 'row' },
  titleBlue: { fontSize: 22, fontWeight: 'bold', color: PRIMARY },
  titleDark: { fontSize: 22, fontWeight: 'bold', color: PRIMARY_DARK },
  scroll: { padding: 20, paddingBottom: 40 },
  pageTitle: { fontSize: 20, fontWeight: 'bold', color: '#212121', marginBottom: 20 },
  toggleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  toggleBtn: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: PRIMARY },
  toggleText: { fontSize: 14, fontWeight: '500', color: '#757575' },
  toggleTextActive: { color: '#fff' },
  inputWrapper: { marginBottom: 14 },
  inputLabel: { fontSize: 13, fontWeight: '500', color: '#757575', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, padding: 14, fontSize: 14, color: '#212121', backgroundColor: '#F8F8F8' },
  continueBtn: { backgroundColor: PRIMARY, borderRadius: 14, height: 54, justifyContent: 'center', alignItems: 'center', marginTop: 28 },
  continueBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
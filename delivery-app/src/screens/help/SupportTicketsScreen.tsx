import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../utils/constants';
import { apiService } from '../../services/api';
import { RootStackParamList, SupportTicket } from '../../types';
import { formatDateTime } from '../../utils/helpers';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';

type SupportTicketsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const STATUS_CONFIG = {
  open: { label: 'Open', color: COLORS.warning },
  'in-progress': { label: 'In Progress', color: COLORS.info },
  resolved: { label: 'Resolved', color: COLORS.success },
  closed: { label: 'Closed', color: COLORS.gray500 },
};

const SupportTicketsScreen: React.FC = () => {
  const navigation = useNavigation<SupportTicketsNavigationProp>();
  const insets = useSafeAreaInsets();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await apiService.getSupportTickets();
      if (response.success) {
        setTickets(response.tickets);
      }
    } catch (error) {
      // Mock data
      setTickets([
        {
          id: '1',
          userId: 'user1',
          orderId: 'order1',
          subject: 'Package not delivered',
          description: 'My package was marked as delivered but I did not receive it.',
          status: 'in-progress',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          userId: 'user1',
          subject: 'Refund request',
          description: 'I was overcharged for my last delivery.',
          status: 'resolved',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadTickets();
    setIsRefreshing(false);
  };

  const renderTicketItem = ({ item }: { item: SupportTicket }) => {
    const statusConfig = STATUS_CONFIG[item.status];

    return (
      <Card
        style={styles.ticketCard}
        onPress={() => navigation.navigate('TicketDetails', { ticketId: item.id })}
      >
        <View style={styles.ticketHeader}>
          <View style={styles.ticketInfo}>
            <Text style={styles.ticketId}>#{item.id.slice(0, 8)}</Text>
            <Text style={styles.ticketDate}>{formatDateTime(item.createdAt)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${statusConfig.color}20` }]}>
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        <Text style={styles.ticketSubject}>{item.subject}</Text>
        <Text style={styles.ticketDescription} numberOfLines={2}>
          {item.description}
        </Text>

        {item.orderId && (
          <View style={styles.orderInfo}>
            <Ionicons name="receipt-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.orderText}>Order #{item.orderId.slice(0, 8)}</Text>
          </View>
        )}
      </Card>
    );
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading tickets..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Support Tickets"
        rightIcon="add"
        onRightPress={() => navigation.navigate('CreateTicket')}
      />

      {tickets.length > 0 ? (
        <FlatList
          data={tickets}
          renderItem={renderTicketItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
            />
          }
        />
      ) : (
        <EmptyState
          icon="chatbubbles-outline"
          title="No Support Tickets"
          message="You haven't created any support tickets yet"
          actionLabel="Create Ticket"
          onAction={() => navigation.navigate('CreateTicket')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SIZES.padding,
  },
  ticketCard: {
    marginBottom: 12,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ticketInfo: {},
  ticketId: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  ticketDate: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: COLORS.gray400,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.xs,
  },
  ticketSubject: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  ticketDescription: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  orderText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
});

export default SupportTicketsScreen;

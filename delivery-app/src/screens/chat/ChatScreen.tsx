import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { GiftedChat, IMessage, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { apiService } from '../../services/api';
import { RootStackParamList } from '../../types';
import Header from '../../components/common/Header';

type ChatNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>;
type ChatRouteProp = RouteProp<RootStackParamList, 'Chat'>;

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<ChatNavigationProp>();
  const route = useRoute<ChatRouteProp>();
  const { user } = useAuth();
  const { joinChatRoom, leaveChatRoom, sendMessage, onNewMessage, offNewMessage } = useSocket();

  const { orderId, driverId } = route.params;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    joinChatRoom(orderId);
    loadMessages();

    const handleNewMessage = (data: { message: any }) => {
      const newMessage: IMessage = {
        _id: data.message.id,
        text: data.message.message,
        createdAt: new Date(data.message.timestamp),
        user: {
          _id: data.message.senderId,
          name: data.message.senderType === 'driver' ? 'Driver' : 'You',
        },
      };
      setMessages((prev) => GiftedChat.append(prev, [newMessage]));
    };

    onNewMessage(handleNewMessage);

    return () => {
      leaveChatRoom(orderId);
      offNewMessage(handleNewMessage);
    };
  }, [orderId]);

  const loadMessages = async () => {
    try {
      const response = await apiService.getChatMessages(orderId);
      if (response.success) {
        const chatMessages: IMessage[] = response.messages.map((msg: any) => ({
          _id: msg.id,
          text: msg.message,
          createdAt: new Date(msg.timestamp),
          user: {
            _id: msg.senderId,
            name: msg.senderType === 'driver' ? 'Driver' : 'You',
          },
        }));
        setMessages(chatMessages.reverse());
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      // Add welcome message for demo
      setMessages([
        {
          _id: 1,
          text: 'Hello! I am on my way to pick up your package.',
          createdAt: new Date(),
          user: {
            _id: driverId,
            name: 'Driver',
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((prev) => GiftedChat.append(prev, newMessages));
    
    newMessages.forEach((msg) => {
      sendMessage(orderId, msg.text);
    });
  }, [orderId]);

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: COLORS.primary,
          },
          left: {
            backgroundColor: COLORS.gray100,
          },
        }}
        textStyle={{
          right: {
            color: COLORS.white,
            fontFamily: FONTS.regular,
          },
          left: {
            color: COLORS.textPrimary,
            fontFamily: FONTS.regular,
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={styles.inputPrimary}
      />
    );
  };

  const renderSend = (props: any) => {
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        <View style={styles.sendButton}>
          <Ionicons name="send" size={22} color={COLORS.white} />
        </View>
      </Send>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Chat with Driver" />
      
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: user?.id || 'user',
            name: user?.name || 'You',
          }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          alwaysShowSend
          placeholder="Type a message..."
          isLoadingEarlier={isLoading}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  chatContainer: {
    flex: 1,
  },
  inputToolbar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  inputPrimary: {
    alignItems: 'center',
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 5,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatScreen;

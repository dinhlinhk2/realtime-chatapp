import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/v1/message/users');
            set({ users: res.data });
        } catch (error) {
            toast.error('Get Users Error', error);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMessages: async (id) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/v1/message/${id}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error('Get Messages Error', error);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/v1/message/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error('Send Error', error);
        }
    },
    subscribeMessage: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        socket.on('newMessage', (newMess) => {
            const isMessageSendSelectUser = newMess.senderId === selectedUser._id;
            if (!isMessageSendSelectUser) return;
            console.log(newMess);

            set({
                messages: [...get().messages, newMess],
            });
        });
    },
    unSubscribeMessage: () => {
        const socket = useAuthStore.getState().socket;
        socket.off('newMessage');
    },
    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
    },
}));

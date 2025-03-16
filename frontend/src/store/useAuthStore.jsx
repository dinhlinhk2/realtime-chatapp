import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '/';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggin: false,
    isupdateProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    authCheck: async () => {
        try {
            const res = await axiosInstance.get('/v1/auth/checkuser');
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log('Error check auth', error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (user) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/v1/auth/register', user);
            set({ authUser: res.data });
            toast.success('Register success');
            get().connectSocket();
        } catch (error) {
            toast.error('Sign Up error', error);
            set({ authUser: null });
        } finally {
            set({ isSigningUp: false });
        }
    },
    login: async (user) => {
        set({ isLoggin: true });
        try {
            const res = await axiosInstance.post('/v1/auth/login', user);
            set({ authUser: res.data });
            toast.success('Sign in success!');
            get().connectSocket();
        } catch (error) {
            toast.error('Sign in Error', error);
            set({ authUser: null });
        } finally {
            set({ isLoggin: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post('/v1/auth/logout');
            set({ authUser: null });
            toast.success('Logout Success!');
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    updateProfile: async (img) => {
        set({ isupdateProfile: true });
        try {
            const res = await axiosInstance.put('/v1/auth/upload-profile', img);
            set({ authUser: res.data });
            toast.success('Upload Success!');
        } catch (error) {
            toast.error('Upload error', error);
        } finally {
            set({ isupdateProfile: false });
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();
        set({ socket: socket });

        socket.on('getUsersOnline', (userId) => {
            set({ onlineUsers: userId });
        });
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));

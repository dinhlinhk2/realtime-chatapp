import { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import avt from '../../public/avt.jpg';
import { formatTime } from '../lib/utils';

const ChatContainer = () => {
    const { messages, isMessagesLoading, getMessages, selectedUser, unSubscribeMessage, subscribeMessage } =
        useChatStore();
    const { authUser } = useAuthStore();

    const messageEndRef = useRef(null);

    useEffect(() => {
        getMessages(selectedUser?._id);
        subscribeMessage();
        return () => unSubscribeMessage();
    }, [selectedUser._id, getMessages, subscribeMessage, unSubscribeMessage]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (isMessagesLoading)
        return (
            <div className="flex flex-col flex-1 overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    return (
        <div className="flex flex-col flex-1 overflow-auto">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        ref={messageEndRef}
                        className={`chat ${message.senderId !== authUser._id ? 'chat-start' : 'chat-end'} `}
                    >
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full">
                                <img
                                    src={
                                        message.senderId === authUser._id
                                            ? authUser.profilePic || avt
                                            : selectedUser.profilePic || avt
                                    }
                                    alt="avt"
                                />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">{formatTime(message.createdAt)}</time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {message.image && (
                                <img
                                    src={message.image}
                                    alt="attachment"
                                    className="sm:max-w-[200px] rounded-lg mb-2 "
                                />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>
            <MessageInput />
        </div>
    );
};

export default ChatContainer;

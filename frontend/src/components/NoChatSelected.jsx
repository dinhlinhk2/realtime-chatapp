import { MessageSquare } from 'lucide-react';

const NoChatSelected = () => {
    return (
        <div className="flex w-full flex-1 flex-col justify-center items-center p-16 bg-base-100/50">
            <div className="max-w-md text-center space-y-6">
                {/* Icon */}
                <div className="flex justify-center gap-4 mb-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
                            <MessageSquare className="size-8 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Text */}
                <h2 className="text-2xl font-bold">Welcome to Chat</h2>
                <p className="text-base-content/60">Select a conversasion from the sidebar to start chat</p>
            </div>
        </div>
    );
};

export default NoChatSelected;

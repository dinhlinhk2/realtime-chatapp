import { useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MessageInput = () => {
    const [text, setText] = useState('');
    const [imgReview, setImgReview] = useState(null);
    const fileRef = useRef(null);
    const { sendMessage } = useChatStore();

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith('image/')) {
            toast.error('Please select image!');
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImgReview(reader.result);
        };
    };
    const handleRemoveImg = () => {
        setImgReview(null);
        if (fileRef.current) fileRef.current.value = '';
    };
    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imgReview) return;
        try {
            await sendMessage({
                text: text,
                image: imgReview,
            });
            setText('');
            setImgReview(null);
            if (fileRef.current) fileRef.current.value = '';
        } catch (error) {
            console.log('Send error', error);
        }
    };
    return (
        <div className="w-full p-4">
            {imgReview && (
                <div className=" mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={imgReview}
                            alt="imgReview"
                            className="size-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            className="absolute size-5 -right-1.5 -top-1.5 rounded-full bg-base-300 flex justify-center items-center"
                            onClick={handleRemoveImg}
                            type="button"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}
            <form onSubmit={handleSend} className="flex items-center gap-2">
                <div className="flex flex-1 gap-2">
                    <input
                        type="text"
                        className="input w-full input-bordered rounded-lg input-sm sm:input-md"
                        placeholder="Chat..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={handleImgChange} />
                    <button
                        type="button"
                        className={`hidden sm:flex btn btn-circle ${imgReview ? 'text-emerald-500' : 'text-zinc-400'}`}
                        onClick={() => fileRef.current?.click()}
                    >
                        <Image size={20} />
                    </button>
                </div>
                <button type="submit" className="btn btn-sm btn-circle" disabled={!text.trim() && !imgReview}>
                    <Send size={22} />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;

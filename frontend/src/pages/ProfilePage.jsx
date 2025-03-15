import { Camera, Mail, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import avg from '../assets/avt.jpg';
import { useState } from 'react';

const ProfilePage = () => {
    const { authUser, isupdateProfile, updateProfile } = useAuthStore();
    const [selectedImg, setSelectedImg] = useState(null);
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result;
            setSelectedImg(base64Image);
            await updateProfile({ profilePic: base64Image });
        };
    };
    return (
        <div className="h-screen pt-20">
            <div className="max-w-2xl mx-auto p-4 py-8 ">
                <div className="rounded-xl bg-base-300 space-y-8 p-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold">Profile</h1>
                        <p className="mt-2">Your profile</p>
                    </div>
                    {/* Upload Avt */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <img
                                src={selectedImg || authUser.profilePic || avg}
                                alt="Profile"
                                className="size-32 rounded-full object-cover border-4 "
                            />
                            <label
                                htmlFor="avatar-upload"
                                className={`
                                        absolute bottom-0 right-0 
                                        bg-base-content hover:scale-105
                                        p-2 rounded-full cursor-pointer 
                                        transition-all duration-200
                                        ${isupdateProfile ? 'animate-pulse pointer-events-none' : ''}
                                    `}
                            >
                                <Camera className="w-5 h-5 text-base-200" />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isupdateProfile}
                                />
                            </label>
                        </div>
                        <p className="text-sm text-zinc-400">
                            {isupdateProfile ? 'Uploading...' : 'Click the camera icon to update your photo'}
                        </p>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <User className="size-4" />
                                Full Name
                            </div>
                            <p className="px-4 py-2.5 rounded-lg border bg-base-200">{authUser.fullName}</p>
                        </div>

                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <Mail className="size-4" />
                                Email
                            </div>
                            <p className="px-4 py-2.5 rounded-lg border bg-base-200">{authUser.email}</p>
                        </div>
                    </div>
                    <div className=" rounded-xl p-6">
                        <h2 className="font-bold text-zinc-400 text-lg">Account Information</h2>
                        <div className="space-y-6 text-sm">
                            <div className="flex justify-between items-center border-b border-zinc-700">
                                <span className="text-zinc-400">Member Since</span>
                                <span>{authUser.createdAt?.split('T')[0]}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-zinc-400">Account Status</span>
                                <span className="text-green-500">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Lock, Mail, MessageSquare } from 'lucide-react';
import AuthImagePattern from '../components/AuthImagePattern';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const { isLogging, login } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const showPassword = false;
    const handleSubmit = (e) => {
        e.preventDefault();
        const success = validData();
        if (success) return login(formData);
    };
    const validData = () => {
        if (!formData.email.trim()) return toast.error('Email is required!');
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error('Invalid email format');
        if (!formData.password) return toast.error('Password is required!');
        if (formData.password.length < 4) return toast.error('Password must be at 4 char');
        return true;
    };
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* left side  */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center mb-8">
                        <div className=" flex flex-col items-center gap-2 group">
                            <div
                                className="size-12 rounded-xl flex justify-center items-center bg-primary/10 
                              group-hover:bg-primary/20 transition-colors"
                            >
                                <MessageSquare className="text-primary size-6" />
                            </div>
                            <h1 className="mt-2 font-bold text-2xl">Welcome to ChatApp</h1>
                            <p className="text-base-content/60">Get start with your account</p>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email:</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type="email"
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="abc@gmail.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="#####"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn w-full btn-primary" disabled={isLogging}>
                            {isLogging ? (
                                <>
                                    <Loader className="size-5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>
                    <div className="text-center">
                        <p className="text-base-content/60">
                            Don't have a account?{' '}
                            <Link to="/register" className="link link-primary">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* right side */}
            <AuthImagePattern title="Join our community" subtitle="chat, share " />
        </div>
    );
};

export default LoginPage;

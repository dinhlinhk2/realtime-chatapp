import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { LogOut, MessageSquare, Settings, User } from 'lucide-react';

const Navbar = () => {
    const { logout, authUser } = useAuthStore();

    return (
        <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
            <div className="container h-16 px-4 mx-auto">
                <div className="flex justify-between h-full items-center">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                            <div className="flex items-center size-9 rounded-lg bg-primary/10 justify-center">
                                <MessageSquare className="size-5 text-primary" />
                            </div>
                            <h1 className="text-lg font-bold">Chat</h1>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link to={'/settings'} className="btn btn-sm gap-2 transition-colors">
                            <Settings className="size-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </Link>
                        {authUser ? (
                            <>
                                <Link to={'/profile'} className="btn btn-sm gap-2">
                                    <User className="size-5" />
                                    <span className="hidden sm:inline">Profile</span>
                                </Link>
                                <button className="flex items-center gap-2" onClick={logout}>
                                    <LogOut className="size-5" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <Link to={'/register'} className="btn btn-sm gap-2">
                                <User className="size-5" />
                                <span className="hidden sm:inline">Register</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

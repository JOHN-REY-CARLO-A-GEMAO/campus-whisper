import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, Shield, MessageCircle } from "lucide-react";

export default function Layout({ children, currentPageName }) {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
            <style>{`
                :root {
                    --primary-purple: #8B5CF6;
                    --primary-teal: #14B8A6;
                    --soft-purple: #F3F4F6;
                    --warm-gray: #6B7280;
                }

                .glass-effect {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .confession-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .confession-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
            `}</style>

            {/* Header */}
            <header className="glass-effect border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to={createPageUrl("Feed")} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                                    Campus Confessions
                                </h1>
                                <p className="text-xs text-gray-500">Your space to share, anonymously.</p>
                            </div>
                        </Link>

                        <nav className="hidden md:flex items-center gap-1">
                            <Link
                                to={createPageUrl("Feed")}
                                className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${
                                    location.pathname === createPageUrl("Feed")
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'text-gray-600 hover:bg-white/50'
                                }`}
                            >
                                <MessageCircle className="w-4 h-4" />
                                Feed
                            </Link>
                            <Link
                                to={createPageUrl("Guidelines")}
                                className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${
                                    location.pathname === createPageUrl("Guidelines")
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'text-gray-600 hover:bg-white/50'
                                }`}
                            >
                                <Shield className="w-4 h-4" />
                                Rules
                            </Link>
                        </nav>

                        {/* Mobile menu - simplified */}
                        <div className="md:hidden">
                            <Link
                                to={createPageUrl("Guidelines")}
                                className="p-2 rounded-full hover:bg-white/50 transition-colors"
                            >
                                <Shield className="w-5 h-5 text-gray-600" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="min-h-screen">
                {children}
            </main>

            {/* Footer */}
            <footer className="glass-effect border-t border-white/20 mt-16">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-2">
                            <Heart className="w-5 h-5 text-purple-500" />
                            <span className="text-sm text-gray-600">
                                A place for authentic, anonymous sharing.
                            </span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                            <span>• Posts auto-delete after 30 days</span>
                            <span>• No personal data stored</span>
                            <span>• Community moderated</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Heart, Users, MessageSquare } from "lucide-react";
import { Confession, User } from "@/entities/all";
import PostCard from "../components/confession/PostCard";
import PostForm from "../components/confession/PostForm";
import FilterBar from "../components/confession/FilterBar";
import CommentSection from "../components/confession/CommentSection";
import UsernameSetup from "../components/user/UsernameSetup";
import UserProfile from "../components/user/UserProfile";

export default function Feed() {
    const [confessions, setConfessions] = useState([]);
    const [filteredConfessions, setFilteredConfessions] = useState([]);
    const [showPostForm, setShowPostForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedConfession, setSelectedConfession] = useState(null);
    const [currentUser, setCurrentUser] = useState(undefined); // undefined for loading state, null for no user, object for logged in user
    const [showUsernameSetup, setShowUsernameSetup] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("recent");

    useEffect(() => {
        initializeUser();
        loadConfessions();
    }, []);

    useEffect(() => {
        filterConfessions();
    }, [confessions, searchTerm, selectedCategory, sortBy]);

    const initializeUser = async () => {
        try {
            const user = await User.me();
            if (user && !user.username) {
                setShowUsernameSetup(true);
            }
            setCurrentUser(user);
        } catch (error) {
            console.error("User not logged in or session expired:", error);
            setCurrentUser(null); // Set to null if no user session or error
        }
    };

    const handleLogin = async () => {
        try {
            await User.login();
            // After successful login, re-initialize user to fetch details
            const user = await User.me();
            setCurrentUser(user);
            if (!user.username) {
                setShowUsernameSetup(true);
            }
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    const handleUsernameSetupComplete = async () => {
        setShowUsernameSetup(false);
        try {
            const user = await User.me();
            setCurrentUser(user);
        } catch (error) {
            console.error("Error loading user after setup:", error);
        }
    };

    const loadConfessions = async () => {
        setIsLoading(true);
        try {
            const fetchedConfessions = await Confession.list("-created_date", 50);
            setConfessions(fetchedConfessions);
        } catch (error) {
            console.error("Error loading confessions:", error);
        }
        setIsLoading(false);
    };

    const filterConfessions = () => {
        let filtered = [...confessions];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(confession =>
                (confession.title && confession.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (confession.content && confession.content.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter(confession => confession.category === selectedCategory);
        }

        // Sort
        if (sortBy === "popular") {
            filtered.sort((a, b) => (b.hug_count || 0) - (a.hug_count || 0));
        } else if (sortBy === "related") {
            filtered.sort((a, b) => (b.relate_count || 0) - (a.relate_count || 0));
        } else {
            // Default to recent
            filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        }

        setFilteredConfessions(filtered);
    };

    const handleSubmitPost = async (postData) => {
        setIsSubmitting(true);
        try {
            // Ensure currentUser and its id exist before creating post
            if (!currentUser || !currentUser.id) {
                throw new Error("User not logged in or user ID is missing.");
            }
            await Confession.create({ ...postData, author_id: currentUser.id });
            setShowPostForm(false);
            loadConfessions();
        } catch (error) {
            console.error("Error creating confession:", error);
            // Optionally, show an error message to the user
        }
        setIsSubmitting(false);
    };

    const handleReport = async (confessionId) => {
        try {
            const confession = confessions.find(c => c.id === confessionId);
            if (confession) {
                await Confession.update(confessionId, {
                    is_reported: true,
                    report_count: (confession.report_count || 0) + 1
                });
                alert("Thank you for your report. Our team will review this content.");
            } else {
                console.warn("Confession not found for reporting:", confessionId);
            }
        } catch (error) {
            console.error("Error reporting confession:", error);
        }
    };

    if (currentUser === undefined) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (showUsernameSetup && currentUser && !currentUser.username) {
        return <UsernameSetup onComplete={handleUsernameSetupComplete} />;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                            Campus Confessions
                        </h1>
                        <p className="text-gray-600">Your space to share and connect.</p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span>{confessions.length} posts shared</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-500" />
                        <span>{confessions.reduce((sum, c) => sum + (c.hug_count || 0), 0)} hugs given</span>
                    </div>
                </div>

                <Button
                    onClick={() => currentUser ? setShowPostForm(true) : handleLogin()}
                    className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 shadow-lg gap-2"
                    size="lg"
                >
                    <Plus className="w-5 h-5" />
                    {currentUser ? "Share a Post" : "Sign In to Share"}
                </Button>
            </div>

            {/* Post Form Modal */}
            {showPostForm && currentUser && ( // Ensure currentUser exists before showing form
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <PostForm
                            currentUser={currentUser}
                            onSubmit={handleSubmitPost}
                            onCancel={() => setShowPostForm(false)}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>
            )}

            {/* Filter Bar */}
            <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
            />

            {/* Confessions List */}
            <div className="space-y-6">
                {isLoading && confessions.length === 0 ? ( // Only show loading spinner if initial load and no confessions
                    <div className="text-center py-12">
                        <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading posts...</p>
                    </div>
                ) : filteredConfessions.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts found</h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm || selectedCategory !== "all"
                                ? "Try adjusting your filters or search terms."
                                : "Be the first to share something with the community."
                            }
                        </p>
                        {!searchTerm && selectedCategory === "all" && currentUser && (
                            <Button
                                onClick={() => setShowPostForm(true)}
                                className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create First Post
                            </Button>
                        )}
                        {!searchTerm && selectedCategory === "all" && !currentUser && (
                            <Button
                                onClick={handleLogin}
                                className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Sign In to Post
                            </Button>
                        )}
                    </div>
                ) : (
                    filteredConfessions.map((confession) => (
                        <PostCard
                            key={confession.id}
                            confession={confession}
                            currentUser={currentUser}
                            onReport={handleReport}
                            onShowComments={setSelectedConfession}
                            onShowProfile={setSelectedUserId}
                            onLogin={handleLogin} // Pass handleLogin to PostCard
                        />
                    ))
                )}
            </div>

            {/* Comment Section Modal */}
            {selectedConfession && (
                <CommentSection
                    confession={selectedConfession}
                    currentUser={currentUser}
                    onClose={() => setSelectedConfession(null)}
                    onLogin={handleLogin} // Pass handleLogin to CommentSection
                />
            )}

            {/* User Profile Modal */}
            {selectedUserId && (
                <UserProfile
                    userId={selectedUserId}
                    currentUser={currentUser}
                    onClose={() => setSelectedUserId(null)}
                    onLogin={handleLogin} // Pass handleLogin to UserProfile
                />
            )}
        </div>
    );
}

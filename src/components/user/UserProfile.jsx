import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Follow, Confession } from "@/entities/all";
import { Users, MessageSquare, Heart, UserPlus, UserMinus } from "lucide-react";

const avatarColorClasses = {
    purple: "bg-purple-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    pink: "bg-pink-500",
    orange: "bg-orange-500",
    teal: "bg-teal-500",
    red: "bg-red-500",
    indigo: "bg-indigo-500"
};

export default function UserProfile({ userId, currentUser, onClose, onLogin }) {
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUserData();
        if (currentUser) {
            checkFollowStatus();
        }
    }, [userId, currentUser]);

    const loadUserData = async () => {
        try {
            const userData = await User.filter({ id: userId });
            if (userData.length > 0) {
                setUser(userData[0]);

                // Load user's posts
                const posts = await Confession.filter({ author_id: userId }, "-created_date", 10);
                setUserPosts(posts);
            }
        } catch (error) {
            console.error("Error loading user data:", error);
        }
        setIsLoading(false);
    };

    const checkFollowStatus = async () => {
        if (!currentUser || userId === currentUser.id) return;

        try {
            const followRecord = await Follow.filter({
                follower_id: currentUser.id,
                following_id: userId
            });
            setIsFollowing(followRecord.length > 0);
        } catch (error) {
            console.error("Error checking follow status:", error);
        }
    };

    const handleFollow = async () => {
        if (!currentUser) {
            onLogin?.();
            return;
        }

        if (userId === currentUser.id) return;

        try {
            if (isFollowing) {
                // Unfollow
                const followRecord = await Follow.filter({
                    follower_id: currentUser.id,
                    following_id: userId
                });
                if (followRecord.length > 0) {
                    await Follow.delete(followRecord[0].id);

                    // Update counts
                    await User.update(userId, {
                        follower_count: Math.max(0, (user.follower_count || 0) - 1)
                    });
                    await User.update(currentUser.id, {
                        following_count: Math.max(0, (currentUser.following_count || 0) - 1)
                    });
                }
                setIsFollowing(false);
            } else {
                // Follow
                await Follow.create({
                    follower_id: currentUser.id,
                    following_id: userId
                });

                // Update counts
                await User.update(userId, {
                    follower_count: (user.follower_count || 0) + 1
                });
                await User.update(currentUser.id, {
                    following_count: (currentUser.following_count || 0) + 1
                });

                setIsFollowing(true);
            }

            // Refresh user data
            loadUserData();
        } catch (error) {
            console.error("Error updating follow status:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl p-8">
                    <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl p-8 text-center">
                    <p>User not found</p>
                    <Button onClick={onClose} className="mt-4">Close</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-effect border-white/30 shadow-2xl">
                <CardHeader className="text-center pb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div></div>
                        <Button variant="ghost" onClick={onClose}>✕</Button>
                    </div>

                    <div className={`w-20 h-20 ${avatarColorClasses[user.avatar_color || 'purple']} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <span className="text-2xl font-bold text-white">
                            {user.display_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'}
                        </span>
                    </div>

                    <CardTitle className="text-2xl font-bold">{user.display_name}</CardTitle>
                    <p className="text-gray-500">@{user.username}</p>

                    {user.bio && (
                        <p className="text-gray-600 mt-2 max-w-md mx-auto">{user.bio}</p>
                    )}

                    <div className="flex justify-center gap-6 mt-4">
                        <div className="text-center">
                            <div className="font-bold text-lg">{user.follower_count || 0}</div>
                            <div className="text-sm text-gray-500">Followers</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-lg">{user.following_count || 0}</div>
                            <div className="text-sm text-gray-500">Following</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-lg">{userPosts.length}</div>
                            <div className="text-sm text-gray-500">Posts</div>
                        </div>
                    </div>

                    {currentUser && userId !== currentUser.id && (
                        <Button
                            onClick={handleFollow}
                            className={`mt-4 gap-2 ${
                                isFollowing
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700'
                            }`}
                            variant={isFollowing ? "outline" : "default"}
                        >
                            {isFollowing ? (
                                <>
                                    <UserMinus className="w-4 h-4" />
                                    Unfollow
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    Follow
                                </>
                            )}
                        </Button>
                    )}

                    {!currentUser && (
                         <Button
                            onClick={handleFollow}
                            className="mt-4 gap-2 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700"
                        >
                            <UserPlus className="w-4 h-4" />
                            Follow
                        </Button>
                    )}
                </CardHeader>

                <CardContent>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Recent Posts
                    </h3>

                    {userPosts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No posts yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {userPosts.map((post) => (
                                <div key={post.id} className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium mb-2">{post.title}</h4>
                                    <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
                                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Heart className="w-3 h-3" />
                                            {post.hug_count || 0}
                                        </span>
                                        <Badge variant="secondary" className="text-xs">
                                            {post.category?.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

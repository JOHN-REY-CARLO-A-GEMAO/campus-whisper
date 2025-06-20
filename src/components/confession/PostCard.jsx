import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Heart,
    MessageCircle,
    Flag,
    Clock,
    ThumbsUp,
    User as UserIcon
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Confession, Reaction, User } from "@/entities/all";

const categoryColors = {
    daily_life: "bg-blue-100 text-blue-800",
    funny: "bg-yellow-100 text-yellow-800",
    rant: "bg-red-100 text-red-800",
    relationships: "bg-pink-100 text-pink-800",
    deep_thoughts: "bg-indigo-100 text-indigo-800",
    school_life: "bg-purple-100 text-purple-800",
    advice_needed: "bg-green-100 text-green-800",
    secret: "bg-gray-100 text-gray-800"
};

const categoryLabels = {
    daily_life: "Daily Life",
    funny: "Funny",
    rant: "Rant",
    relationships: "Relationships",
    deep_thoughts: "Deep Thoughts",
    school_life: "School Life",
    advice_needed: "Advice Needed",
    secret: "Secret"
};

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

export default function PostCard({ confession, currentUser, onReport, onShowComments, onShowProfile, onLogin }) {
    const [hugCount, setHugCount] = useState(confession.hug_count || 0);
    const [relateCount, setRelateCount] = useState(confession.relate_count || 0);
    const [hasHugged, setHasHugged] = useState(false);
    const [hasRelated, setHasRelated] = useState(false);
    const [author, setAuthor] = useState(null);

    useEffect(() => {
        if (confession.author_id) {
            loadAuthor();
        }
        if (currentUser) {
            checkUserReactions();
        }
    }, [confession.author_id, currentUser]);

    const loadAuthor = async () => {
        try {
            const userData = await User.filter({ id: confession.author_id });
            if (userData.length > 0) {
                setAuthor(userData[0]);
            }
        } catch (error) {
            console.error("Error loading author:", error);
        }
    };

    const checkUserReactions = async () => {
        if (!currentUser) return;

        try {
            const reactions = await Reaction.filter({
                user_id: currentUser.id,
                post_id: confession.id
            });

            setHasHugged(reactions.some(r => r.reaction_type === 'hug'));
            setHasRelated(reactions.some(r => r.reaction_type === 'relate'));
        } catch (error) {
            console.error("Error checking reactions:", error);
        }
    };

    const handleReaction = async (type) => {
        if (!currentUser) {
            onLogin?.();
            return;
        }

        const hasReacted = type === 'hug' ? hasHugged : hasRelated;

        if (hasReacted) return; // Prevent spam

        try {
            // Add reaction record
            await Reaction.create({
                user_id: currentUser.id,
                post_id: confession.id,
                reaction_type: type
            });

            // Update counts
            const newCount = type === 'hug' ? hugCount + 1 : relateCount + 1;
            await Confession.update(confession.id, {
                [type === 'hug' ? 'hug_count' : 'relate_count']: newCount
            });

            // Update local state
            if (type === 'hug') {
                setHugCount(newCount);
                setHasHugged(true);
            } else {
                setRelateCount(newCount);
                setHasRelated(true);
            }
        } catch (error) {
            console.error("Error adding reaction:", error);
        }
    };

    const handleReport = () => {
        if (!currentUser) {
            onLogin?.();
            return;
        }
        onReport?.(confession.id);
    };

    return (
        <Card className="confession-card glass-effect border-white/30 shadow-lg">
            <CardContent className="p-6">
                {/* Header with Author */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {confession.author_id && author ? (
                            <div
                                className={`w-10 h-10 ${avatarColorClasses[author?.avatar_color || 'purple']} rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform`}
                                onClick={() => onShowProfile?.(confession.author_id)}
                            >
                                <span className="text-white font-semibold">
                                    {author?.display_name?.[0]?.toUpperCase() || author?.username?.[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>
                        ) : (
                             <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-white" />
                             </div>
                        )}
                        <div>
                            <div
                                className={`font-medium text-gray-900 ${confession.author_id ? 'cursor-pointer hover:text-purple-600 transition-colors' : ''}`}
                                onClick={() => confession.author_id && onShowProfile?.(confession.author_id)}
                            >
                                {author?.display_name || 'Anonymous'}
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className={categoryColors[confession.category]}>
                                    {categoryLabels[confession.category]}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(confession.created_date), { addSuffix: true })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 text-lg leading-relaxed">
                        {confession.title}
                    </h3>
                    {confession.image_url && (
                        <div className="rounded-lg overflow-hidden my-4">
                            <img
                                src={confession.image_url}
                                alt="User upload for confession"
                                className="w-full h-auto max-h-96 object-cover"
                            />
                        </div>
                    )}
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {confession.content}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReaction('hug')}
                            disabled={hasHugged && currentUser}
                            className={`gap-2 hover:bg-pink-50 hover:text-pink-600 transition-colors ${
                                hasHugged && currentUser ? 'text-pink-600 bg-pink-50' : 'text-gray-600'
                            }`}
                        >
                            <Heart className={`w-4 h-4 ${hasHugged && currentUser ? 'fill-current' : ''}`} />
                            {hugCount}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReaction('relate')}
                            disabled={hasRelated && currentUser}
                            className={`gap-2 hover:bg-purple-50 hover:text-purple-600 transition-colors ${
                                hasRelated && currentUser ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
                            }`}
                        >
                            <ThumbsUp className={`w-4 h-4 ${hasRelated && currentUser ? 'fill-current' : ''}`} />
                            {relateCount}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onShowComments?.(confession)}
                            className="gap-2 text-gray-600 hover:bg-teal-50 hover:text-teal-600"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Comments
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReport}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <Flag className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

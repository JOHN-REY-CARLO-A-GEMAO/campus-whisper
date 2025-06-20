import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Send, Heart, MessageCircle, Flag } from "lucide-react";
import { Comment, User } from "@/entities/all";
import { formatDistanceToNow } from "date-fns";

export default function CommentSection({ confession, currentUser, onClose, onLogin }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadComments();
    }, [confession.id]);

    const loadComments = async () => {
        setIsLoading(true);
        try {
            const fetchedComments = await Comment.filter(
                { confession_id: confession.id },
                "-created_date"
            );
            setComments(fetchedComments);
        } catch (error) {
            console.error("Error loading comments:", error);
        }
        setIsLoading(false);
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        if (!currentUser) {
            onLogin?.();
            return;
        }

        setIsSubmitting(true);
        try {
            const commentData = {
                confession_id: confession.id,
                content: newComment.trim(),
                author_id: currentUser.id,
                is_supportive: true,
                hug_count: 0,
                is_reported: false
            };

            await Comment.create(commentData);
            setNewComment("");
            loadComments();
        } catch (error) {
            console.error("Error posting comment:", error);
        }
        setIsSubmitting(false);
    };

    const handleHugComment = async (commentId, currentHugs) => {
        if (!currentUser) {
            onLogin?.();
            return;
        }
        try {
            await Comment.update(commentId, { hug_count: (currentHugs || 0) + 1 });
            loadComments();
        } catch (error) {
            console.error("Error hugging comment:", error);
        }
    };

    const handleReportComment = async (commentId) => {
        if (!currentUser) {
            onLogin?.();
            return;
        }
        // Placeholder for report logic
        console.log("Reporting comment", commentId);
        alert("Thank you for your report. Our team will review it shortly.");
        // In a real application, you would make an API call to mark the comment as reported
        // For example: await Comment.update(commentId, { is_reported: true });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden glass-effect border-white/30 shadow-2xl">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-lg font-semibold mb-2">
                                {confession.title}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-purple-100 text-purple-800">
                                    {confession.category?.replace('_', ' ')}
                                </Badge>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Heart className="w-3 h-3" />
                                        {confession.hug_count || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircle className="w-3 h-3" />
                                        {comments.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-0 flex flex-col max-h-[calc(90vh-180px)]">
                    {/* Comments List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {isLoading ? (
                            <div className="text-center text-gray-500 py-8">
                                Loading comments...
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>No comments yet. Be the first to offer support!</p>
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <p className="text-gray-700 leading-relaxed">
                                        {comment.content}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>
                                                {formatDistanceToNow(new Date(comment.created_date), { addSuffix: true })}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleHugComment(comment.id, comment.hug_count)}
                                                className="gap-1 text-pink-600 hover:bg-pink-50 h-8 px-2"
                                            >
                                                <Heart className="w-3 h-3" />
                                                {comment.hug_count || 0}
                                            </Button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleReportComment(comment.id)}
                                            className="text-gray-400 hover:text-red-500 h-8 px-2"
                                        >
                                            <Flag className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Comment Form */}
                    <div className="border-t border-gray-100 p-6">
                        <form onSubmit={handleSubmitComment} className="space-y-4">
                            <Textarea
                                placeholder={currentUser ? "Share your support, advice, or similar experience..." : "Sign in to leave a comment..."}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-none"
                                rows={3}
                                maxLength={500}
                                disabled={!currentUser}
                            />
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500">
                                    {currentUser ? `${newComment.length}/500 characters • Your comment is anonymous` : "Join the conversation"}
                                </p>
                                <Button
                                    type="submit"
                                    disabled={!newComment.trim() || isSubmitting}
                                    className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700"
                                    size="sm"
                                >
                                    {isSubmitting ? (
                                        "Posting..."
                                    ) : (
                                        <>
                                            <Send className="w-3 h-3 mr-2" />
                                            {currentUser ? "Post Support" : "Sign In"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

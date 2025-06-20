import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Shield,
    Heart,
    Users,
    Flag,
    Lock,
    Clock,
    ThumbsUp
} from "lucide-react";

export default function Guidelines() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent mb-4">
                    Community Rules
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                    Keeping this a great place for everyone.
                </p>
            </div>

            <div className="space-y-8">
                {/* Community Rules */}
                <Card className="glass-effect border-white/30 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <ThumbsUp className="w-6 h-6 text-teal-500" />
                            The Simple Rules
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-sm font-bold text-green-600">✓</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-green-700 mb-2">Be Cool</h4>
                                    <ul className="space-y-2 text-gray-600">
                                        <li>• Share your stories, funny moments, and deep thoughts.</li>
                                        <li>• Be supportive, kind, and empathetic.</li>
                                        <li>• If someone's asking for advice, be helpful.</li>
                                        <li>• Upvote content you like and relate to.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-sm font-bold text-red-600">✗</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-red-700 mb-2">Don't Be a Jerk</h4>
                                    <ul className="space-y-2 text-gray-600">
                                        <li>• No harassment, bullying, or hate speech.</li>
                                        <li>• Don't try to identify other users. It ruins the fun.</li>
                                        <li>• No sharing personal info (yours or anyone else's).</li>
                                        <li>• No spam or advertising.</li>
                                        <li>• No illegal or harmful content.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Safety & Privacy */}
                <Card className="glass-effect border-white/30 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Lock className="w-6 h-6 text-purple-500" />
                            How We Keep This Space Safe
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Flag className="w-5 h-5 text-red-500 mt-1" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Report Button</h4>
                                        <p className="text-sm text-gray-600">
                                            See something that breaks the rules? Hit the report button. Our moderators will take a look.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Users className="w-5 h-5 text-blue-500 mt-1" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Community Moderation</h4>
                                        <p className="text-sm text-gray-600">
                                            This space is for you. Help us keep it awesome by reporting rule-breaking content.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-teal-500 mt-1" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Auto-Deletion</h4>
                                        <p className="text-sm text-gray-600">
                                            All posts automatically disappear after 30 days. Poof.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Lock className="w-5 h-5 text-green-500 mt-1" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Your Anonymity</h4>
                                        <p className="text-sm text-gray-600">
                                            We don't ask for your name, email, or track your IP. You are anonymous here.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/entities/all";
import { User as UserIcon, Sparkles } from "lucide-react";

const avatarColors = [
    { value: "purple", label: "Purple", bg: "bg-purple-500" },
    { value: "blue", label: "Blue", bg: "bg-blue-500" },
    { value: "green", label: "Green", bg: "bg-green-500" },
    { value: "pink", label: "Pink", bg: "bg-pink-500" },
    { value: "orange", label: "Orange", bg: "bg-orange-500" },
    { value: "teal", label: "Teal", bg: "bg-teal-500" },
    { value: "red", label: "Red", bg: "bg-red-500" },
    { value: "indigo", label: "Indigo", bg: "bg-indigo-500" }
];

export default function UsernameSetup({ onComplete }) {
    const [formData, setFormData] = useState({
        username: "",
        display_name: "",
        bio: "",
        avatar_color: "purple"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username.trim() || !formData.display_name.trim()) {
            setError("Username and display name are required");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            await User.updateMyUserData({
                username: formData.username.trim(),
                display_name: formData.display_name.trim(),
                bio: formData.bio.trim(),
                avatar_color: formData.avatar_color,
                follower_count: 0,
                following_count: 0
            });
            onComplete();
        } catch (error) {
            console.error("Error setting up username:", error);
            setError("Username might be taken. Please try another one.");
        }
        setIsSubmitting(false);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError("");
    };

    const selectedColor = avatarColors.find(c => c.value === formData.avatar_color);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md glass-effect border-white/30 shadow-xl">
                <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className={`w-16 h-16 ${selectedColor.bg} rounded-full flex items-center justify-center`}>
                            <UserIcon className="w-8 h-8 text-white" />
                        </div>
                        <Sparkles className="w-6 h-6 text-purple-500" />
                    </div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                        Create Your Identity
                    </CardTitle>
                    <p className="text-gray-600 mt-2">
                        Set up your username and profile to get started
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username *</Label>
                            <Input
                                id="username"
                                placeholder="Choose a unique username"
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                className="border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                                maxLength={20}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="display_name">Display Name *</Label>
                            <Input
                                id="display_name"
                                placeholder="How others will see you"
                                value={formData.display_name}
                                onChange={(e) => handleInputChange('display_name', e.target.value)}
                                className="border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                                maxLength={30}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio (Optional)</Label>
                            <Textarea
                                id="bio"
                                placeholder="Tell others about yourself..."
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                className="border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-none"
                                rows={3}
                                maxLength={150}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Avatar Color</Label>
                            <Select value={formData.avatar_color} onValueChange={(value) => handleInputChange('avatar_color', value)}>
                                <SelectTrigger className="border-gray-200 focus:border-purple-300">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {avatarColors.map((color) => (
                                        <SelectItem key={color.value} value={color.value}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-4 h-4 ${color.bg} rounded-full`}></div>
                                                {color.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {error && (
                            <p className="text-red-600 text-sm">{error}</p>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting || !formData.username.trim() || !formData.display_name.trim()}
                            className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700"
                        >
                            {isSubmitting ? "Creating Profile..." : "Get Started"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

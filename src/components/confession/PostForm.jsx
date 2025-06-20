import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UploadFile } from "@/integrations/Core";
import { Send, X, Paperclip, Trash2 } from "lucide-react";

const categories = [
    { value: "daily_life", label: "Daily Life" },
    { value: "funny", label: "Funny" },
    { value: "rant", label: "Rant" },
    { value: "relationships", label: "Relationships" },
    { value: "deep_thoughts", label: "Deep Thoughts" },
    { value: "school_life", label: "School Life" },
    { value: "advice_needed", label: "Advice Needed" },
    { value: "secret", label: "Secret" }
];

export default function PostForm({ currentUser, onSubmit, onCancel, isSubmitting }) {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "",
        image_url: null
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = React.useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim() || !formData.category || !currentUser) {
            return;
        }

        let uploadedImageUrl = null;
        if (imageFile) {
            try {
                const { file_url } = await UploadFile({ file: imageFile });
                uploadedImageUrl = file_url;
            } catch (error) {
                console.error("Error uploading image:", error);
                return;
            }
        }

        const postData = {
            ...formData,
            image_url: uploadedImageUrl,
            author_id: currentUser.id,
            hug_count: 0,
            relate_count: 0,
            is_reported: false,
            report_count: 0
        };

        await onSubmit(postData);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <Card className="glass-effect border-white/30 shadow-xl">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                        Share Your Thoughts
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>
                <p className="text-sm text-gray-600">
                    Share as {currentUser?.display_name || 'Anonymous'}
                </p>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Give your post a title..."
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                            maxLength={100}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Your Post</Label>
                        <Textarea
                            id="content"
                            placeholder="Share your thoughts, feelings, or experiences..."
                            value={formData.content}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            className="border-gray-200 focus:border-purple-300 focus:ring-purple-200 min-h-32 resize-none"
                            maxLength={2000}
                        />
                    </div>

                    {imagePreview && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8"
                                onClick={removeImage}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                <SelectTrigger className="border-gray-200 focus:border-purple-300">
                                    <SelectValue placeholder="Choose a category..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full gap-2"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Paperclip className="w-4 h-4" />
                                {imageFile ? "Change Image" : "Attach Image"}
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700"
                            disabled={isSubmitting || !formData.title.trim() || !formData.content.trim() || !formData.category}
                        >
                            {isSubmitting ? (
                                "Posting..."
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Post
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

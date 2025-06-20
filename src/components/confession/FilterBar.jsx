import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Heart, Clock, ThumbsUp } from "lucide-react";

const categories = [
    { value: "all", label: "All Categories" },
    { value: "daily_life", label: "Daily Life" },
    { value: "funny", label: "Funny" },
    { value: "rant", label: "Rant" },
    { value: "relationships", label: "Relationships" },
    { value: "deep_thoughts", label: "Deep Thoughts" },
    { value: "school_life", label: "School Life" },
    { value: "advice_needed", label: "Advice Needed" },
    { value: "secret", label: "Secret" }
];

const sortOptions = [
    { value: "recent", label: "Most Recent", icon: Clock },
    { value: "popular", label: "Most Hugs", icon: Heart },
    { value: "related", label: "Most Relatable", icon: ThumbsUp }
];

export default function FilterBar({
    searchTerm,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    sortBy,
    onSortChange
}) {
    return (
        <div className="glass-effect rounded-xl p-4 border border-white/30 shadow-lg mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                    />
                </div>

                {/* Category Filter */}
                <div className="md:w-48">
                    <Select value={selectedCategory} onValueChange={onCategoryChange}>
                        <SelectTrigger className="border-gray-200 focus:border-purple-300">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue />
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

                {/* Sort Options */}
                <div className="flex gap-2">
                    {sortOptions.map((option) => (
                        <Button
                            key={option.value}
                            variant={sortBy === option.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => onSortChange(option.value)}
                            className={`gap-2 transition-all duration-200 ${
                                sortBy === option.value
                                    ? 'bg-gradient-to-r from-purple-600 to-teal-600 border-0'
                                    : 'border-gray-200 hover:border-purple-300'
                            }`}
                        >
                            <option.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{option.label}</span>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}

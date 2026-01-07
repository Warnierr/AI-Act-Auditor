"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { ChecklistItem as ChecklistItemType } from "@/data/checklist"

interface ChecklistItemProps {
    item: ChecklistItemType;
    checked: boolean;
    onToggle: (itemId: string, checked: boolean) => void;
}

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "critical":
            return "bg-red-600 text-white";
        case "high":
            return "bg-orange-600 text-white";
        case "medium":
            return "bg-amber-600 text-white";
        case "low":
            return "bg-blue-600 text-white";
        default:
            return "bg-slate-600 text-white";
    }
};

const getPriorityLabel = (priority: string) => {
    switch (priority) {
        case "critical":
            return "🔴 Critical";
        case "high":
            return "🟠 High";
        case "medium":
            return "🟡 Medium";
        case "low":
            return "🔵 Low";
        default:
            return priority;
    }
};

export function ChecklistItemComponent({ item, checked, onToggle }: ChecklistItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card className={`p-4 transition-all ${checked ? 'bg-muted/50 opacity-75' : 'hover:shadow-md'}`}>
            <div className="flex items-start gap-3">
                <Checkbox
                    id={item.id}
                    checked={checked}
                    onCheckedChange={(c) => onToggle(item.id, c as boolean)}
                    className="mt-1"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <label
                            htmlFor={item.id}
                            className={`text-sm font-semibold cursor-pointer ${checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                        >
                            {item.title}
                        </label>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(item.priority)}`}>
                                {getPriorityLabel(item.priority)}
                            </Badge>
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="p-1 hover:bg-muted rounded transition-colors"
                                aria-label={isExpanded ? "Collapse" : "Expand"}
                            >
                                {isExpanded ? (
                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-2 space-y-2 border-t border-border mt-2">
                                    <p className="text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="secondary" className="text-xs">
                                            {item.category}
                                        </Badge>
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary hover:underline flex items-center gap-1"
                                        >
                                            {item.article}
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Card>
    );
}

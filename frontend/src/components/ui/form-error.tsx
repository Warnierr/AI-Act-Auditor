"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle } from "lucide-react"

interface FormErrorProps {
    message?: string;
}

export function FormError({ message }: FormErrorProps) {
    if (!message) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-xs text-destructive mt-1"
            >
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
                <span>{message}</span>
            </motion.div>
        </AnimatePresence>
    );
}

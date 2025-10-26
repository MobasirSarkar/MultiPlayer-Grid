"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface GridCellProps {
    x: number
    y: number
    character: string | null
    isSelected: boolean
    onClick: () => void
    disabled: boolean
}

export const GridCell: React.FC<GridCellProps> = ({ character, isSelected, onClick, disabled }) => {
    const isEmpty = !character;
    return (
        <button
            onClick={onClick}
            disabled={disabled || !isEmpty}
            className={cn(
                "aspect-square flex items-center justify-center",
                "text-xs sm:text-sm md:text-base lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold",
                "border-2 sm:border-3 md:border-4 border-lime-500 transition-all duration-200",
                "rounded-none",
                isSelected ? "ring-2 ring-lime-600 ring-offset-2 scale-95 shadow-lg" : "hover:shadow-md",
                // Disabled state
                disabled || character !== null ? "cursor-not-allowed" : "cursor-pointer hover:scale-95 active:scale-90",
                // Text color
                character ? "text-lime-600" : "text-lime-400",

                isEmpty ? "bg-lime-500 text-lime-600" : "bg-lime-50"
            )}
            aria-pressed={isSelected}
            aria-disabled={disabled || character !== null}
        >
            {character || ""}
        </button>
    )
}

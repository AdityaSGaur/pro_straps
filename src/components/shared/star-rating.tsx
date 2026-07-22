"use client";

import { StarIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  count?: number;
  className?: string;
}

const SIZE_MAP = { sm: 14, md: 16, lg: 24 } as const;

export function StarRating({
  rating,
  size = "sm",
  showValue = true,
  count,
  className,
}: StarRatingProps) {
  const sizeVal = SIZE_MAP[size];
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <span key={i} className="relative inline-block shrink-0">
            {/* Background (empty) star */}
            <StarIcon size={sizeVal} className="text-muted-foreground/30" />
            {/* Foreground (filled) star with clip for half stars */}
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{
                  width: partial ? `${(rating - i) * 100}%` : "100%",
                }}
              >
                <StarIcon size={sizeVal} className="text-lime" />
              </span>
            )}
          </span>
        );
      })}
      {showValue && (
        <span className="text-xs text-muted-foreground ml-1">
          {rating.toFixed(1)}
          {count !== undefined && count > 0 && ` (${count})`}
        </span>
      )}
    </div>
  );
}


import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-6 w-6", props.className)}
            {...props}
        >
            <path d="M16 8.11V4.5a2 2 0 0 0-2-2h-3.5a2 2 0 0 0-2 2v10.5A4.5 4.5 0 1 0 13 15V9a2 2 0 0 0-2-2H8" />
        </svg>
    )
}

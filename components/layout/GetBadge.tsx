import Image from "next/image"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"

type GetBadgeProps = {
    name?: string
    avatarUrl?: string | null
    size?: number  
    className?: string
}

export const GetBadge = ({ name, avatarUrl, size = 40, className }: GetBadgeProps) => {
    const [failed, setFailed] = useState(false)

    const initials = useMemo(() => {
        if (!name) return "?"
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
    }, [name])

    if (avatarUrl && !failed) {
        return (
            <Image
                src={avatarUrl}
                alt={name ? `${name} avatar` : "User avatar"}
                width={size}
                height={size}
                onError={() => setFailed(true)}
                className={cn("rounded-full object-cover", className)}
            />
        )
    }

    return (
        <div
            style={{ width: size, height: size }}
            className={cn(
                "inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground font-medium",
                className
            )}
            aria-label={name ? `${name} initials` : "User initials"}
        >
            {initials}
        </div>
    )
}

export default GetBadge
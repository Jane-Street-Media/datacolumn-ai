import * as React from "react"

import { cn } from "@/lib/utils"

function PageHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="page-header"
            className={cn(
                "text-card-foreground flex flex-col py-5",
                className
            )}
            {...props}
        />
    )
}

function PageHeaderHead({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="page-header-head"
            className={cn(
                "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
                className
            )}
            {...props}
        />
    )
}

function PageHeaderTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="page-header-title"
            className={cn("leading-none font-semibold", className)}
            {...props}
        />
    )
}

function PageHeaderDescription({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="page-header-description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    )
}

function PageHeaderAction({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="page-header-action"
            className={cn(
                "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
                className
            )}
            {...props}
        />
    )
}

export {
    PageHeader,
    PageHeaderHead,
    PageHeaderTitle,
    PageHeaderAction,
    PageHeaderDescription,
}

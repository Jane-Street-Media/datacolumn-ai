// components/Markdown.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export function Markdown({ content }) {
    return (
        <article
            className={cn(
                "prose prose-sm prose-headings:font-semibold prose-a:text-primary dark:prose-invert"
            )}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        if (inline) {
                            return (
                                <code
                                    className={cn(
                                        className,
                                        "rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
                                    )}
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <pre className="my-4 overflow-x-auto rounded-lg bg-muted p-4">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}

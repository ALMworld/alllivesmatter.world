import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type MDXComponents = {
    [key: string]: React.ComponentType<any>
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // Apply custom styling to MDX elements for consistent FAQ answer rendering
        p: ({ children }: { children: ReactNode }) => (
            <p className="text-lg text-gray-300 mb-4">{children}</p>
        ),
        a: ({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) => (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline_ref text-yellow-400 hover:text-yellow-300 underline"
                {...props}
            >
                {children}
            </a>
        ),
        ul: ({ children }: { children: ReactNode }) => (
            <ul className="list-disc pl-6 mb-4 text-gray-300">{children}</ul>
        ),
        li: ({ children }: { children: ReactNode }) => (
            <li className="mb-2 text-lg">{children}</li>
        ),
        strong: ({ children }: { children: ReactNode }) => (
            <strong className="text-white font-semibold">{children}</strong>
        ),
        em: ({ children }: { children: ReactNode }) => (
            <em className="text-yellow-300">{children}</em>
        ),
        ...components,
    }
}

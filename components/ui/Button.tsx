import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "outline";
    size?: "sm" | "md" | "lg";
    children: ReactNode;
}

const sizeClasses: Record<string, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
};

const variantClasses: Record<string, string> = {
    primary:
        "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20",
    secondary:
        "bg-gray-700 hover:bg-gray-600 text-white",
    ghost:
        "bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white",
    outline:
        "border border-gray-600 hover:border-gray-500 bg-transparent text-gray-300 hover:text-white",
};

export default function Button({
    variant = "primary",
    size = "md",
    className = "",
    children,
    ...rest
}: ButtonProps) {
    return (
        <button
            className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
}

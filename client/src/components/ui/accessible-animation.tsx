import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AccessibleAnimationProps {
  children: React.ReactNode;
  animationClass: string;
  ariaLabel?: string;
  ariaLive?: "off" | "polite" | "assertive";
  reduceMotion?: boolean;
  description?: string;
  className?: string;
  role?: string;
}

/**
 * AccessibleAnimation component
 * Wraps animated elements with proper ARIA attributes for screen readers
 * Respects users' prefers-reduced-motion settings
 */
export function AccessibleAnimation({
  children,
  animationClass,
  ariaLabel,
  ariaLive = "polite",
  reduceMotion = false,
  description,
  className,
  role = "status",
}: AccessibleAnimationProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Detect user's motion preference
  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (!mounted) return null;

  // Skip animation if user prefers reduced motion or if reduceMotion prop is true
  const shouldReduceMotion = prefersReducedMotion || reduceMotion;

  return (
    <div
      className={cn(className, !shouldReduceMotion ? animationClass : "")}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      role={role}
    >
      {children}
      
      {/* Screen reader only description */}
      {description && (
        <span className="sr-only">{description}</span>
      )}
    </div>
  );
}

/**
 * AccessibleLoader component
 * A specialized accessible animation for loading states
 */
export function AccessibleLoader({
  className,
  size = "md",
  label = "Loading, please wait",
  reduceMotion = false
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
  reduceMotion?: boolean;
}) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4"
  };
  
  return (
    <AccessibleAnimation
      animationClass="animate-spin"
      ariaLabel={label}
      ariaLive="polite"
      reduceMotion={reduceMotion}
      description={label}
      role="progressbar"
    >
      <div 
        className={cn(
          "rounded-full border-primary border-t-transparent",
          sizeClasses[size],
          className
        )}
      />
    </AccessibleAnimation>
  );
}

/**
 * AccessibleProgressIndicator component
 * Shows animated progress with accessible labels
 */
export function AccessibleProgressIndicator({
  value,
  max = 100,
  className,
  label = "Loading",
  reduceMotion = false
}: {
  value: number;
  max?: number;
  className?: string;
  label?: string;
  reduceMotion?: boolean;
}) {
  const percentage = Math.round((value / max) * 100);
  const description = `${label}: ${percentage}% complete`;
  
  return (
    <AccessibleAnimation
      animationClass="transition-all duration-500 ease-in-out"
      ariaLabel={description}
      description={description}
      reduceMotion={reduceMotion}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("w-full bg-muted rounded-full overflow-hidden", className)}
    >
      <div 
        className="h-2 bg-primary rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </AccessibleAnimation>
  );
}

/**
 * AccessibleFadeIn component
 * Fades in content with proper accessibility attributes
 */
export function AccessibleFadeIn({
  children,
  className,
  delay = 0,
  duration = 500,
  reduceMotion = false,
  description
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  reduceMotion?: boolean;
  description?: string;
}) {
  return (
    <AccessibleAnimation
      animationClass="transition-opacity"
      reduceMotion={reduceMotion}
      description={description}
      className={className}
    >
      <div 
        className="opacity-0 animate-fadeIn"
        style={{ 
          animationDelay: `${delay}ms`, 
          animationDuration: `${duration}ms`,
          animationFillMode: 'forwards' 
        }}
      >
        {children}
      </div>
    </AccessibleAnimation>
  );
}
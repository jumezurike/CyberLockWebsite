import React, { useEffect, useState } from "react";
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
  style?: React.CSSProperties;
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
  reduceMotion,
  description,
  className,
  role = "region",
  style,
}: AccessibleAnimationProps) {
  // Check if user prefers reduced motion (browser setting)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for browser preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes to the prefers-reduced-motion media query
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Only apply animation if user has not enabled reduced motion
  const shouldAnimate = !(reduceMotion || prefersReducedMotion);

  return (
    <div
      className={cn(shouldAnimate ? animationClass : "", className)}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      role={role}
      style={style}
    >
      {description && (
        <span className="sr-only">{description}</span>
      )}
      {children}
    </div>
  );
}

interface AccessibleLoaderProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  ariaLive?: "off" | "polite" | "assertive";
  reduceMotion?: boolean;
  className?: string;
}

/**
 * AccessibleLoader component
 * A specialized accessible animation for loading states
 */
export function AccessibleLoader({ 
  size = "md", 
  label = "Loading...", 
  ariaLive = "polite",
  reduceMotion,
  className
}: AccessibleLoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <AccessibleAnimation
      animationClass="animate-spin"
      ariaLabel={label}
      ariaLive={ariaLive}
      description={label}
      reduceMotion={reduceMotion}
      role="status"
      className={cn("rounded-full border-primary border-r-transparent", sizeClasses[size], className)}
    >
      {!reduceMotion && (
        <span className="sr-only">{label}</span>
      )}
    </AccessibleAnimation>
  );
}

interface AccessibleProgressIndicatorProps {
  value: number;
  max?: number;
  label?: string;
  ariaLive?: "off" | "polite" | "assertive";
  reduceMotion?: boolean;
  className?: string;
}

/**
 * AccessibleProgressIndicator component
 * Shows animated progress with accessible labels
 */
export function AccessibleProgressIndicator({ 
  value, 
  max = 100, 
  label = "Loading...",
  ariaLive = "polite",
  reduceMotion,
  className
}: AccessibleProgressIndicatorProps) {
  const progress = Math.min(100, Math.max(0, (value / max) * 100));
  const displayValue = Math.round(progress);
  const progressText = `${displayValue}% complete`;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span>{progressText}</span>
      </div>
      <div 
        className="w-full bg-muted rounded-full h-2.5 overflow-hidden" 
        role="progressbar" 
        aria-valuenow={displayValue} 
        aria-valuemin={0} 
        aria-valuemax={100}
        aria-label={`${label} progress: ${progressText}`}
      >
        <AccessibleAnimation
          animationClass={reduceMotion ? "" : "transition-all duration-500 ease-in-out"}
          ariaLive={ariaLive}
          reduceMotion={reduceMotion}
          className="h-full bg-primary rounded-full"
          style={{ width: `${progress}%` }}
        >
          <span className="sr-only">{progressText}</span>
        </AccessibleAnimation>
      </div>
    </div>
  );
}

interface AccessibleFadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  ariaLive?: "off" | "polite" | "assertive";
  reduceMotion?: boolean;
  description?: string;
  className?: string;
}

/**
 * AccessibleFadeIn component
 * Fades in content with proper accessibility attributes
 */
export function AccessibleFadeIn({
  children,
  delay = 0,
  duration = 500,
  ariaLive = "polite",
  reduceMotion,
  description,
  className,
}: AccessibleFadeInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Check if user prefers reduced motion (browser setting)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for browser preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes to the prefers-reduced-motion media query
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Only apply animation if user has not enabled reduced motion
  const shouldAnimate = !(reduceMotion || prefersReducedMotion);

  const animationStyle = shouldAnimate
    ? {
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${duration}ms ease-in-out`,
      }
    : {};

  // If not animating, still need to respect the delay before showing content
  if (!isVisible && shouldAnimate) {
    return null;
  }

  return (
    <div
      className={cn(className)}
      style={animationStyle}
      aria-live={ariaLive}
      role="region"
    >
      {description && (
        <span className="sr-only">{description}</span>
      )}
      {children}
    </div>
  );
}
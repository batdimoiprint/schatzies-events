import { useEffect, useRef, useState, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  /** Animation variant: 'up' (default), 'left', 'right', 'scale', 'fade' */
  variant?: 'up' | 'left' | 'right' | 'scale' | 'fade';
  /** Delay in ms before starting animation */
  delay?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  threshold = 0.12,
  rootMargin = '0px 0px -12% 0px',
  variant = 'up',
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      const frame = window.requestAnimationFrame(() => setIsVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div
      ref={ref}
      className={`${className} scroll-reveal scroll-reveal--${variant} ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}

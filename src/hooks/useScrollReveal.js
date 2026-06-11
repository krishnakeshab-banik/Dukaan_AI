import { useEffect, useRef } from 'react';

/**
 * Returns a ref to attach to a container.
 * Children with data-reveal="true" will be animated
 * when they enter the viewport.
 */
export const useScrollReveal = (animClass = 'anim-fade') => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const children = el.querySelectorAll('[data-reveal]');
    if (!children.length) {
      // Animate the container itself
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(animClass);
          obs.disconnect();
        }
      }, { threshold: 0.12 });
      obs.observe(el);
      return () => obs.disconnect();
    }

    const observers = [];
    children.forEach((child, i) => {
      child.style.opacity = '0';
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          child.style.opacity = '';
          child.classList.add(animClass, `delay-${Math.min(i + 1, 8)}`);
          obs.disconnect();
        }
      }, { threshold: 0.1 });
      obs.observe(child);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [animClass]);

  return containerRef;
};

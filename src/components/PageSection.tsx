'use client';

import { ReactNode } from 'react';
import ScrollReveal from './ScrollReveal';

export default function PageSection({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ScrollReveal className={`py-20 md:py-28 ${className}`}>
      {children}
    </ScrollReveal>
  );
}

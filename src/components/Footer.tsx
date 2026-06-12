import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="text-center font-mono text-[9px] text-secondary border-t border-border-custom/50 pt-6 w-full max-w-7xl mx-auto px-4 md:px-6 mt-12 pb-8">
      <p>© {new Date().getFullYear()} Phan Duy Khang. Aligned with Java Spring Boot.</p>
    </footer>
  );
};

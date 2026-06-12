import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="text-center font-mono text-[9px] text-secondary border-t border-border-custom/50 pt-6 max-w-5xl w-full mx-auto mt-12 pb-8">
      <p>© {new Date().getFullYear()} Phan Duy Khang. Aligned with Java Spring Boot.</p>
      <p className="opacity-60 mt-1">Secured API: http://localhost:8080/api/v1</p>
    </footer>
  );
};

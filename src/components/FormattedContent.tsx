'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface FormattedContentProps {
  content: string;
  className?: string;
}

export const FormattedContent: React.FC<FormattedContentProps> = ({
  content,
  className = 'text-sm font-sans leading-relaxed text-[var(--text-color)] select-text markdown-body'
}) => {
  if (!content || !content.trim()) return null;

  const trimmed = content.trim();
  const isHtml = trimmed.startsWith('<') && (
    trimmed.includes('</p>') || 
    trimmed.includes('</h1>') || 
    trimmed.includes('</h2>') || 
    trimmed.includes('</h3>') || 
    trimmed.includes('</ul>') || 
    trimmed.includes('</ol>') || 
    trimmed.includes('</div>') ||
    trimmed.includes('</span>') ||
    trimmed.includes('</table>')
  );

  if (isHtml) {
    return (
      <div 
        className={className} 
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    );
  }

  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

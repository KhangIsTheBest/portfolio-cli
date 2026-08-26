'use client';

import React from 'react';
import { TipTapEditor } from './TipTapEditor';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  return <TipTapEditor {...props} />;
};

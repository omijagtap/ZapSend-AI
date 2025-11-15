"use client";

import React, { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label: string;
  description?: string;
  className?: string;
}

export function FileDropzone({ 
  onFileSelect, 
  accept = '*', 
  label, 
  description,
  className 
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      
      // Check file type if accept is specified
      if (accept !== '*') {
        const acceptedTypes = accept.split(',').map(t => t.trim());
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const fileType = file.type;
        
        const isAccepted = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return fileExtension === type.toLowerCase();
          }
          return fileType.match(new RegExp(type.replace('*', '.*')));
        });

        if (!isAccepted) {
          return;
        }
      }
      
      onFileSelect(file);
    }
  }, [accept, onFileSelect]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
        isDragging 
          ? "border-primary bg-primary/10 scale-[1.02]" 
          : "border-border hover:bg-muted/50 hover:border-primary/50",
        className
      )}
    >
      <UploadCloud 
        className={cn(
          "w-10 h-10 transition-colors",
          isDragging ? "text-primary" : "text-muted-foreground"
        )} 
      />
      <span className="mt-2 text-sm font-medium">{label}</span>
      {description && (
        <span className="text-xs text-muted-foreground mt-1">{description}</span>
      )}
    </div>
  );
}

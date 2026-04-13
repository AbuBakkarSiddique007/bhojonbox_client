"use client";

import React, { useState, useRef } from "react";
import { uploadImageToImgBB } from "@/utils/uploadImage";
import Loading from "@/components/ui/Loading";
import Image from "next/image";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  label?: string;
  isAvatar?: boolean;
}

export default function ImageUpload({ value, onChange, className = "", label = "Upload Image", isAvatar = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    setIsUploading(true);
    const url = await uploadImageToImgBB(file);
    setIsUploading(false);

    if (url) {
      onChange(url);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const radiusClass = isAvatar ? "rounded-full aspect-square" : "rounded-[1.25rem] h-40";

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">{label}</label>}

      <div
        className={`relative w-full ${radiusClass} border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all group shadow-sm
          ${isDragOver ? "border-primary bg-primary/5" : "border-border/60 bg-muted/20 hover:border-primary/50 hover:bg-muted/40"}
          ${value ? "border-none shadow-md" : ""}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        onClick={() => !value && !isUploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loading inline size="md" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">Uploading to ImgBB...</span>
          </div>
        ) : value ? (
          <div className={`w-full h-full relative group/img bg-muted overflow-hidden ${isAvatar ? 'rounded-full' : 'rounded-[1.25rem]'}`}>
            <Image
              src={value}
              alt="Uploaded preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button
                type="button"
                title="Change Image"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground rounded-full hover:scale-110 active:scale-95 transition-transform shadow-lg"
              >
                <UploadCloud size={18} />
              </button>
              <button
                type="button"
                title="Remove Image"
                onClick={(e) => { e.stopPropagation(); onChange(""); }}
                className="w-10 h-10 flex items-center justify-center bg-destructive text-destructive-foreground rounded-full hover:scale-110 active:scale-95 transition-transform shadow-lg"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-muted-foreground/60 group-hover:text-primary transition-colors cursor-pointer p-4 text-center">
            <ImageIcon size={28} className="mb-3 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest">Click or Drag & Drop</span>
            <span className="text-[10px] italic mt-1 opacity-60 font-semibold tracking-wide">High-Res Image (Max 5MB)</span>
          </div>
        )}
      </div>
    </div>
  );
}

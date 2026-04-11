"use client"

import React from "react";
import Loading from "@/components/ui/Loading";

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title = 'Are you sure?', description, confirmLabel = 'Yes', cancelLabel = 'No', loading = false, onConfirm, onCancel }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onCancel} />
      <div className="relative bg-card border border-border rounded-[2rem] shadow-2xl max-w-md w-full p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <h3 className="text-2xl font-black text-foreground brand tracking-tight mb-2">{title}</h3>
        {description && <p className="text-sm text-muted-foreground italic leading-relaxed">{description}</p>}
        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
          <button
            className="px-6 py-3 rounded-2xl bg-muted hover:bg-muted/80 text-foreground text-xs font-black uppercase tracking-widest transition-all active:scale-95 border border-border"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            className="px-6 py-3 rounded-2xl bg-destructive text-destructive-foreground text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-destructive/20"
            onClick={() => onConfirm()}
            disabled={loading}
          >
            {loading ? <Loading inline size="sm" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

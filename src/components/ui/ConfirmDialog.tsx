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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="px-3 py-1 rounded-md bg-gray-100 text-slate-700"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            className="px-3 py-1 rounded-md bg-red-600 text-white"
            onClick={() => onConfirm()}
            disabled={loading}
          >
            {loading ? <Loading inline size="sm" label="Processing…" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

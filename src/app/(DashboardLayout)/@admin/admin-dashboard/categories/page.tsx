"use client";

import { useEffect, useState } from "react";
import categoriesService from "../../../../../services/categories";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface Category {
  id: string;
  name: string;
  image?: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [image, setImage] = useState("");
  const [newImage, setNewImage] = useState("");

  const fetch = async () => {
    try {
      const json = await categoriesService.getCategories();
      setCategories(json.data?.categories || json.data || []);
    } catch (err) {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch();
    };
    fetchData();
  }, []);

  const handleCreate = async () => {
    try {
      await categoriesService.createCategory({ name });
      setName("");
      toast.success("Category created");
      fetch();
    } catch (err) {
      toast.error("Failed to create category");
    }
  };

  const handleCreateFromModal = async () => {
    if (!newName.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      await categoriesService.createCategory({ name: newName.trim(), image: newImage?.trim() || undefined });
      setNewName("");
      setNewImage("");
      setAddOpen(false);
      toast.success("Category created");
      fetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create category");
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await categoriesService.updateCategory(id, { name, image: image || undefined });
      setName("");
      setEditing(null);
      toast.success("Category updated");
      fetch();
    } catch (err) {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoriesService.deleteCategory(id);
      toast.success("Category deleted");
      fetch();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const doDelete = async () => {
    if (!selectedDeleteId) return;
    setDeleting(true);
    try {
      await handleDelete(selectedDeleteId);
      setConfirmOpen(false);
      setSelectedDeleteId(null);
    } catch (e) {
      // errors handled in handleDelete
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage food categories shown to customers.</p>
        </div>

        <div>
          <button onClick={() => setAddOpen(true)} className="px-4 py-2 bg-amber-600 text-white rounded-lg">+ Add Category</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-4 bg-white rounded-lg p-4 border shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center overflow-hidden">
              {c.image ? (
                // plain img to avoid Next Image domain config during dev
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl text-amber-700">🍽️</div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium text-slate-800">{c.name}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditing(c.id); setName(c.name); setImage(c.image || ""); }} className="btn btn-sm">Edit</button>
                  <button onClick={() => { setSelectedDeleteId(c.id); setConfirmOpen(true); }} className="btn btn-sm btn-outline text-rose-600">Del</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {(addOpen || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg ring-1 ring-black/5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-2xl">🍽️</div>
                <div>
                  <h3 className="text-lg font-semibold">{editing ? 'Edit Category' : 'Add Category'}</h3>
                  <p className="text-sm text-muted-foreground">Add a category name and optional image URL to display to customers.</p>
                </div>
              </div>
              <button onClick={() => { setAddOpen(false); setEditing(null); setName(''); setNewName(''); setImage(''); setNewImage(''); }} className="text-sm text-slate-500">Close</button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 flex items-center justify-center">
                <div className="w-36 h-36 bg-amber-50 rounded-lg overflow-hidden flex items-center justify-center border border-dashed border-amber-100">
                  {(editing ? image : newImage) ? (
                    <img src={editing ? image : newImage} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-2xl text-amber-700">🍽️</div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">Name</label>
                  <input
                    value={editing ? name : newName}
                    onChange={(e) => editing ? setName(e.target.value) : setNewName(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    placeholder="e.g., Fast Food"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">Image URL (optional)</label>
                  <input
                    value={editing ? image : newImage}
                    onChange={(e) => editing ? setImage(e.target.value) : setNewImage(e.target.value)}
                    placeholder="https://...jpg"
                    className="w-full p-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => { setAddOpen(false); setEditing(null); setName(''); setNewName(''); setImage(''); setNewImage(''); }} className="btn bg-rose-600 text-white hover:bg-rose-700">Cancel</button>
                  {editing ? (
                    <button onClick={() => { if (editing) handleUpdate(editing); }} className="btn bg-emerald-600 text-white hover:bg-emerald-700">Save</button>
                  ) : (
                    <button onClick={handleCreateFromModal} className="btn bg-emerald-600 text-white hover:bg-emerald-700">Create</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => { setConfirmOpen(false); setSelectedDeleteId(null); }}
      />
    </div>
  );
}

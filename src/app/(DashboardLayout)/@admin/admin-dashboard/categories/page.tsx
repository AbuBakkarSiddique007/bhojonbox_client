"use client";

import { useEffect, useState } from "react";
import categoriesService from "../../../../../services/categories";
import { toast } from "sonner";

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
                  <button onClick={() => { if (confirm('Delete category?')) handleDelete(c.id); }} className="btn btn-sm btn-outline text-rose-600">Del</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {(addOpen || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editing ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => { setAddOpen(false); setEditing(null); setName(''); setNewName(''); }} className="text-sm text-slate-500">Close</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-600 block mb-1">Name</label>
                <input
                  value={editing ? name : newName}
                  onChange={(e) => editing ? setName(e.target.value) : setNewName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">Image URL (optional)</label>
                <input
                  value={editing ? image : newImage}
                  onChange={(e) => editing ? setImage(e.target.value) : setNewImage(e.target.value)}
                  placeholder="https://...jpg"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => { setAddOpen(false); setEditing(null); setName(''); setNewName(''); }} className="btn btn-ghost">Cancel</button>
                {editing ? (
                  <button onClick={() => { if (editing) handleUpdate(editing); }} className="btn btn-primary">Save</button>
                ) : (
                  <button onClick={handleCreateFromModal} className="btn btn-primary">Create</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

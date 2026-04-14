"use client";

import { useEffect, useState } from "react";
import categoriesService from "@/services/categories";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ImageUpload from "@/components/ui/ImageUpload";

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadCategories = async () => {
    try {
      const json = await categoriesService.getCategories();
      setCategories(json.data?.categories || json.data || []);
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const handleCreateFromModal = async () => {
    if (!newName.trim()) { toast.error("Name is required"); return; }
    try {
      await categoriesService.createCategory({ name: newName.trim(), image: newImage?.trim() || undefined });
      setNewName(""); setNewImage(""); setAddOpen(false);
      toast.success("Category created");
      loadCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create category");
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await categoriesService.updateCategory(id, { name, image: image || undefined });
      setName(""); setEditing(null);
      toast.success("Category updated");
      loadCategories();
    } catch {
      toast.error("Failed to update category");
    }
  };

  const doDelete = async () => {
    if (!selectedDeleteId) return;
    setDeleting(true);
    try {
      await categoriesService.deleteCategory(selectedDeleteId);
      toast.success("Category deleted");
      setConfirmOpen(false);
      setSelectedDeleteId(null);
      loadCategories();
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

  const closeModal = () => {
    setAddOpen(false); setEditing(null);
    setName(""); setNewName(""); setImage(""); setNewImage("");
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-8 md:mb-12 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter brand uppercase">Cuisine Registry</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium italic opacity-80">Manage the culinary categories displayed across the platform.</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="w-full md:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-center"
        >
          + Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="bg-card border-2 border-dashed border-border rounded-[2rem] p-20 text-center">
          <div className="text-5xl mb-4 opacity-20">🍽️</div>
          <p className="text-muted-foreground italic font-medium">No categories registered yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((c) => (
            <div key={c.id} className="group flex flex-col xs:flex-row items-stretch xs:items-center gap-4 bg-card rounded-2xl p-4 md:p-5 border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-2xl">🍽️</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-foreground brand truncate text-base">{c.name}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">Active Category</div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-3 xs:pt-0 border-t xs:border-t-0 border-border/50 xs:flex-shrink-0">
                <button
                  onClick={() => { setEditing(c.id); setName(c.name); setImage(c.image || ""); }}
                  className="flex-1 xs:flex-none px-4 py-2.5 rounded-xl bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all text-center"
                >
                  Edit
                </button>
                <button
                  onClick={() => { setSelectedDeleteId(c.id); setConfirmOpen(true); }}
                  className="flex-1 xs:flex-none px-4 py-2.5 rounded-xl bg-destructive/10 text-destructive text-[10px] font-black uppercase tracking-widest hover:bg-destructive hover:text-white transition-all text-center"
                >
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(addOpen || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-[2rem] w-full max-w-2xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-foreground brand uppercase tracking-tight">
                  {editing ? 'Edit Category' : 'Register Category'}
                </h3>
                <p className="text-sm text-muted-foreground italic mt-1">
                  {editing ? 'Update the details for this category.' : 'Add a new category for the culinary registry.'}
                </p>
              </div>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground transition-colors text-lg font-black">✕</button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Category Name</label>
                <input
                  value={editing ? name : newName}
                  onChange={(e) => editing ? setName(e.target.value) : setNewName(e.target.value)}
                  className="w-full px-5 py-4 rounded-[1.25rem] bg-muted/30 border border-border text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all font-semibold shadow-sm"
                  placeholder="e.g., Fast Food, Desserts"
                />
              </div>

              <div>
                <ImageUpload 
                  label="Category Image (Optional)"
                  value={editing ? image : newImage} 
                  onChange={(url) => editing ? setImage(url) : setNewImage(url)} 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                  <button onClick={closeModal} className="px-6 py-3 rounded-xl bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive transition-all">
                    Cancel
                  </button>
                  {editing ? (
                    <button onClick={() => { if (editing) handleUpdate(editing); }} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                      Save Changes
                    </button>
                  ) : (
                    <button onClick={handleCreateFromModal} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                      Add Category
                    </button>
                  )}
                </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Category"
        description="Are you sure you want to permanently remove this category from the registry? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => { setConfirmOpen(false); setSelectedDeleteId(null); }}
      />
    </div>
  );
}

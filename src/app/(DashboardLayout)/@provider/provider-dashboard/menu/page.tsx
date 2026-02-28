"use client";

import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config";
import Loading from "@/components/ui/Loading";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type Meal = { id: string; name: string; description?: string; price: number; isAvailable?: boolean; categoryId?: string };
type Category = { id: string; name: string };

export default function ProviderMenuPage() {
  const [meals, setMeals] = useState<Meal[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  // modal / form
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const fetchMeals = async () => {
    try {
      setErr(null);
      const res = await fetch(`${API_BASE_URL}/meals/provider/my-meals`, { credentials: 'include' });

      const json = await res.json();

      if (!res.ok) throw new Error(json?.message || 'Failed to fetch meals');
      setMeals(json?.data?.meals ?? []);
    } catch (e: unknown) {
      if (e instanceof Error) setErr(e.message);
      else setErr(String(e));
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      const json = await res.json();
      if (res.ok) setCategories(json?.data?.categories ?? []);
    } catch {
    }
  };

  
  useEffect(() => {
    if (categories.length && !categoryId) setCategoryId(categories[0].id);
  }, [categories, categoryId]);

  useEffect(() => {
    fetchMeals();
    fetchCategories();
  }, []);

  const openAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setName(""); setPrice(""); setDescription("");
    setCategoryId(categories[0]?.id ?? null);
    setIsAvailable(true);
    setModalOpen(true);
  };

  const openEdit = (m: Meal) => {
    setIsEditing(true);
    setEditingId(m.id);
    setName(m.name ?? "");
    setPrice(String(m.price ?? ""));
    setDescription(m.description ?? "");
    setCategoryId(m.categoryId ?? categories[0]?.id ?? null);
    setIsAvailable(m.isAvailable ?? true);
    setModalOpen(true);
  };

  const saveMeal = async () => {
    const trimmedName = name.trim();
    const trimmedPrice = price.trim();
    if (!trimmedName || !trimmedPrice || !categoryId) return toast.error('Name, price and category are required');
    const parsedPrice = parseFloat(trimmedPrice.replace(/,/g, ''));
    if (!isFinite(parsedPrice) || parsedPrice <= 0) return toast.error('Enter a valid price');
    try {
      setLoading(true);
      const payload = { name: trimmedName, price: parsedPrice, description, categoryId, isAvailable };
      const url = isEditing ? `${API_BASE_URL}/meals/${editingId}` : `${API_BASE_URL}/meals`;
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Failed to save meal');
      toast.success(isEditing ? 'Meal updated' : 'Meal created');
      setModalOpen(false);
      fetchMeals();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error(String(err));
    } finally { setLoading(false); }
  };

  const confirmDelete = (id: string) => {
    setSelectedDeleteId(id);
    setConfirmOpen(true);
  };

  const doDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/meals/${selectedDeleteId}`, { method: 'DELETE', credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Failed to delete');
      toast.success('Meal removed');
      setConfirmOpen(false);
      setSelectedDeleteId(null);
      fetchMeals();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error(String(err));
    } finally { setLoading(false); }
  };

  const toggleAvailability = async (m: Meal) => {
    try {
      const res = await fetch(`${API_BASE_URL}/meals/${m.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !m.isAvailable }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Failed');
      toast.success(m.isAvailable ? 'Marked unavailable' : 'Marked available');
      fetchMeals();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error(String(err));
    }
  };

  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;
  if (!meals) return <div className="p-6"><Loading /></div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Menu Management</h1>
          <p className="text-sm text-muted-foreground">Add, edit, and manage your meal listings.</p>
        </div>

        <div>
          <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-md">+ Add Meal</button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">My Menu</h2>
        <p className="text-sm text-muted-foreground">Add, edit, and manage your meal listings.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {meals.map((m) => (
          <div key={m.id} className={`rounded-xl overflow-hidden shadow-sm border ${m.isAvailable === false ? 'opacity-70' : ''}`}>
            <div className={`h-36 bg-amber-50 flex items-center justify-center ${m.isAvailable === false ? 'bg-slate-200' : ''}`}>
              <div className="text-5xl">🍽️</div>
            </div>
            <div className="p-4 bg-white border-t">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-lg">{m.name}</div>
                  <div className="text-xs uppercase text-slate-400">{categories.find(c => c.id === m.categoryId)?.name ?? ''}</div>
                </div>
                <div className="text-amber-600 font-semibold">৳ {m.price}</div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(m)} className="px-3 py-1 border rounded-md text-sm">Edit</button>
                  <button onClick={() => confirmDelete(m.id)} className="px-3 py-1 border rounded-md text-sm text-red-600">Delete</button>
                </div>

                <div>
                  {m.isAvailable === false ? (
                    <button onClick={() => toggleAvailability(m)} className="text-xs px-3 py-1 bg-green-50 text-green-700 rounded-md">Make available</button>
                  ) : (
                    <button onClick={() => toggleAvailability(m)} className="text-xs px-3 py-1 bg-amber-50 text-amber-700 rounded-md">Make unavailable</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg max-w-xl w-full p-6 mx-4">
            <h3 className="text-lg font-semibold">{isEditing ? 'Edit Meal' : 'Add Meal'}</h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={categoryId ?? ''} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-md" rows={3} />
              </div>
              <div className="flex items-center gap-3">
                <input id="avail" type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
                <label htmlFor="avail" className="text-sm">Available</label>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-3 py-1 rounded-md bg-gray-100" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="px-3 py-1 rounded-md bg-amber-600 text-white" onClick={saveMeal} disabled={loading}>{loading ? <Loading inline size="sm" label="Saving…" /> : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Meal"
        description="Are you sure you want to delete this meal? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep"
        loading={loading}
        onCancel={() => { setConfirmOpen(false); setSelectedDeleteId(null); }}
        onConfirm={doDelete}
      />
    </div>
  );
}

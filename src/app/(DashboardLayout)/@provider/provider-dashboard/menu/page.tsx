"use client";

import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config";
import Loading from "@/components/ui/Loading";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ImageUpload from "@/components/ui/ImageUpload";

type Meal = { id: string; name: string; description?: string; price: number; isAvailable?: boolean; categoryId?: string; image?: string };
type Category = { id: string; name: string };
type MealPayload = { name: string; price: number; description: string; categoryId: string | null; isAvailable: boolean; image?: string };

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
  const [imageUrl, setImageUrl] = useState("");
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
      const json = await res.json().catch(() => null);
      if (res.ok) {
        const cats = json?.data?.categories ?? [];
        setCategories(cats);
        return cats;
      }
      return [];
    } catch {
      return [];
    }
  };

  const openAdd = async () => {
    setIsEditing(false);
    setEditingId(null);
    setName(""); setPrice(""); setDescription("");
    const cats = categories.length ? categories : await fetchCategories();
    setCategoryId((cats[0]?.id) ?? null);
    setIsAvailable(true);
    setImageUrl("");
    setModalOpen(true);
  };

  useEffect(() => {
    fetchMeals();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = (m: Meal) => {
    setIsEditing(true);
    setEditingId(m.id);
    setName(m.name ?? "");
    setPrice(String(m.price ?? ""));
    setDescription(m.description ?? "");
    setCategoryId(m.categoryId ?? categories[0]?.id ?? null);
    setIsAvailable(m.isAvailable ?? true);
    setImageUrl(m.image ?? "");
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
      const payload: MealPayload = { name: trimmedName, price: parsedPrice, description, categoryId, isAvailable };
      if (imageUrl && imageUrl.trim()) payload.image = imageUrl.trim();
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

      
      try {
        if (selectedDeleteId) {
          const res2 = await fetch(`${API_BASE_URL}/meals/${selectedDeleteId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isAvailable: false }),
          });
          const j2 = await res2.json().catch(() => null);
          if (res2.ok) {
            toast.error('Could not delete — meal has related orders. It was marked unavailable instead.');
            setConfirmOpen(false);
            setSelectedDeleteId(null);
            fetchMeals();
            return;
          }
        }
      } catch (fallbackErr) {
        // ignore
      }

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

  function MealCard({ m }: { m: Meal }) {
    const [imgLoading, setImgLoading] = useState(!!m.image);
    const [imgError, setImgError] = useState(false);

    return (
      <div className={`group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${m.isAvailable === false ? 'opacity-60 grayscale-[0.5]' : ''}`}>
        <div className={`h-48 bg-muted/30 flex items-center justify-center overflow-hidden relative ${m.isAvailable === false ? 'bg-muted' : ''}`}>
          {m.image && !imgError ? (
            <>
              {imgLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-card/60 backdrop-blur-sm z-10 transition-all">
                  <Loading size="sm" />
                </div>
              )}
              <img
                src={m.image}
                alt={m.name ?? 'meal image'}
                className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setImgLoading(false)}
                onError={() => { setImgError(true); setImgLoading(false); }}
              />
            </>
          ) : (
            <div className="text-6xl opacity-20 filter grayscale group-hover:grayscale-0 transition-all">🍽️</div>
          )}
          
          <div className="absolute top-4 right-4 flex gap-2">
             <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleAvailability(m); }}
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg backdrop-blur-md transition-all active:scale-95 ${m.isAvailable === false ? 'bg-emerald-500 text-white' : 'bg-white/90 text-slate-900 border border-white/20 hover:bg-white'}`}
            >
              {m.isAvailable === false ? 'Enable' : 'Disable'}
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-xs font-black text-primary uppercase tracking-tighter mb-0.5">{categories.find(c => c.id === m.categoryId)?.name ?? 'Meal'}</div>
              <div className="font-bold text-lg text-card-foreground brand line-clamp-1">{m.name}</div>
            </div>
            <div className="text-xl font-black text-foreground">৳{m.price}</div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-6 h-10 italic">{m.description || "No description available."}</p>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => openEdit(m)} 
              className="flex-1 px-4 py-2.5 bg-secondary text-secondary-foreground border border-border rounded-xl font-bold text-xs hover:bg-muted transition-all active:scale-95"
            >
              Edit Details
            </button>
            <button 
              onClick={() => confirmDelete(m.id)} 
              className="px-4 py-2.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl font-bold text-xs hover:bg-destructive hover:text-destructive-foreground transition-all active:scale-95"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (err) return <div className="p-6 text-destructive">Error: {err}</div>;
  if (!meals) return <div className="p-6"><Loading /></div>;

  return (
    <div className="p-2 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Create and curate your signature culinary experiences.</p>
        </div>

        <button 
          onClick={openAdd} 
          className="group px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          <span>Add Meal</span>
        </button>
      </div>

      <div className="mb-8 p-6 rounded-3xl bg-card border border-border flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground brand">Current Menu</h2>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Showing all {meals.length} available dishes</p>
        </div>
        <div className="text-6xl opacity-10 select-none">🥗</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {meals.map((m) => (
          <MealCard key={m.id} m={m} />
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md transition-all" onClick={() => setModalOpen(false)} />
          <div className="relative bg-card border border-border rounded-[2rem] shadow-2xl max-w-xl w-full p-8 lg:p-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-foreground brand">{isEditing ? 'Edit Meal' : 'Add Meal'}</h3>
              <button onClick={() => setModalOpen(false)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">✕</button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Item Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-muted border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-muted-foreground/30" placeholder="e.g. Spiced Beef Biryani" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Price (৳)</label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    className="w-full px-4 py-3 rounded-xl bg-muted border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Category</label>
                <select value={categoryId ?? ''} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-muted border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none cursor-pointer">
                  <option value="">Select a category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-muted border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none" rows={3} placeholder="Tell us more about this dish..." />
              </div>

              <div className="w-full">
                <ImageUpload 
                  label="Display Image (Optional)"
                  value={imageUrl} 
                  onChange={setImageUrl} 
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-2xl border border-border/50">
                <input id="avail" type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="w-5 h-5 rounded-md border-primary text-primary focus:ring-primary/30 cursor-pointer" />
                <label htmlFor="avail" className="text-sm font-bold text-foreground cursor-pointer">Available for Ordering</label>
              </div>
            </div>

            <div className="mt-10 flex gap-3">
              <button className="flex-1 py-4 rounded-2xl bg-secondary text-secondary-foreground font-black text-xs uppercase tracking-widest hover:bg-muted transition-all active:scale-95" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="flex-[2] py-4 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" onClick={saveMeal} disabled={loading}>
                {loading ? <Loading inline size="sm" label="Saving…" /> : (isEditing ? 'Save Changes' : 'Add Meal')}
              </button>
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

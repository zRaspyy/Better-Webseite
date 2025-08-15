import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { ref, onValue, set, remove, update } from 'firebase/database';
import { Gift, Trash2, Edit, Plus } from 'lucide-react';

export default function CouponsTab() {
  const [coupons, setCoupons] = useState<{ [id: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({
    code: '',
    discount: 5,
    type: 'percentage',
    products: [],
    variants: [],
    maxUses: '',
    maxUsesPerCustomer: '',
    minCartPrice: '',
    startDate: '',
    expirationDate: '',
    allowedEmails: '',
    disableVolumeDiscount: false,
  });

  // Coupon-Code Hinzufügen
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState<number>(0);

  useEffect(() => {
    const couponsRef = ref(db, 'settings/coupons');
    const unsub = onValue(couponsRef, snap => {
      if (snap.exists()) {
        setCoupons(snap.val() || {});
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  // Ladeanzeige erst NACH den Hooks!
  if (loading) return (
    <div className="w-full flex flex-col items-center px-2">
      <div className="w-full max-w-[1100px] flex flex-col gap-8 items-center">
        <div className="w-full bg-[#23232a] rounded-2xl shadow-lg border border-[#444] p-8 flex flex-col gap-6">
          <div className="text-center text-gray-400 text-lg">Laden…</div>
        </div>
      </div>
    </div>
  );

  // Coupon speichern
  const handleSave = async () => {
    const id = editId || String(Date.now());
    await set(ref(db, `settings/coupons/${id}`), { ...form, id });
    setShowForm(false);
    setEditId(null);
    setForm({
      code: '',
      discount: 5,
      type: 'percentage',
      products: [],
      variants: [],
      maxUses: '',
      maxUsesPerCustomer: '',
      minCartPrice: '',
      startDate: '',
      expirationDate: '',
      allowedEmails: '',
      disableVolumeDiscount: false,
    });
  };

  // Coupon löschen
  const handleDelete = async (id: string) => {
    await remove(ref(db, `settings/coupons/${id}`));
  };

  // Coupon editieren
  const handleEdit = (coupon: any) => {
    setEditId(coupon.id);
    setForm({ ...coupon });
    setShowForm(true);
  };

  // Abgelaufene löschen
  const handleDeleteExpired = async () => {
    Object.values(coupons).forEach((c: any) => {
      if (c.expirationDate && new Date(c.expirationDate) < new Date()) {
        remove(ref(db, `settings/coupons/${c.id}`));
      }
    });
  };

  // Coupon erstellen
  const handleCreate = () => {
    setEditId(null);
    setForm({
      code: '',
      discount: 5,
      type: 'percentage',
      products: [],
      variants: [],
      maxUses: '',
      maxUsesPerCustomer: '',
      minCartPrice: '',
      startDate: '',
      expirationDate: '',
      allowedEmails: '',
      disableVolumeDiscount: false,
    });
    setShowForm(true);
  };

  // Coupon-Code Hinzufügen
  const handleAddCoupon = async () => {
    if (!newCouponCode || newCouponDiscount <= 0) return;
    await set(ref(db, `settings/coupons/${newCouponCode.toUpperCase()}`), { discount: newCouponDiscount });
    setNewCouponCode('');
    setNewCouponDiscount(0);
  };

  const handleDeleteCoupon = async (code: string) => {
    await remove(ref(db, `settings/coupons/${code}`));
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="bg-[#23232a] rounded-2xl shadow-lg border border-[#ff3c3c] p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <Gift className="w-6 h-6 text-[#ff3c3c]" />
          <span className="text-2xl font-bold text-white">Coupon Codes verwalten</span>
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          <input
            type="text"
            value={newCouponCode}
            onChange={e => setNewCouponCode(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#18181b] border border-[#444] text-white font-mono"
            placeholder="Coupon Code"
          />
          <input
            type="number"
            value={newCouponDiscount}
            onChange={e => setNewCouponDiscount(Number(e.target.value))}
            className="px-3 py-2 rounded-lg bg-[#18181b] border border-[#444] text-white font-mono w-24"
            placeholder="Rabatt (€)"
            min={1}
          />
          <button
            type="button"
            onClick={handleAddCoupon}
            className="rounded-lg bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] px-4 py-2 text-base font-bold text-white transition-all duration-300"
          >
            Hinzufügen
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] text-white font-bold shadow hover:bg-[#ff3c3c]/80 flex items-center gap-2"
            onClick={handleCreate}
          >
            <Plus className="w-5 h-5" />
            Coupon erstellen
          </button>
          <button
            className="px-5 py-2 rounded-lg border border-red-400 text-red-400 font-bold hover:bg-red-900/20 flex items-center gap-2"
            onClick={handleDeleteExpired}
          >
            <Trash2 className="w-5 h-5" />
            Abgelaufene löschen
          </button>
        </div>
        <div className="bg-[#18181b] rounded-xl border border-[#ff3c3c] shadow-lg p-4">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 font-bold">
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Code</th>
                <th className="py-2 px-4">Rabatt</th>
                <th className="py-2 px-4">Typ</th>
                <th className="py-2 px-4">Produkte</th>
                <th className="py-2 px-4">Gültig von</th>
                <th className="py-2 px-4">Gültig bis</th>
                <th className="py-2 px-4">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(coupons).length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-2 px-4 text-gray-400 text-center">Keine Coupons vorhanden.</td>
                </tr>
              ) : (
                Object.values(coupons).map((c: any) => (
                  <tr key={c.id} className="border-b border-[#23232a] text-white">
                    <td className="py-2 px-4">{c.id}</td>
                    <td className="py-2 px-4 font-mono">{c.code}</td>
                    <td className="py-2 px-4">{c.discount}{c.type === 'percentage' ? '%' : '€'}</td>
                    <td className="py-2 px-4">{c.type === 'percentage' ? 'Prozent' : 'Festbetrag'}</td>
                    <td className="py-2 px-4">{c.products?.length ? c.products.join(', ') : 'Alle Produkte'}</td>
                    <td className="py-2 px-4">{c.startDate || '-'}</td>
                    <td className="py-2 px-4">{c.expirationDate || '-'}</td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        className="text-blue-400 hover:underline flex items-center gap-1"
                        onClick={() => handleEdit(c)}
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button
                        className="text-red-400 hover:underline flex items-center gap-1"
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {loading && <div className="text-gray-400 mt-4">Laden…</div>}
        </div>
        {/* Coupon Formular */}
        {showForm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur">
            <div className="bg-[#18181b] border border-[#ff3c3c] rounded-2xl shadow-2xl p-8 w-full max-w-2xl flex flex-col items-center relative">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Gift className="w-6 h-6 text-[#ff3c3c]" />
                Coupon {editId ? 'bearbeiten' : 'erstellen'}
              </h3>
              <form className="w-full flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm text-gray-300 font-semibold">Coupon Code</label>
                    <input
                      type="text"
                      value={form.code}
                      onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                      className="px-3 py-2 rounded-lg bg-[#23232a] border border-[#ff3c3c] text-white font-mono"
                      placeholder="Code eingeben"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm text-gray-300 font-semibold">Typ</label>
                    <select
                      value={form.type}
                      onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                      className="px-3 py-2 rounded-lg bg-[#23232a] border border-[#ff3c3c] text-white"
                    >
                      <option value="percentage">Prozent</option>
                      <option value="fixed">Festbetrag</option>
                    </select>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm text-gray-300 font-semibold">Rabatt</label>
                    <input
                      type="number"
                      value={form.discount}
                      onChange={e => setForm(f => ({ ...f, discount: Number(e.target.value) }))}
                      className="px-3 py-2 rounded-lg bg-[#23232a] border border-[#ff3c3c] text-white"
                      min={0}
                      max={form.type === 'percentage' ? 100 : 9999}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm text-gray-300 font-semibold">Produkte</label>
                    <input
                      type="text"
                      value={form.products.join(', ')}
                      onChange={e => setForm(f => ({ ...f, products: e.target.value.split(',').map((s: string) => s.trim()) }))}
                      className="px-3 py-2 rounded-lg bg-[#23232a] border border-[#ff3c3c] text-white"
                      placeholder="Produkt-IDs, Komma getrennt"
                    />
                    <span className="text-xs text-gray-400">Leer lassen für alle Produkte</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm text-gray-300 font-semibold">Varianten</label>
                    <input
                      type="text"
                      value={form.variants.join(', ')}
                      onChange={e => setForm(f => ({ ...f, variants: e.target.value.split(',').map((s: string) => s.trim()) }))}
                      className="px-3 py-2 rounded-lg bg-[#23232a] border border-[#ff3c3c] text-white"
                      placeholder="Varianten, Komma getrennt"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm text-gray-300 font-semibold">Max. Nutzungen</label>
                    <input
                      type="number"
                      value={form.maxUses}
                      onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))}
                      className="px-3 py-2 rounded-lg bg-[#23232a] border border-[#ff3c3c] text-white"
                      placeholder="Leer für unbegrenzt"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm text-gray-300 font-semibold">Max. pro Kunde</label>
                    <input
                      type="number"
                      value={form.maxUsesPerCustomer}
                      onChange={e => setForm(f => ({ ...f, maxUsesPerCustomer: e.target.value }))}
                      className="px-3 py-2 rounded-lg bg-[#23232a] border border-[#ff3c3c] text-white"
                      placeholder="Leer für unbegrenzt"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm text-gray-300 font-semibold">Min. Warenkorb</label>
                    <input
                      type="number"
                      value={form.minCartPrice}
                      onChange={e => setForm(f => ({ ...f, minCartPrice: e.target.value }))}
                      className="px-3 py-2 rounded-lg bg-[#23232a] border border-[#ff3c3c] text-white"
                      placeholder="Leer für keinen Mindestwert"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm text-gray-300 font-semibold">Startdatum</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                      className="px-3 py-2 rounded-lg bg-[#23232a] border border-[#ff3c3c] text-white"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm text-gray-300 font-semibold">Ablaufdatum</label>
                    <input
                      type="date"
                      value={form.expirationDate}
                      onChange={e => setForm(f => ({ ...f, expirationDate: e.target.value }))}
                      className="px-3 py-2 rounded-lg bg-[#23232a] border border-[#ff3c3c] text-white"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm text-gray-300 font-semibold">Erlaubte E-Mails</label>
                    <input
                      type="text"
                      value={form.allowedEmails}
                      onChange={e => setForm(f => ({ ...f, allowedEmails: e.target.value }))}
                      className="px-3 py-2 rounded-lg bg-[#23232a] border border-[#ff3c3c] text-white"
                      placeholder="Komma getrennt"
                    />
                    <span className="text-xs text-gray-400">Leer lassen für alle</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm text-gray-300 font-semibold flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.disableVolumeDiscount}
                        onChange={e => setForm(f => ({ ...f, disableVolumeDiscount: e.target.checked }))}
                        className="mr-2"
                      />
                      Coupon deaktivieren bei Mengenrabatt
                    </label>
                  </div>
                </div>
                <div className="flex gap-4 mt-6 justify-end">
                  <button
                    type="button"
                    className="px-6 py-2 rounded-lg bg-[#23232a] text-gray-300 font-bold border border-[#ff3c3c] hover:bg-[#2d0101] transition"
                    onClick={() => {
                      setShowForm(false);
                      setEditId(null);
                    }}
                  >
                    Abbrechen
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] text-white font-bold shadow hover:bg-[#ff3c3c]/80"
                    onClick={handleSave}
                  >
                    Speichern
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

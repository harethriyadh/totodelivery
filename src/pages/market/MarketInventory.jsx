
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Search, Filter, Loader2, AlertCircle, AlertTriangle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import InventoryCard from '../../components/market/InventoryCard';
import AddItemModal from '../../components/market/AddItemModal';
import { InventoryCardSkeleton } from '../../components/shared/Skeletons';

const MarketInventory = () => {
    const { marketType } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState({ id: 'all', label: 'الكل' });
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionError, setActionError] = useState(null);

    // Category bar config per market type
    const CATEGORY_SHOW_TYPES = ['fruits_veg', 'groceries'];
    const showCategoryBar = CATEGORY_SHOW_TYPES.includes(marketType);

    const categoriesByType = {
        fruits_veg: [
            { id: 'all', label: 'الكل' },
            { id: 'fruits', label: 'فواكه' },
            { id: 'fresh_veg', label: 'خضروات' },
        ],
        groceries: [
            { id: 'all', label: 'الكل' },
            { id: 'canned', label: 'معلبات' },
            { id: 'dairy', label: 'ألبان' },
            { id: 'cleaning', label: 'منظفات' },
            { id: 'bakery', label: 'مخبوزات' },
        ],
    };

    const categories = categoriesByType[marketType] || [];

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            // Technical Spec: GET /products/category/:id
            // If 'all', we might need a general endpoint or fetch categories sequentially.
            // For now, let's assume 'all' fetches all products of the market.
            const bustUrl = `?t=${Date.now()}`;
            const endpoint = selectedCategory.id === 'all'
                ? `/products/market${bustUrl}` // Spec V1.0 compliance
                : `/products/category/${selectedCategory.id}${bustUrl}`;

            const response = await apiFetch(endpoint);
            const data = await response.json();

            if (response.ok) {
                // Map backend _id to frontend id per v4.3 spec
                const productArray = data.data || data.products || (Array.isArray(data) ? data : []);
                const processed = productArray.map(item => ({
                    ...item,
                    id: item._id || item.id,
                    isAvailable: item.inventory?.is_active ?? true // mapped key
                }));
                setItems(processed);
            } else {
                setError(data.message || 'فشل تحميل المنتجات');
            }
        } catch (err) {
            setError('خطأ في الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory]);

    const handleAddItem = (newItem) => {
        // Data handled via AddItemModal's internal save which we'll update to call API
        fetchProducts();
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleToggleAvailability = async (id) => {
        setActionError(null);
        try {
            // Technical Spec: PATCH /products/:id/toggle-active
            const response = await apiFetch(`/products/${id}/toggle-active`, {
                method: 'PATCH'
            });
            if (response.ok) {
                // Instantly re-fetch from backend to destroy 304 cached states
                await fetchProducts();
            } else {
                setActionError('عذراً، لا يمكن تغيير حالة المنتج حالياً.');
                setTimeout(() => setActionError(null), 5000);
            }
        } catch (err) {
            console.error('Toggle failed', err);
            setActionError('خطأ في الاتصال بالخادم.');
            setTimeout(() => setActionError(null), 5000);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        setActionError(null);
        try {
            const response = await apiFetch(`/products/${deleteConfirmId}`, { method: 'DELETE' });
            if (response.ok) {
                setDeleteConfirmId(null);
                // Instantly re-fetch from backend to wipe out 304 cache
                await fetchProducts();
            } else {
                const data = await response.json().catch(() => ({}));
                setActionError(data.message || 'فشل حذف المنتج من الخادم (تأكد من وجود مسار الحذف في الباك إند).');
                setTimeout(() => setActionError(null), 5000);
            }
        } catch (err) {
            console.error('Delete failed', err);
            setActionError('خطأ في الاتصال بالشبكة لحذف المنتج.');
            setTimeout(() => setActionError(null), 5000);
        }
        setDeleteConfirmId(null);
    };

    const openAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const filteredItems = items.filter(item => {
        const matchesDeleted = !item.inventory?.is_deleted;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDeleted && matchesSearch;
    });

    return (
        <div className="px-6 py-6 slide-up">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-neutral-900">إدارة المخزون</h2>
                <button
                    onClick={openAddModal}
                    className="btn-primary w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/20"
                >
                    <Plus className="w-5 h-5 text-white" strokeWidth={3} />
                </button>
            </div>

            {/* Inline Action Error Toast */}
            {actionError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-row-reverse items-start justify-between text-right animate-in fade-in slide-in-from-top-2 shadow-sm">
                    <div className="flex flex-row-reverse items-start gap-3 flex-1">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-700 font-bold leading-relaxed">{actionError}</p>
                    </div>
                    <button onClick={() => setActionError(null)} className="text-red-400 hover:text-red-600 transition-colors ml-2">
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Search Bar */}
            <div className="flex gap-3 mb-4 sticky top-0 z-20 bg-neutral-50 py-2 -mx-6 px-6">
                <div className="flex-1 relative">
                    <Search className="absolute right-3 top-3 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="ابحث عن منتج..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-neutral-100 rounded-xl pr-10 pl-4 py-2.5 text-sm font-bold text-neutral-700 outline-none focus:border-primary-300 transition-colors shadow-sm"
                    />
                </div>
            </div>

            {/* Filter Chips - conditional on market type */}
            {showCategoryBar && (
                <div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat)}
                            className={clsx(
                                "px-5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border shrink-0",
                                selectedCategory.id === cat.id
                                    ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20 scale-105"
                                    : "bg-white text-neutral-500 border-neutral-100 hover:border-primary-200"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-2 gap-3 mt-2">
                    {[1, 2, 3, 4, 5, 6].map((sk) => (
                        <InventoryCardSkeleton key={sk} />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100 p-6">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <p className="text-red-700 font-bold text-sm mb-4">{error}</p>
                    <button onClick={fetchProducts} className="text-red-600 text-xs font-black underline">إعادة المحاولة</button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        {filteredItems.map(item => (
                            <InventoryCard
                                key={item.id}
                                item={item}
                                onToggle={handleToggleAvailability}
                                onEdit={handleEdit}
                                onDelete={(id) => setDeleteConfirmId(id)}
                            />
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-6 h-6 text-neutral-300" />
                            </div>
                            <p className="text-sm font-bold text-neutral-400">لا توجد نتائج تطابق بحثك</p>
                        </div>
                    )}
                </>
            )}

            {isModalOpen && (
                <AddItemModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddItem}
                    itemToEdit={editingItem}
                />
            )}

            {/* Delete Confirmation Modal - Kept for UI but linked to logic */}
            {deleteConfirmId && createPortal(
                <div className="fixed inset-0 z-[10000] bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl animate-in zoom-in duration-200">
                        <h3 className="text-lg font-black text-neutral-900 mb-2 text-center">تأكيد الحذف</h3>
                        <p className="text-sm text-neutral-500 font-bold mb-6 text-center">هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 py-3 rounded-xl bg-neutral-50 text-neutral-600 font-black text-sm hover:bg-neutral-100 transition-colors"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black text-sm hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default MarketInventory;


import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import InventoryCard from '../../components/market/InventoryCard';
import AddItemModal from '../../components/market/AddItemModal';

const MarketInventory = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('الكل');
    const [items, setItems] = useState([
        { id: 1, name: 'طماطم بلدي', category: 'خضار', price: 5, unit: 'كجم', isAvailable: true, image: null },
        { id: 2, name: 'خيار طازج', category: 'خضار', price: 7, unit: 'كجم', isAvailable: true, image: null },
        { id: 3, name: 'بطاطس', category: 'خضار', price: 4, unit: 'كجم', isAvailable: false, image: null },
        { id: 4, name: 'تفاح أحمر', category: 'فواكه', price: 12, unit: 'كجم', isAvailable: true, image: null },
    ]);

    const categories = ['الكل', 'خضار', 'فواكه', 'لحوم', 'مخبوزات', 'مكياج'];

    const handleAddItem = (newItem) => {
        if (editingItem) {
            setItems(items.map(i => i.id === newItem.id ? newItem : i));
        } else {
            setItems([...items, newItem]);
        }
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleToggleAvailability = (id) => {
        setItems(items.map(item => item.id === id ? { ...item, isAvailable: !item.isAvailable } : item));
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        setItems(items.map(item =>
            item.id === deleteConfirmId ? { ...item, deleted_at: new Date().toISOString() } : item
        ));
        setDeleteConfirmId(null);
    };

    const openAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const filteredItems = items.filter(item => {
        const matchesDeleted = !item.deleted_at;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'الكل' || item.category === selectedCategory;
        return matchesDeleted && matchesSearch && matchesCategory;
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

            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={clsx(
                            "px-5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border shrink-0",
                            selectedCategory === cat
                                ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20 scale-105"
                                : "bg-white text-neutral-500 border-neutral-100 hover:border-primary-200"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

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

            {isModalOpen && (
                <AddItemModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddItem}
                    itemToEdit={editingItem}
                />
            )}

            {/* Delete Confirmation Modal */}
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

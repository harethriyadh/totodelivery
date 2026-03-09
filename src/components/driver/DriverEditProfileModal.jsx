import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Phone, Save, Loader2, CreditCard } from 'lucide-react';
import StatusModal from '../shared/StatusModal';
import { apiFetch } from '../../utils/api';

const DriverEditProfileModal = ({ isOpen, onClose, initialData, onSave }) => {
    const [formData, setFormData] = useState(initialData);
    const [alertConfig, setAlertConfig] = useState({ open: false, title: '', message: '', type: 'error' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen) setFormData(initialData);
    }, [isOpen, initialData]);

    const showAlert = (title, message, type = 'error') => {
        setAlertConfig({ open: true, title, message, type });
    };

    const handleSave = async () => {
        if (!formData.fullName?.trim()) {
            showAlert('خطأ في البيانات', 'يرجى إدخال الاسم الكامل للمتابعة.', 'error');
            return;
        }

        setSaving(true);
        try {
            const response = await apiFetch('/profile/driver', {
                method: 'PATCH',
                body: JSON.stringify({
                    full_name: formData.fullName,
                    iban: formData.iban
                })
            });

            if (response.ok) {
                const data = await response.json();
                onSave(data.data || {
                    full_name: formData.fullName,
                    phone: formData.phone,
                    iban: formData.iban
                });
                onClose();
            } else {
                const errData = await response.json().catch(() => ({}));
                showAlert('فشل الحفظ', errData.message || 'حدث خطأ أثناء حفظ البيانات.', 'error');
            }
        } catch (err) {
            showAlert('خطأ في الاتصال', 'يرجى التحقق من اتصالك بالإنترنت.', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <>
            <StatusModal
                isOpen={alertConfig.open}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={() => setAlertConfig(prev => ({ ...prev, open: false }))}
            />

            <div className="fixed inset-0 z-[10000] bg-neutral-900/60 backdrop-blur-[12px] flex items-center justify-center p-4 sm:p-6">
                <div className="bg-white w-full max-w-lg rounded-[40px] shadow-[0_32px_80px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col animate-in zoom-in duration-300 relative z-[10001] border border-white/20">

                    {/* Header */}
                    <div className="px-6 py-5 border-b border-neutral-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-20">
                        <h2 className="text-xl font-black text-neutral-900 leading-tight">المعلومات الشخصية</h2>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 hover:bg-neutral-100 transition-all hover:rotate-90 active:scale-90">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-6 py-8 space-y-6 flex-1 overflow-y-auto">
                        <div className="space-y-4">
                            <div className="space-y-1.5 text-right">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mr-1">الاسم الكامل</label>
                                <div className="relative group">
                                    <User className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors w-4 h-4" />
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-100 rounded-xl pr-12 pl-5 py-3.5 text-sm font-bold text-neutral-900 outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all text-right"
                                        dir="rtl"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 text-right">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mr-1">رقم الهاتف</label>
                                <div className="relative group">
                                    <Phone className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors w-4 h-4" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-100 rounded-xl pr-12 pl-5 py-3.5 text-sm font-bold text-neutral-900 outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all text-right"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 text-right">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mr-1">رقم الآيبان (IBAN)</label>
                                <div className="relative group">
                                    <CreditCard className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors w-4 h-4" />
                                    <input
                                        type="text"
                                        value={formData.iban || ''}
                                        onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-100 rounded-xl pr-12 pl-5 py-3.5 text-sm font-bold text-neutral-900 outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all text-right uppercase"
                                        placeholder="IQ..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-5 py-4 bg-white border-t border-neutral-100 flex items-center gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-[2] py-3.5 rounded-xl bg-primary-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 hover:bg-primary-600 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 py-3.5 rounded-xl bg-neutral-50 text-neutral-500 font-bold text-sm hover:bg-neutral-100 active:scale-[0.98] transition-all"
                        >
                            إلغاء
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default DriverEditProfileModal;

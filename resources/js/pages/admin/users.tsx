import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import {
    Users,
    Plus,
    Search,
    Edit3,
    Shield,
    GraduationCap,
    BookOpen,
    CheckCircle2,
    XCircle,
    X,
    Lock,
    Mail,
    Phone,
    KeyRound,
    Eye,
    EyeOff,
    Copy,
    Check,
    Sparkles,
} from 'lucide-react';

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: string;
    national_id?: string;
    phone?: string;
    is_active: boolean;
    created_at: string;
}

interface Props {
    users: {
        data: UserItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search: string;
        role: string;
    };
}

export default function AdminUsers({ users, filters }: Props) {
    const { t, locale, isRtl } = useTranslation();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [passwordUser, setPasswordUser] = useState<UserItem | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    const createForm = useForm({
        name: '',
        email: '',
        role: 'student',
        national_id: '',
        phone: '',
        password: '',
    });

    const editForm = useForm({
        name: '',
        email: '',
        role: 'student',
        national_id: '',
        phone: '',
        is_active: true,
        password: '',
    });

    const passwordForm = useForm({
        password: '',
        password_confirmation: '',
    });

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('admin.users'),
            { search: searchTerm, role: roleFilter },
            { preserveState: true }
        );
    };

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('admin.users.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const handleOpenEdit = (user: UserItem) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            role: user.role,
            national_id: user.national_id || '',
            phone: user.phone || '',
            is_active: user.is_active,
            password: '',
        });
        editForm.clearErrors();
    };

    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        editForm.put(route('admin.users.update', { user: editingUser.id }), {
            onSuccess: () => {
                setEditingUser(null);
                editForm.reset();
            },
        });
    };

    const handleOpenPasswordModal = (user: UserItem) => {
        setPasswordUser(user);
        passwordForm.setData({
            password: '',
            password_confirmation: '',
        });
        passwordForm.clearErrors();
        setShowPassword(false);
        setCopied(false);
    };

    const handleGenerateRandomPassword = () => {
        const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const lower = 'abcdefghjkmnpqrstuvwxyz';
        const nums = '23456789';
        const symbols = '!@#$%&*';

        let generated = '';
        generated += upper.charAt(Math.floor(Math.random() * upper.length));
        generated += lower.charAt(Math.floor(Math.random() * lower.length));
        generated += nums.charAt(Math.floor(Math.random() * nums.length));
        generated += symbols.charAt(Math.floor(Math.random() * symbols.length));

        const pool = upper + lower + nums + symbols;
        for (let i = 4; i < 12; i++) {
            generated += pool.charAt(Math.floor(Math.random() * pool.length));
        }

        const shuffled = generated.split('').sort(() => 0.5 - Math.random()).join('');
        passwordForm.setData({
            password: shuffled,
            password_confirmation: shuffled,
        });
        setShowPassword(true);
    };

    const handleCopyPassword = () => {
        if (!passwordForm.data.password) return;
        navigator.clipboard.writeText(passwordForm.data.password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordUser) return;

        passwordForm.put(route('admin.users.password', { user: passwordUser.id }), {
            onSuccess: () => {
                setPasswordUser(null);
                passwordForm.reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            title={locale === 'ar' ? 'إدارة المستخدمين والصلاحيات' : 'User Governance & Roles'}
            breadcrumb={locale === 'ar' ? 'المستخدمين' : 'User Directory'}
        >
            <Head title={locale === 'ar' ? 'إدارة المستخدمين - SUCED' : 'User Governance - SUCED'} />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-[#17365D]">
                            {t('user_management')}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            {locale === 'ar'
                                ? `إجمالي الحسابات المسجلة بالنظام: ${users.total} حساب.`
                                : `Total user accounts registered across all roles: ${users.total}.`}
                        </p>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#2563A6] hover:bg-[#17365D] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{locale === 'ar' ? 'إنشاء حساب جديد' : 'Create User'}</span>
                    </button>
                </div>

                {/* Filter and Search Bar */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3"
                >
                    <div className="flex items-center gap-2 flex-1 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 w-full">
                        <Search className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={locale === 'ar' ? 'بحث بالاسم، البريد، أو الرقم القومي...' : 'Search by name, email, or national ID...'}
                            className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-slate-800"
                        />
                    </div>

                    <select
                        value={roleFilter}
                        onChange={(e) => {
                            setRoleFilter(e.target.value);
                            router.get(
                                route('admin.users'),
                                { search: searchTerm, role: e.target.value },
                                { preserveState: true }
                            );
                        }}
                        className="w-full sm:w-44 text-xs sm:text-sm p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
                    >
                        <option value="all">{locale === 'ar' ? 'جميع الأدوار' : 'All Roles'}</option>
                        <option value="student">{locale === 'ar' ? 'الطلاب' : 'Students'}</option>
                        <option value="teacher">{locale === 'ar' ? 'هيئة التدريس' : 'Teachers'}</option>
                        <option value="admin">{locale === 'ar' ? 'الإدارة' : 'Administrators'}</option>
                    </select>

                    <button
                        type="submit"
                        className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-semibold transition-colors shrink-0"
                    >
                        {locale === 'ar' ? 'بحث' : 'Search'}
                    </button>
                </form>

                {/* Users Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">{locale === 'ar' ? 'الاسم والبريد' : 'Name & Email'}</th>
                                    <th className="py-3 px-4">{locale === 'ar' ? 'الدور والصلاحية' : 'Role'}</th>
                                    <th className="py-3 px-4">{locale === 'ar' ? 'الرقم القومي / الهاتف' : 'National ID / Phone'}</th>
                                    <th className="py-3 px-4">{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                                    <th className="py-3 px-4">{locale === 'ar' ? 'تاريخ التسجيل' : 'Registered'}</th>
                                    <th className="py-3 px-4 text-right">{locale === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.data.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="py-3.5 px-4">
                                            <div className="font-bold text-[#17365D]">
                                                {u.name}
                                            </div>
                                            <span className="text-xs text-slate-500">
                                                {u.email}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {u.role === 'admin' && (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#17365D] text-white">
                                                    Admin
                                                </span>
                                            )}
                                            {u.role === 'teacher' && (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#2563A6]">
                                                    Faculty
                                                </span>
                                            )}
                                            {u.role === 'student' && (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                                    Student
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 text-xs font-mono text-slate-600">
                                            <div>{u.national_id || '-'}</div>
                                            <div className="text-[11px] text-slate-400">{u.phone || ''}</div>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {u.is_active ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    <span>{locale === 'ar' ? 'نشط' : 'Active'}</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-bold">
                                                    <XCircle className="w-3 h-3" />
                                                    <span>{locale === 'ar' ? 'معطل' : 'Suspended'}</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 text-xs text-slate-500">
                                            {u.created_at}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => handleOpenPasswordModal(u)}
                                                    className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
                                                    title={locale === 'ar' ? 'تغيير كلمة المرور' : 'Change password'}
                                                >
                                                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenEdit(u)}
                                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                                    title={locale === 'ar' ? 'تعديل المستخدم' : 'Edit user'}
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Create User Modal */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 md:p-6 overflow-hidden">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
                            <div className="shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-white">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-[#2563A6] flex items-center justify-center shrink-0">
                                        <Users className="w-5 h-5 text-[#2563A6]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                                            {locale === 'ar' ? 'إنشاء حساب مستخدم جديد' : 'Create User Account'}
                                        </h3>
                                        <p className="text-[11px] text-slate-500">
                                            {locale === 'ar' ? 'أدخل بيانات المستخدم وصلاحيته' : 'Enter user credentials and system role'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateUser} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={createForm.data.name}
                                            onChange={(e) => createForm.setData('name', e.target.value)}
                                            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                        />
                                        {createForm.errors.name && <span className="text-xs text-red-600 mt-1 block">{createForm.errors.name}</span>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'البريد الإلكتروني الأكاديمي *' : 'Email Address *'}
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={createForm.data.email}
                                            onChange={(e) => createForm.setData('email', e.target.value)}
                                            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                        />
                                        {createForm.errors.email && <span className="text-xs text-red-600 mt-1 block">{createForm.errors.email}</span>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'الدور / الصلاحية *' : 'Role *'}
                                        </label>
                                        <select
                                            value={createForm.data.role}
                                            onChange={(e) => createForm.setData('role', e.target.value)}
                                            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                        >
                                            <option value="student">{locale === 'ar' ? 'طالب (Student)' : 'Student'}</option>
                                            <option value="teacher">{locale === 'ar' ? 'هيئة تدريس (Teacher)' : 'Teacher / Faculty'}</option>
                                            <option value="admin">{locale === 'ar' ? 'مسؤول نظام (Admin)' : 'Administrator'}</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                                {locale === 'ar' ? 'الرقم القومي' : 'National ID'}
                                            </label>
                                            <input
                                                type="text"
                                                value={createForm.data.national_id}
                                                onChange={(e) => createForm.setData('national_id', e.target.value)}
                                                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                                {locale === 'ar' ? 'رقم الهاتف' : 'Phone'}
                                            </label>
                                            <input
                                                type="text"
                                                value={createForm.data.phone}
                                                onChange={(e) => createForm.setData('phone', e.target.value)}
                                                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'كلمة المرور *' : 'Password *'}
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            minLength={8}
                                            value={createForm.data.password}
                                            onChange={(e) => createForm.setData('password', e.target.value)}
                                            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                            placeholder="Min 8 characters..."
                                        />
                                        {createForm.errors.password && <span className="text-xs text-red-600 mt-1 block">{createForm.errors.password}</span>}
                                    </div>
                                </div>

                                <div className="shrink-0 flex items-center justify-end gap-3 p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
                                    >
                                        {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createForm.processing}
                                        className="py-2.5 px-5 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        {createForm.processing
                                            ? (locale === 'ar' ? 'جاري الإنشاء...' : 'Creating...')
                                            : (locale === 'ar' ? 'حفظ الحساب' : 'Create User')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {editingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 md:p-6 overflow-hidden">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
                            <div className="shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-white">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-[#2563A6] flex items-center justify-center shrink-0">
                                        <Edit3 className="w-5 h-5 text-[#2563A6]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                                            {locale === 'ar' ? 'تعديل بيانات المستخدم' : 'Edit User Profile'}
                                        </h3>
                                        <p className="text-[11px] text-slate-500 truncate">
                                            {editingUser.name} • {editingUser.email}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateUser} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={editForm.data.name}
                                            onChange={(e) => editForm.setData('name', e.target.value)}
                                            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                        />
                                        {editForm.errors.name && <span className="text-xs text-red-600 mt-1 block">{editForm.errors.name}</span>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={editForm.data.email}
                                            onChange={(e) => editForm.setData('email', e.target.value)}
                                            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                        />
                                        {editForm.errors.email && <span className="text-xs text-red-600 mt-1 block">{editForm.errors.email}</span>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'الدور والصلاحية *' : 'Role *'}
                                        </label>
                                        <select
                                            value={editForm.data.role}
                                            onChange={(e) => editForm.setData('role', e.target.value)}
                                            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                        >
                                            <option value="student">{locale === 'ar' ? 'طالب (Student)' : 'Student'}</option>
                                            <option value="teacher">{locale === 'ar' ? 'هيئة تدريس (Teacher)' : 'Teacher / Faculty'}</option>
                                            <option value="admin">{locale === 'ar' ? 'مسؤول نظام (Admin)' : 'Administrator'}</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                                {locale === 'ar' ? 'الرقم القومي' : 'National ID'}
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.data.national_id}
                                                onChange={(e) => editForm.setData('national_id', e.target.value)}
                                                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                                {locale === 'ar' ? 'رقم الهاتف' : 'Phone'}
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.data.phone}
                                                onChange={(e) => editForm.setData('phone', e.target.value)}
                                                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                            />
                                        </div>
                                    </div>

                                    {/* Optional Password Edit inside Profile Editor */}
                                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-xs font-bold text-slate-700 uppercase">
                                                {locale === 'ar' ? 'تعديل كلمة المرور (اختياري)' : 'Change Password (Optional)'}
                                            </label>
                                            <span className="text-[10px] text-slate-400">
                                                {locale === 'ar' ? 'اتركه فارغاً للإبقاء على الحالية' : 'Leave blank to keep unchanged'}
                                            </span>
                                        </div>
                                        <input
                                            type="password"
                                            value={editForm.data.password}
                                            onChange={(e) => editForm.setData('password', e.target.value)}
                                            placeholder={locale === 'ar' ? 'أدخل كلمة مرور جديدة (8 أحرف فأكثر)...' : 'New password (min 8 chars)...'}
                                            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                        />
                                        {editForm.errors.password && <span className="text-xs text-red-600 block">{editForm.errors.password}</span>}
                                    </div>

                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            type="checkbox"
                                            id="edit_is_active"
                                            checked={editForm.data.is_active}
                                            onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                            className="w-4 h-4 text-[#2563A6] rounded"
                                        />
                                        <label htmlFor="edit_is_active" className="text-xs font-semibold text-slate-700 cursor-pointer">
                                            {locale === 'ar' ? 'الحساب نشط ويُسمح له بتسجيل الدخول' : 'Account active & permitted to log in'}
                                        </label>
                                    </div>
                                </div>

                                <div className="shrink-0 flex items-center justify-end gap-3 p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50">
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className="py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
                                    >
                                        {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="py-2.5 px-5 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        {editForm.processing
                                            ? (locale === 'ar' ? 'جاري التحديث...' : 'Updating...')
                                            : (locale === 'ar' ? 'حفظ التعديلات' : 'Update User')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Reset / Change User Password Modal */}
                {passwordUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 md:p-6 overflow-hidden">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
                            {/* Sticky Header */}
                            <div className="shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-white">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-[#D6A84F]/40 text-[#9E7317] flex items-center justify-center shrink-0">
                                        <KeyRound className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-extrabold text-[#17365D] text-sm sm:text-base truncate">
                                            {locale === 'ar' ? 'تغيير كلمة مرور المستخدم' : 'Change User Password'}
                                        </h3>
                                        <p className="text-[11px] text-slate-500 truncate">
                                            {passwordUser.name} ({passwordUser.email})
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setPasswordUser(null)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors shrink-0"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form & Scrollable Body */}
                            <form onSubmit={handleUpdatePassword} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
                                    {/* User Summary Pill */}
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                                        <div>
                                            <span className="font-bold text-[#17365D] block">{passwordUser.name}</span>
                                            <span className="text-[11px] text-slate-500">{passwordUser.email}</span>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-[#17365D]">
                                            {passwordUser.role}
                                        </span>
                                    </div>

                                    {/* Quick Strong Password Generator */}
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={handleGenerateRandomPassword}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all shadow-xs"
                                        >
                                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                            <span>{locale === 'ar' ? 'توليد كلمة مرور قوية تلقائياً' : 'Generate Strong Password'}</span>
                                        </button>

                                        {passwordForm.data.password && (
                                            <button
                                                type="button"
                                                onClick={handleCopyPassword}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-[#17365D] rounded-lg hover:bg-slate-100 transition-colors"
                                                title={locale === 'ar' ? 'نسخ كلمة المرور' : 'Copy password'}
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                        <span className="text-emerald-600 text-[11px]">{locale === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3.5 h-3.5" />
                                                        <span className="text-[11px]">{locale === 'ar' ? 'نسخ' : 'Copy'}</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'كلمة المرور الجديدة *' : 'New Password *'}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                minLength={8}
                                                value={passwordForm.data.password}
                                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                className="w-full text-xs sm:text-sm p-2.5 pe-10 rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                placeholder={locale === 'ar' ? '8 أحرف على الأقل...' : 'Min 8 characters...'}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 end-0 pe-3 flex items-center text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {passwordForm.errors.password && (
                                            <span className="text-xs text-red-600 mt-1 block">{passwordForm.errors.password}</span>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'تأكيد كلمة المرور الجديدة *' : 'Confirm New Password *'}
                                        </label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            minLength={8}
                                            value={passwordForm.data.password_confirmation}
                                            onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                            placeholder={locale === 'ar' ? 'أعد إدخال كلمة المرور للتأكيد...' : 'Re-enter to confirm...'}
                                        />
                                        {passwordForm.errors.password_confirmation && (
                                            <span className="text-xs text-red-600 mt-1 block">{passwordForm.errors.password_confirmation}</span>
                                        )}
                                    </div>

                                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900 leading-relaxed">
                                        {locale === 'ar'
                                            ? 'سيتم تحديث كلمة المرور فوراً وتشفيرها. يمكنك نسخ كلمة المرور وإرسالها للمستخدم لتسجيل الدخول.'
                                            : 'The password will be hashed and updated immediately. You can copy and share the new credentials with the user.'}
                                    </div>
                                </div>

                                {/* Sticky Footer */}
                                <div className="shrink-0 flex items-center justify-end gap-2.5 p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50">
                                    <button
                                        type="button"
                                        onClick={() => setPasswordUser(null)}
                                        className="py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
                                    >
                                        {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={passwordForm.processing}
                                        className="py-2.5 px-5 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                                    >
                                        <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                                        <span>
                                            {passwordForm.processing
                                                ? (locale === 'ar' ? 'جاري التحديث...' : 'Updating...')
                                                : (locale === 'ar' ? 'تحديث كلمة المرور' : 'Save Password')}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n';
import {
    BookOpen,
    GraduationCap,
    LayoutDashboard,
    Award,
    FileText,
    Users,
    Settings,
    LogOut,
    CheckCircle,
    AlertCircle,
    Bell,
    Globe,
    Menu,
    X,
    ArrowLeft,
    Shield,
    ChevronRight,
    Search,
    Video,
    BarChart3
} from 'lucide-react';

interface Props {
    children: React.ReactNode;
    title?: string;
    breadcrumb?: string;
}

export default function AuthenticatedLayout({ children, title, breadcrumb }: Props) {
    const { t, locale, isRtl } = useTranslation();
    const page = usePage();
    const { auth, flash, unread_notifications_count } = page.props as any;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleLanguage = () => {
        const next = locale === 'ar' ? 'en' : 'ar';
        window.location.href = route('language.switch', { locale: next });
    };

    // Define navigation items per role
    const getNavItems = () => {
        if (!user) return [];

        if (user.role === 'admin') {
            return [
                {
                    label: t('platform_overview'),
                    href: route('admin.dashboard'),
                    active: route().current('admin.dashboard'),
                    icon: LayoutDashboard,
                },
                {
                    label: t('governance_title'),
                    href: route('admin.courses'),
                    active: route().current('admin.courses*'),
                    icon: BookOpen,
                },
                {
                    label: t('user_management'),
                    href: route('admin.users'),
                    active: route().current('admin.users*'),
                    icon: Users,
                },
                {
                    label: t('certificates_issued_total'),
                    href: route('admin.certificates'),
                    active: route().current('admin.certificates*'),
                    icon: Award,
                },
            ];
        }

        if (user.role === 'teacher') {
            return [
                {
                    label: t('dashboard'),
                    href: route('teacher.dashboard'),
                    active: route().current('teacher.dashboard'),
                    icon: LayoutDashboard,
                },
                {
                    label: t('assigned_courses'),
                    href: route('teacher.courses'),
                    active: route().current('teacher.courses*'),
                    icon: BookOpen,
                },
                {
                    label: t('my_exams'),
                    href: route('teacher.exams'),
                    active: route().current('teacher.exams*'),
                    icon: FileText,
                },
                {
                    label: t('student_progress'),
                    href: route('teacher.student-progress'),
                    active: route().current('teacher.student-progress'),
                    icon: Users,
                },
                {
                    label: t('exam_results'),
                    href: route('teacher.exam-results'),
                    active: route().current('teacher.exam-results'),
                    icon: BarChart3,
                },
            ];
        }

        // Student Navigation
        return [
            {
                label: t('dashboard'),
                href: route('student.dashboard'),
                active: route().current('student.dashboard'),
                icon: LayoutDashboard,
            },
            {
                label: t('my_courses'),
                href: route('student.courses'),
                active: route().current('student.courses'),
                icon: BookOpen,
            },
            {
                label: t('courses_catalog'),
                href: route('courses.index'),
                active: route().current('courses.*'),
                icon: GraduationCap,
            },
            {
                label: t('my_exams'),
                href: route('student.exams'),
                active: route().current('student.exams*'),
                icon: FileText,
            },
            {
                label: t('my_certificates'),
                href: route('student.certificates'),
                active: route().current('student.certificates'),
                icon: Award,
            },
        ];
    };

    const navItems = getNavItems();

    const portalBadgeText = user?.role === 'admin' 
        ? t('admin_control_center') 
        : user?.role === 'teacher' 
        ? t('faculty_instructor_cockpit') 
        : t('student_portal');

    return (
        <div className="min-h-screen bg-[#F7F9FC] text-[#1E293B] flex">
            {/* Sidebar (Desktop Fixed) */}
            <aside
                className={`fixed top-0 bottom-0 z-50 w-72 bg-white border-r border-[#E2E8F0] shadow-[1px_0_10px_rgba(23,54,93,0.05)] flex flex-col justify-between py-6 px-4 transition-transform duration-200 ${
                    isRtl ? 'right-0 border-l border-r-0' : 'left-0 border-r'
                } ${sidebarOpen ? 'translate-x-0' : isRtl ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="flex flex-col gap-6">
                    {/* Brand */}
                    <div className="flex items-center justify-between px-2">
                        <Link href={route('home')} className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#17365D] text-white flex items-center justify-center font-bold text-lg shadow-sm border border-[#D6A84F]/40">
                                S
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg text-[#17365D] leading-tight">
                                    {t('suced')} Portal
                                </span>
                                <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
                                    {locale === 'ar' ? 'جامعة سوهاج' : 'Sohag University'}
                                </span>
                            </div>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1 text-[#64748B] hover:text-[#17365D]"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav Items Group */}
                    <div className="flex flex-col gap-1.5">
                        <span className="px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                            {locale === 'ar' ? 'مساحة العمل' : 'Workspace'}
                        </span>
                        <nav className="flex flex-col gap-1">
                            {navItems.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={idx}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                                            item.active
                                                ? 'bg-[#17365D] text-white shadow-sm'
                                                : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#17365D]'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Bottom Session Box */}
                <div className="flex flex-col gap-3 p-3.5 bg-[#F0F3FF] rounded-xl border border-[#D5E3FF]/60">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#17365D]">
                            {locale === 'ar' ? 'الفصل الدراسي' : 'Academic Session'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#D4E3FF] text-[#004883] text-[10px] font-bold">
                            2024/2025
                        </span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">
                        {portalBadgeText}
                    </p>
                    <Link
                        href={route('home')}
                        className="flex items-center gap-1.5 text-xs text-[#2060A3] hover:text-[#17365D] font-semibold transition-colors pt-1"
                    >
                        <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                        <span>{t('back_to_site')}</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
                />
            )}

            {/* Main Area */}
            <div className={`flex-1 flex flex-col min-h-screen ${isRtl ? 'lg:pr-72' : 'lg:pl-72'}`}>
                {/* Top Header */}
                <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-[0_1px_8px_rgba(23,54,93,0.04)] flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-[#64748B] hover:text-[#17365D] rounded-lg"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                            <span className="uppercase tracking-wider font-semibold hidden sm:inline">
                                {portalBadgeText}
                            </span>
                            {breadcrumb && (
                                <>
                                    <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                                    <span className="font-bold text-[#17365D] text-sm">{breadcrumb}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-3">
                        {/* Language switcher */}
                        <button
                            onClick={toggleLanguage}
                            className="px-2.5 py-1 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs font-bold text-[#17365D] transition-colors cursor-pointer flex items-center gap-1"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
                        </button>

                        {/* User Profile display */}
                        {user && (
                            <div className="flex items-center gap-2.5 pl-2 border-l border-[#E2E8F0]">
                                <div className="w-8 h-8 rounded-full bg-[#17365D] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                                    {user.name.substring(0, 2)}
                                </div>
                                <div className="hidden sm:flex flex-col text-start">
                                    <span className="font-semibold text-xs text-[#1E293B] leading-tight max-w-[130px] truncate">
                                        {user.name}
                                    </span>
                                    <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">
                                        {user.role}
                                    </span>
                                </div>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors cursor-pointer ml-1"
                                    title={t('logout')}
                                >
                                    <LogOut className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                </header>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-4">
                        <div className="flex items-center gap-2 p-3 bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC] rounded-xl text-sm font-semibold">
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            <span>{flash.success}</span>
                        </div>
                    </div>
                )}
                {flash?.error && (
                    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-4">
                        <div className="flex items-center gap-2 p-3 bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] rounded-xl text-sm font-semibold">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{flash.error}</span>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

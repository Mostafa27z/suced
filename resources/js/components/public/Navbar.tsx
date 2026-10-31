import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n';
import { BookOpen, CheckCircle, GraduationCap, LogIn, LogOut, User as UserIcon, Shield, Menu, X } from 'lucide-react';

export default function Navbar() {
    const { t, locale, isRtl } = useTranslation();
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const toggleLanguage = () => {
        const next = locale === 'ar' ? 'en' : 'ar';
        window.location.href = route('language.switch', { locale: next });
    };

    const getDashboardRoute = () => {
        if (!user) return route('login');
        if (user.role === 'admin') return route('admin.dashboard');
        if (user.role === 'teacher') return route('teacher.dashboard');
        return route('student.dashboard');
    };

    return (
        <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-[0_1px_8px_rgba(23,54,93,0.06)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                {/* Logo & Brand */}
                <Link href={route('home')} className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-[#17365D] text-white flex items-center justify-center font-bold text-xl shadow-md border border-[#D6A84F]/40">
                        S
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-xl text-[#17365D] tracking-tight leading-tight">
                            {t('suced')}
                        </span>
                        <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden sm:block">
                            {locale === 'ar' ? 'جامعة سوهاج — التعليم المستمر' : 'Sohag University Continuing Education'}
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-xl text-sm font-medium">
                    <Link
                        href={route('home')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            route().current('home')
                                ? 'bg-[#17365D] text-white shadow-sm font-semibold'
                                : 'text-[#64748B] hover:text-[#17365D] hover:bg-white/60'
                        }`}
                    >
                        {t('home')}
                    </Link>
                    <Link
                        href={route('courses.index')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            route().current('courses.*')
                                ? 'bg-[#17365D] text-white shadow-sm font-semibold'
                                : 'text-[#64748B] hover:text-[#17365D] hover:bg-white/60'
                        }`}
                    >
                        {t('courses')}
                    </Link>
                    <Link
                        href={route('verify.show')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            route().current('verify.*')
                                ? 'bg-[#17365D] text-white shadow-sm font-semibold'
                                : 'text-[#64748B] hover:text-[#17365D] hover:bg-white/60'
                        }`}
                    >
                        {t('verification')}
                    </Link>
                    {user && (
                        <Link
                            href={getDashboardRoute()}
                            className="px-4 py-2 rounded-lg text-[#2563A6] hover:bg-white/80 transition-colors font-semibold flex items-center gap-1.5"
                        >
                            <GraduationCap className="w-4 h-4" />
                            {user.role === 'admin' ? t('admin_portal') : user.role === 'teacher' ? t('teacher_portal') : t('student_portal')}
                        </Link>
                    )}
                </nav>

                {/* Right controls */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {/* Language Switcher */}
                    <button
                        onClick={toggleLanguage}
                        type="button"
                        className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#1E293B] text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                        title={locale === 'ar' ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
                    >
                        <span className="text-sm">🌐</span>
                        <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
                    </button>

                    {/* Auth Actions */}
                    {user ? (
                        <div className="flex items-center gap-2">
                            <Link
                                href={getDashboardRoute()}
                                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#F0F3FF] hover:bg-[#E2E8F0] transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#17365D] text-white flex items-center justify-center font-bold text-xs uppercase">
                                    {user.name.substring(0, 2)}
                                </div>
                                <span className="font-semibold text-xs text-[#17365D] hidden md:block max-w-[120px] truncate">
                                    {user.name}
                                </span>
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="p-2 text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors cursor-pointer"
                                title={t('logout')}
                            >
                                <LogOut className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href={route('login')}
                                className="px-3.5 py-2 text-xs font-semibold text-[#17365D] hover:text-[#2563A6] transition-colors"
                            >
                                {t('login')}
                            </Link>
                            <Link
                                href={route('register')}
                                className="px-4 py-2 rounded-lg bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                            >
                                <GraduationCap className="w-4 h-4" />
                                <span>{t('register')}</span>
                            </Link>
                        </div>
                    )}

                    {/* Mobile hamburger button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        type="button"
                        className="lg:hidden p-2 text-[#64748B] hover:text-[#17365D] rounded-lg cursor-pointer"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden px-4 pt-2 pb-4 bg-white border-b border-[#E2E8F0] space-y-1">
                    <Link
                        href={route('home')}
                        className="block px-3 py-2 rounded-lg text-sm font-medium text-[#1E293B] hover:bg-[#F1F5F9]"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {t('home')}
                    </Link>
                    <Link
                        href={route('courses.index')}
                        className="block px-3 py-2 rounded-lg text-sm font-medium text-[#1E293B] hover:bg-[#F1F5F9]"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {t('courses')}
                    </Link>
                    <Link
                        href={route('verify.show')}
                        className="block px-3 py-2 rounded-lg text-sm font-medium text-[#1E293B] hover:bg-[#F1F5F9]"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {t('verification')}
                    </Link>
                    {user ? (
                        <Link
                            href={getDashboardRoute()}
                            className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#2563A6] bg-[#F0F3FF]"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {user.role === 'admin' ? t('admin_portal') : user.role === 'teacher' ? t('teacher_portal') : t('student_portal')}
                        </Link>
                    ) : (
                        <div className="pt-2 flex flex-col gap-2">
                            <Link
                                href={route('login')}
                                className="block text-center py-2 text-sm font-medium text-[#17365D] border border-[#CBD5E1] rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('login')}
                            </Link>
                            <Link
                                href={route('register')}
                                className="block text-center py-2 text-sm font-bold text-white bg-[#17365D] rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('register')}
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}

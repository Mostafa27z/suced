import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n';
import {
    GraduationCap,
    ShieldCheck,
    Award,
    Globe,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Building2,
    BookOpen
} from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
    const { t, locale, isRtl } = useTranslation();

    const toggleLanguage = () => {
        const next = locale === 'ar' ? 'en' : 'ar';
        window.location.href = route('language.switch', { locale: next });
    };

    const ArrowBack = isRtl ? ArrowRight : ArrowLeft;

    return (
        <div className="min-h-screen w-full bg-[#F7F9FC] text-[#1E293B] flex flex-col lg:flex-row antialiased">
            {/* Visual Hero Panel (Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#17365D] text-white flex-col justify-between p-12 overflow-hidden border-e-4 border-[#D6A84F]">
                {/* Background Image with Academic Gradient Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 transform scale-105 transition-transform duration-1000"
                    style={{ backgroundImage: "url('/images/stitch/campus_architecture_hero.png')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#17365D] via-[#17365D]/85 to-[#122A48]/95 backdrop-blur-[2px]"></div>

                {/* Decorative Subtle Circles */}
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#D6A84F]/10 blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#2563A6]/20 blur-3xl pointer-events-none"></div>

                {/* Top Brand Header inside panel */}
                <div className="relative z-10 flex items-center justify-between">
                    <Link href={route('home')} className="flex items-center gap-3.5 group">
                        <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-[#D6A84F]/50 text-white flex items-center justify-center font-bold text-2xl shadow-lg group-hover:scale-105 transition-transform">
                            S
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-2xl text-white tracking-tight leading-none">
                                SUCED
                            </span>
                            <span className="text-xs font-semibold text-[#D6A84F] uppercase tracking-wider mt-1">
                                {locale === 'ar' ? 'جامعة سوهاج — التعليم المستمر' : 'Sohag University Continuing Education'}
                            </span>
                        </div>
                    </Link>

                    <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-amber-200 uppercase tracking-widest">
                        ISO 9001:2015
                    </div>
                </div>

                {/* Center Content: Academic Mission & Trust Badges */}
                <div className="relative z-10 my-auto py-12 max-w-lg space-y-8">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563A6]/40 border border-blue-300/20 text-xs font-semibold text-blue-200 backdrop-blur-sm">
                            <GraduationCap className="w-4 h-4 text-[#D6A84F]" />
                            <span>{locale === 'ar' ? 'منصة التعليم والتطوير الأكاديمي المعتمدة' : 'Official Academic Learning Portal'}</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                            {locale === 'ar' ? (
                                <>
                                    تعلم اليوم.. <br />
                                    <span className="text-[#D6A84F]">تقدّم غداً</span> بثقة واعتماد
                                </>
                            ) : (
                                <>
                                    Learn Today. <br />
                                    <span className="text-[#D6A84F]">Advance Tomorrow</span> with Trust
                                </>
                            )}
                        </h2>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            {locale === 'ar'
                                ? 'يقدم مركز التعليم المستمر وتطوير القدرات بجامعة سوهاج دبلومات مهنية متقدمة، ومقررات أكاديمية تحت إشراف نخبة من أساتذة الجامعة، مع شهادات رقمية موثقة ومعتمدة رسمياً.'
                                : 'SUCED provides accredited continuing education diplomas, academic video lecture modules, and verified credentials backed by Sohag University faculty.'}
                        </p>
                    </div>

                    {/* Trust Badges Trio */}
                    <div className="grid grid-cols-1 gap-3 pt-2">
                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/90">
                            <div className="w-8 h-8 rounded-lg bg-[#D6A84F]/20 text-[#D6A84F] flex items-center justify-center shrink-0">
                                <Building2 className="w-4 h-4" />
                            </div>
                            <div className="text-xs">
                                <span className="font-bold text-white block">{t('auth_trust_badge_1')}</span>
                                <span className="text-slate-300 text-[11px]">{locale === 'ar' ? 'إشراف أكاديمي مباشر وفق معايير المجلس الأعلى للجامعات' : 'Direct academic governance following supreme university bylaws'}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/90">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div className="text-xs">
                                <span className="font-bold text-white block">{t('auth_trust_badge_2')}</span>
                                <span className="text-slate-300 text-[11px]">{locale === 'ar' ? 'سجل رقمي محمي ضد التلاعب وقابل للفحص الفوري عبر الإنترنت' : 'Tamper-proof digital registry verifiable anywhere via QR code'}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/90">
                            <div className="w-8 h-8 rounded-lg bg-blue-400/20 text-blue-300 flex items-center justify-center shrink-0">
                                <Award className="w-4 h-4" />
                            </div>
                            <div className="text-xs">
                                <span className="font-bold text-white block">{t('auth_trust_badge_3')}</span>
                                <span className="text-slate-300 text-[11px]">{locale === 'ar' ? 'محاضرات مسجلة مرنة واختبارات مصححة إلكترونياً بأمان تام' : 'Structured lecture playlists and auto-graded online examinations'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer in Hero Panel */}
                <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>{t('all_rights_reserved')}</span>
                    <span className="font-mono text-[11px]">SUCED v1.0 • Sohag</span>
                </div>
            </div>

            {/* Form Column */}
            <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 relative overflow-y-auto">
                {/* Top Action Bar (Back to Home & Language Switcher) */}
                <div className="flex items-center justify-between w-full max-w-md mx-auto mb-8">
                    <Link
                        href={route('home')}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#17365D] transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-200/60"
                    >
                        <ArrowBack className="w-4 h-4" />
                        <span>{t('back_to_site')}</span>
                    </Link>

                    {/* Language Switcher */}
                    <button
                        onClick={toggleLanguage}
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[#17365D] hover:bg-slate-50 text-xs font-bold shadow-sm transition-all hover:border-[#D6A84F]"
                    >
                        <Globe className="w-3.5 h-3.5 text-[#2563A6]" />
                        <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
                    </button>
                </div>

                {/* Center Form Card */}
                <div className="w-full max-w-md mx-auto my-auto">
                    {/* Mobile Brand Header */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-6 text-center">
                        <Link href={route('home')} className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-[#17365D] text-white flex items-center justify-center font-bold text-lg shadow-sm border border-[#D6A84F]/40">
                                S
                            </div>
                            <div className="flex flex-col text-start">
                                <span className="font-extrabold text-lg text-[#17365D] leading-none">SUCED</span>
                                <span className="text-[10px] font-semibold text-[#64748B]">
                                    {locale === 'ar' ? 'جامعة سوهاج' : 'Sohag University'}
                                </span>
                            </div>
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-[0_8px_30px_rgba(23,54,93,0.06)] border border-[#E2E8F0]">
                        {/* Title and Description */}
                        <div className="mb-6 space-y-1.5 text-start">
                            <h1 className="text-2xl font-extrabold text-[#17365D] tracking-tight">
                                {title}
                            </h1>
                            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                                {description}
                            </p>
                        </div>

                        {/* Page Body */}
                        {children}
                    </div>
                </div>

                {/* Bottom Legal / Trust Notice */}
                <div className="w-full max-w-md mx-auto mt-8 text-center text-[11px] text-[#64748B]">
                    <span>
                        {locale === 'ar'
                            ? 'بوابة التعليم المستمر الرسمية — مركز التعليم المستمر وتطوير القدرات'
                            : 'Official Continuing Education Portal — Sohag University, Egypt'}
                    </span>
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n';
import { Award, BookOpen, CheckCircle, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

export default function Footer() {
    const { t, locale, isRtl } = useTranslation();

    return (
        <footer className="bg-[#111C2D] text-white pt-16 pb-10 border-t border-[#17365D]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-[#263143]">
                    {/* Brand column */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#2060A3] text-white flex items-center justify-center font-bold text-xl border border-[#D6A84F]/40">
                                S
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-2xl text-white tracking-tight">
                                    {t('suced')}
                                </span>
                                <span className="text-xs text-[#84A0CD] uppercase tracking-wider font-semibold">
                                    {t('under_auspices')}
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-[#C4C6CF] leading-relaxed max-w-md">
                            {t('footer_desc')}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#84A0CD]">
                            <span className="inline-flex items-center gap-1.5 bg-[#17365D] px-3 py-1 rounded-full text-white font-medium">
                                <ShieldCheck className="w-4 h-4 text-[#D6A84F]" />
                                {t('iso_standards')}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-[#84A0CD]" />
                                {t('location')}
                            </span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="lg:col-span-3 flex flex-col gap-3">
                        <span className="text-sm font-bold uppercase tracking-wider text-[#D6A84F]">
                            {locale === 'ar' ? 'روابط سريعة' : 'Quick Navigation'}
                        </span>
                        <ul className="space-y-2 text-sm text-[#C4C6CF]">
                            <li>
                                <Link href={route('home')} className="hover:text-white transition-colors">
                                    {t('home')}
                                </Link>
                            </li>
                            <li>
                                <Link href={route('courses.index')} className="hover:text-white transition-colors">
                                    {t('courses_catalog')}
                                </Link>
                            </li>
                            <li>
                                <Link href={route('verify.show')} className="hover:text-white transition-colors">
                                    {t('verification')}
                                </Link>
                            </li>
                            <li>
                                <Link href={route('login')} className="hover:text-white transition-colors">
                                    {t('student_portal')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Academic Governance */}
                    <div className="lg:col-span-4 flex flex-col gap-3">
                        <span className="text-sm font-bold uppercase tracking-wider text-[#D6A84F]">
                            {locale === 'ar' ? 'التواصل الأكاديمي والتحقق' : 'University Verification'}
                        </span>
                        <p className="text-sm text-[#C4C6CF] leading-relaxed">
                            {locale === 'ar'
                                ? 'يتم توثيق كافة الشهادات الصادرة عبر الأمانة العامة للتعليم المستمر بجامعة سوهاج برقم قيد دائم ورمز استجابة رقمي.'
                                : 'All certificates are registered with Sohag University continuing education registry with permanent verification hash and QR verification.'}
                        </p>
                        <div className="mt-2 p-3 bg-[#17365D]/60 rounded-xl border border-[#2060A3]/30 text-xs text-[#84A0CD]">
                            <span className="font-semibold text-white block mb-1">
                                {locale === 'ar' ? 'التحقق السريع للجهات وأصحاب الأعمال:' : 'Employer Verification Gateway:'}
                            </span>
                            <Link href={route('verify.show')} className="text-[#80B6FE] hover:underline font-mono">
                                /verify [Enter Certificate ID]
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#74777F]">
                    <div>
                        {t('all_rights_reserved')} {new Date().getFullYear()}
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="hover:text-[#C4C6CF] cursor-pointer">{t('privacy_policy')}</span>
                        <span>•</span>
                        <span className="hover:text-[#C4C6CF] cursor-pointer">{t('terms_service')}</span>
                        <span>•</span>
                        <span className="hover:text-[#C4C6CF] cursor-pointer">{t('accreditation_statement')}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

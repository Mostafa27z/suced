import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { useTranslation } from '@/lib/i18n';
import {
    Award,
    BookOpen,
    CheckCircle,
    ChevronRight,
    Clock,
    FileCheck,
    GraduationCap,
    Play,
    QrCode,
    Search,
    Shield,
    ShieldCheck,
    Star,
    TrendingUp,
    Users,
    Video
} from 'lucide-react';

interface CourseItem {
    id: number;
    slug: string;
    code: string;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    department: string;
    duration_weeks: number;
    duration_hours: number;
    thumbnail?: string;
    rating: number;
    reviews_count: number;
    lectures_count: number;
    lead_teacher?: {
        name: string;
        role_en: string;
        role_ar: string;
    };
}

interface Props {
    featuredCourses: CourseItem[];
    metrics: {
        published_courses: number;
        registered_students: number;
        completed_courses: number;
        certificates_issued: number;
    };
    selectedDepartment: string;
}

export default function Welcome({ featuredCourses, metrics, selectedDepartment }: Props) {
    const { t, locale, isRtl } = useTranslation();
    const [searchCertId, setSearchCertId] = useState('SUCED-2025-AI-8912');

    const handleDepartmentFilter = (dept: string) => {
        router.get(route('home'), { department: dept }, { preserveState: true, preserveScroll: true });
    };

    const handleVerifySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchCertId.trim()) {
            router.get(route('verify.show', { code: searchCertId.trim() }));
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F9FC] text-[#1E293B] flex flex-col">
            <Head title="SUCED — Sohag University Continuing Education Development" />

            <Navbar />

            <main className="w-full pt-20 flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* University Endorsement Trust Bar */}
                    <div className="w-full bg-[#F0F3FF] rounded-2xl px-5 py-3 mb-10 shadow-xs border border-[#D5E3FF]/60 flex flex-col md:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-2.5 w-2.5 rounded-full bg-[#F0BF64] ring-4 ring-[#FFDEA6]/40 animate-pulse" />
                            <span className="text-sm text-[#002043] font-bold tracking-wide flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-[#2060A3]" />
                                {t('under_auspices')}
                            </span>
                            <span className="hidden sm:inline text-[#C4C6CF]">•</span>
                            <span className="text-xs text-[#43474E] hidden sm:inline font-medium">
                                {t('center_title')}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium">
                            <span className="inline-flex items-center gap-1 bg-white text-[#2060A3] px-3 py-1 rounded-full shadow-2xs font-bold">
                                <Award className="w-3.5 h-3.5 text-[#D6A84F]" />
                                {t('iso_standards')}
                            </span>
                            <span className="text-[#43474E] flex items-center gap-1">
                                📍 {t('location')}
                            </span>
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
                        <div className="lg:col-span-7 flex flex-col items-start gap-5">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#E7EEFF] rounded-full text-xs font-bold text-[#2060A3] uppercase tracking-wider">
                                <Star className="w-3.5 h-3.5 text-[#D6A84F] fill-[#D6A84F]" />
                                <span>{t('hero_tag')}</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#002043] tracking-tight leading-[1.15]">
                                {t('hero_title_1')}
                                <span className="text-[#2060A3] block mt-1">{t('hero_title_2')}</span>
                            </h1>

                            <p className="text-base sm:text-lg text-[#43474E] max-w-xl leading-relaxed">
                                {t('hero_subtitle')}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Link
                                    href={route('courses.index')}
                                    className="px-6 py-3.5 rounded-xl bg-[#002043] hover:bg-[#2060A3] text-white font-bold text-sm sm:text-base transition-all duration-200 flex items-center gap-2 shadow-md shadow-[#17365D]/20 cursor-pointer"
                                >
                                    <span>{t('explore_courses')}</span>
                                    <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-6 py-3.5 rounded-xl bg-[#E7EEFF] hover:bg-[#D8E3FB] text-[#002043] font-bold text-sm sm:text-base transition-all duration-200 flex items-center gap-2 cursor-pointer"
                                >
                                    <GraduationCap className="w-4 h-4 text-[#2060A3]" />
                                    <span>{t('join_suced')}</span>
                                </Link>
                            </div>

                            <div className="flex items-center gap-2 pt-2 text-xs text-[#43474E] font-medium">
                                <CheckCircle className="w-4 h-4 text-[#16A34A]" />
                                <span>{t('hero_trust')}</span>
                            </div>
                        </div>

                        {/* Hero Image & Bento Composition */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden shadow-2xl bg-[#002043] border border-[#CBD5E1]">
                                <img
                                    src="/images/stitch/campus_architecture_hero.png"
                                    alt="Sohag University Campus Architecture"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#002043]/85 via-[#002043]/20 to-transparent" />

                                {/* Floating Academic Seal */}
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 border border-[#E2E8F0]">
                                    <div className="w-8 h-8 rounded-full bg-[#FFDEA6] flex items-center justify-center text-[#271900] font-bold">
                                        <Award className="w-4 h-4 text-[#D6A84F]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold uppercase tracking-wide text-[#002043]">
                                            {t('accredited_training')}
                                        </span>
                                        <span className="text-[9px] text-[#64748B]">
                                            {t('university_registry')}
                                        </span>
                                    </div>
                                </div>

                                {/* Bottom Verification Snapshot */}
                                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg flex items-center justify-between border border-[#E2E8F0]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-[#E7EEFF] flex items-center justify-center text-[#2060A3]">
                                            <QrCode className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] text-[#64748B]">
                                                {t('tamper_proof')}
                                            </span>
                                            <span className="text-xs sm:text-sm font-bold text-[#002043]">
                                                {t('national_id_linked')}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded bg-[#D4E3FF] text-[#001C39] text-[10px] font-extrabold uppercase">
                                        ACTIVE
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Metrics Cards */}
                    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
                        <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col gap-2 shadow-xs border border-[#E2E8F0] hover:-translate-y-1 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-[#002043] text-white flex items-center justify-center mb-1">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl sm:text-4xl font-extrabold text-[#002043]">
                                    {metrics.published_courses || 48}
                                </span>
                                <span className="text-xl font-bold text-[#2060A3]">+</span>
                            </div>
                            <span className="text-sm font-bold text-[#002043]">{t('available_courses')}</span>
                            <span className="text-xs text-[#64748B]">{t('available_courses_sub')}</span>
                        </div>

                        <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col gap-2 shadow-xs border border-[#E2E8F0] hover:-translate-y-1 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-[#2060A3] text-white flex items-center justify-center mb-1">
                                <Users className="w-5 h-5" />
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl sm:text-4xl font-extrabold text-[#002043]">
                                    {(metrics.registered_students || 12450).toLocaleString()}
                                </span>
                            </div>
                            <span className="text-sm font-bold text-[#002043]">{t('registered_learners')}</span>
                            <span className="text-xs text-[#64748B]">{t('registered_learners_sub')}</span>
                        </div>

                        <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col gap-2 shadow-xs border border-[#E2E8F0] hover:-translate-y-1 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-[#E7EEFF] text-[#002043] flex items-center justify-center mb-1">
                                <CheckCircle className="w-5 h-5 text-[#2060A3]" />
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl sm:text-4xl font-extrabold text-[#002043]">
                                    {(metrics.completed_courses || 8920).toLocaleString()}
                                </span>
                            </div>
                            <span className="text-sm font-bold text-[#002043]">{t('courses_completed')}</span>
                            <span className="text-xs text-[#64748B]">{t('courses_completed_sub')}</span>
                        </div>

                        <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col gap-2 shadow-xs border border-[#E2E8F0] hover:-translate-y-1 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-[#FFDEA6] text-[#271900] flex items-center justify-center mb-1">
                                <Award className="w-5 h-5 text-[#D6A84F]" />
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl sm:text-4xl font-extrabold text-[#002043]">
                                    {(metrics.certificates_issued || 7340).toLocaleString()}
                                </span>
                            </div>
                            <span className="text-sm font-bold text-[#002043]">{t('certificates_issued')}</span>
                            <span className="text-xs text-[#64748B]">{t('certificates_issued_sub')}</span>
                        </div>
                    </div>

                    {/* Featured Courses Section */}
                    <div className="w-full flex flex-col gap-6 mb-16" id="featured-courses">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <span className="text-xs font-bold text-[#2060A3] uppercase tracking-wider">
                                    {t('curated_curriculum')}
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-bold text-[#002043] tracking-tight mt-1">
                                    {t('featured_title')}
                                </h2>
                            </div>

                            {/* Department Filters */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                <span className="text-xs text-[#64748B] shrink-0 font-medium">
                                    {t('filter_department')}
                                </span>
                                <div className="inline-flex p-1 bg-[#F1F5F9] rounded-xl gap-1">
                                    {[
                                        { id: 'all', label: t('all_departments') },
                                        { id: 'technology', label: t('dept_tech') },
                                        { id: 'business', label: t('dept_biz') },
                                        { id: 'healthcare', label: t('dept_health') },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => handleDepartmentFilter(tab.id)}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                                selectedDepartment === tab.id
                                                    ? 'bg-[#002043] text-white shadow-xs'
                                                    : 'text-[#64748B] hover:text-[#002043]'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Course Cards Grid (12-column responsive) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredCourses.map((course) => {
                                const courseTitle = locale === 'ar' ? course.title_ar : course.title_en;
                                const courseDesc = locale === 'ar' ? course.description_ar : course.description_en;

                                return (
                                    <div
                                        key={course.id}
                                        className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-[#E2E8F0] group"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative h-44 w-full bg-[#002043] overflow-hidden">
                                            <img
                                                src={course.thumbnail || '/images/stitch/campus_architecture_hero.png'}
                                                alt={courseTitle}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <span className="absolute top-3 left-3 bg-[#002043]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                                {course.code}
                                            </span>
                                            <span className="absolute top-3 right-3 bg-white/95 text-[#002043] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                {t('bilingual')}
                                            </span>
                                        </div>

                                        {/* Body */}
                                        <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                                            <div>
                                                <div className="flex items-center justify-between text-[#64748B] text-xs mb-1.5">
                                                    <span className="flex items-center gap-1 font-medium">
                                                        <Clock className="w-3.5 h-3.5 text-[#2060A3]" />
                                                        {course.duration_weeks} {t('weeks')} ({course.duration_hours} {t('hours')})
                                                    </span>
                                                    <span className="flex items-center gap-1 text-[#D6A84F] font-bold">
                                                        <Star className="w-3.5 h-3.5 fill-[#D6A84F]" />
                                                        {course.rating.toFixed(1)}
                                                    </span>
                                                </div>

                                                <h3 className="text-base font-bold text-[#002043] line-clamp-2 leading-snug group-hover:text-[#2060A3] transition-colors">
                                                    {courseTitle}
                                                </h3>

                                                <p className="text-xs text-[#64748B] mt-1.5 line-clamp-2 leading-relaxed">
                                                    {courseDesc}
                                                </p>
                                            </div>

                                            {/* Footer row */}
                                            <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between mt-1">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-6 h-6 rounded-full bg-[#E7EEFF] text-[#002043] flex items-center justify-center font-bold text-[10px]">
                                                        {course.lead_teacher ? course.lead_teacher.name.substring(0, 2) : 'SU'}
                                                    </div>
                                                    <span className="text-xs font-semibold text-[#1E293B] max-w-[100px] truncate">
                                                        {course.lead_teacher?.name || 'Faculty Chair'}
                                                    </span>
                                                </div>

                                                <Link
                                                    href={route('courses.show', { course: course.slug })}
                                                    className="px-3.5 py-1.5 rounded-lg bg-[#002043] hover:bg-[#2060A3] text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                                                >
                                                    <span>{t('enroll_now')}</span>
                                                    <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* How It Works Section */}
                    <div className="w-full bg-[#F0F3FF] rounded-3xl p-6 sm:p-10 mb-16 border border-[#D5E3FF]/60">
                        <div className="text-center max-w-2xl mx-auto mb-10">
                            <span className="text-xs font-bold text-[#2060A3] uppercase tracking-wider">
                                {t('how_it_works_tag')}
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002043] tracking-tight mt-1">
                                {t('how_it_works_title')}
                            </h2>
                            <p className="text-sm text-[#43474E] mt-2">
                                {t('how_it_works_subtitle')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-xs border border-[#E2E8F0]">
                                <div className="flex items-center justify-between">
                                    <span className="w-8 h-8 rounded-full bg-[#002043] text-white flex items-center justify-center font-bold text-sm">
                                        1
                                    </span>
                                    <Users className="w-5 h-5 text-[#2060A3]" />
                                </div>
                                <h4 className="font-bold text-base text-[#002043]">{t('step1_title')}</h4>
                                <p className="text-xs text-[#64748B] leading-relaxed">{t('step1_desc')}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-xs border border-[#E2E8F0]">
                                <div className="flex items-center justify-between">
                                    <span className="w-8 h-8 rounded-full bg-[#2060A3] text-white flex items-center justify-center font-bold text-sm">
                                        2
                                    </span>
                                    <BookOpen className="w-5 h-5 text-[#2060A3]" />
                                </div>
                                <h4 className="font-bold text-base text-[#002043]">{t('step2_title')}</h4>
                                <p className="text-xs text-[#64748B] leading-relaxed">{t('step2_desc')}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-xs border border-[#E2E8F0]">
                                <div className="flex items-center justify-between">
                                    <span className="w-8 h-8 rounded-full bg-[#002043] text-white flex items-center justify-center font-bold text-sm">
                                        3
                                    </span>
                                    <Video className="w-5 h-5 text-[#2060A3]" />
                                </div>
                                <h4 className="font-bold text-base text-[#002043]">{t('step3_title')}</h4>
                                <p className="text-xs text-[#64748B] leading-relaxed">{t('step3_desc')}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-xs border border-[#E2E8F0]">
                                <div className="flex items-center justify-between">
                                    <span className="w-8 h-8 rounded-full bg-[#FFDEA6] text-[#271900] flex items-center justify-center font-bold text-sm">
                                        4
                                    </span>
                                    <Award className="w-5 h-5 text-[#D6A84F]" />
                                </div>
                                <h4 className="font-bold text-base text-[#002043]">{t('step4_title')}</h4>
                                <p className="text-xs text-[#64748B] leading-relaxed">{t('step4_desc')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Certificate & Credential Verification Section */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16" id="verification-section">
                        <div className="lg:col-span-6 flex flex-col gap-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E7EEFF] rounded-full text-xs font-bold text-[#2060A3] uppercase tracking-wider w-fit">
                                <ShieldCheck className="w-4 h-4 text-[#2060A3]" />
                                <span>{t('verification_tag')}</span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#002043] tracking-tight">
                                {t('verification_title')}
                            </h2>

                            <p className="text-sm sm:text-base text-[#43474E] leading-relaxed">
                                {t('verification_desc')}
                            </p>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-[#2060A3] shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-sm font-bold text-[#002043]">
                                            {t('feat1_title')}
                                        </strong>
                                        <p className="text-xs text-[#64748B] mt-0.5">{t('feat1_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-[#2060A3] shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-sm font-bold text-[#002043]">
                                            {t('feat2_title')}
                                        </strong>
                                        <p className="text-xs text-[#64748B] mt-0.5">{t('feat2_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-[#2060A3] shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-sm font-bold text-[#002043]">
                                            {t('feat3_title')}
                                        </strong>
                                        <p className="text-xs text-[#64748B] mt-0.5">{t('feat3_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Live Verification Search & Sample Certificate Card */}
                        <div className="lg:col-span-6 flex justify-center">
                            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-4 relative overflow-hidden border border-[#E2E8F0]">
                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D6A84F] via-[#2060A3] to-[#002043]" />

                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center gap-2">
                                        <Award className="w-5 h-5 text-[#2060A3]" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-[#002043]">
                                            {t('sample_title')}
                                        </span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] text-[10px] font-bold">
                                        SCORE: 100%
                                    </span>
                                </div>

                                {/* Simulated Certificate Face */}
                                <div className="bg-[#F8FAFC] rounded-2xl p-4 flex flex-col items-center text-center gap-2 border border-[#E2E8F0]">
                                    <span className="text-[10px] uppercase tracking-widest text-[#64748B] font-semibold">
                                        {t('under_auspices')}
                                    </span>
                                    <h4 className="font-bold text-base text-[#002043]">
                                        Certificate of Professional Achievement
                                    </h4>
                                    <p className="text-xs text-[#64748B]">
                                        Conferred for completion in Artificial Intelligence Foundations
                                    </p>

                                    {/* Simulated QR Pattern */}
                                    <div className="p-3 bg-white rounded-xl shadow-xs my-2 flex flex-col items-center border border-[#E2E8F0]">
                                        <div className="w-24 h-24 bg-[#002043] rounded-lg p-2 flex items-center justify-center text-white">
                                            <QrCode className="w-16 h-16 text-[#FFDEA6]" />
                                        </div>
                                        <span className="text-[10px] font-mono text-[#002043] font-bold mt-1.5">
                                            SUCED-2025-AI-8912
                                        </span>
                                    </div>

                                    <div className="w-full flex items-center justify-between text-[11px] text-[#64748B] pt-1">
                                        <span>Issue Date: Jan 2025</span>
                                        <span>Signee: Dean of Faculty</span>
                                    </div>
                                </div>

                                {/* Verification Search Bar */}
                                <form onSubmit={handleVerifySubmit} className="flex items-center gap-2 mt-1">
                                    <div className="relative flex-1">
                                        <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={searchCertId}
                                            onChange={(e) => setSearchCertId(e.target.value)}
                                            placeholder={t('enter_cert_id')}
                                            className="w-full bg-[#F0F3FF] text-[#002043] pl-9 pr-3 py-2 rounded-xl text-xs font-mono font-medium outline-none border border-[#CBD5E1] focus:border-[#2060A3]"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[#002043] hover:bg-[#2060A3] text-white rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                                    >
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        <span>{t('check_btn')}</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

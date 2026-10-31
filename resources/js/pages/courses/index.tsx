import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { useTranslation } from '@/lib/i18n';
import { BookOpen, ChevronRight, Clock, Search, Star, Users } from 'lucide-react';

interface Props {
    courses: {
        data: any[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search: string;
        department: string;
    };
}

export default function CourseCatalog({ courses, filters }: Props) {
    const { t, locale, isRtl } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [department, setDepartment] = useState(filters.department || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('courses.index'), { search, department }, { preserveState: true });
    };

    const handleDeptChange = (dept: string) => {
        setDepartment(dept);
        router.get(route('courses.index'), { search, department: dept }, { preserveState: true });
    };

    return (
        <div className="min-h-screen bg-[#F7F9FC] text-[#1E293B] flex flex-col">
            <Head title={t('courses_catalog') + ' — SUCED'} />
            <Navbar />

            <main className="w-full pt-20 flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* Header */}
                    <div className="flex flex-col gap-2 mb-8">
                        <span className="text-xs font-bold text-[#2060A3] uppercase tracking-wider">
                            {locale === 'ar' ? 'البرامج الأكاديمية والمهنية' : 'Academic & Professional Programs'}
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#002043] tracking-tight">
                            {t('courses_catalog')}
                        </h1>
                        <p className="text-sm text-[#64748B] max-w-2xl">
                            {locale === 'ar'
                                ? 'استكشف الدبلومات والمسارات التخصصية المعتمدة من جامعة سوهاج وابدأ رحلتك نحو التميز المهني.'
                                : 'Explore accredited diplomas and career tracks verified by Sohag University faculty.'}
                        </p>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                        {/* Search form */}
                        <form onSubmit={handleSearch} className="relative w-full md:w-96">
                            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={locale === 'ar' ? 'ابحث باسم المقرر، الرمز...' : 'Search courses by title, code...'}
                                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:outline-none focus:border-[#2060A3]"
                            />
                        </form>

                        {/* Department buttons */}
                        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                            {[
                                { id: 'all', label: t('all_departments') },
                                { id: 'technology', label: t('dept_tech') },
                                { id: 'business', label: t('dept_biz') },
                                { id: 'healthcare', label: t('dept_health') },
                                { id: 'management', label: t('dept_mgmt') },
                            ].map((dept) => (
                                <button
                                    key={dept.id}
                                    type="button"
                                    onClick={() => handleDeptChange(dept.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                        department === dept.id
                                            ? 'bg-[#002043] text-white shadow-2xs'
                                            : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#002043]'
                                    }`}
                                >
                                    {dept.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Courses Grid */}
                    {courses.data.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-[#E2E8F0] p-8">
                            <BookOpen className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-[#002043]">
                                {locale === 'ar' ? 'لا توجد مقررات مطابقة للبحث' : 'No courses matching your criteria'}
                            </h3>
                            <p className="text-xs text-[#64748B] mt-1">
                                {locale === 'ar' ? 'جرب البحث بكلمات أخرى أو اختر تخصصاً مختلفاً.' : 'Try adjusting your search query or department filter.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.data.map((course) => {
                                const courseTitle = locale === 'ar' ? course.title_ar : course.title_en;
                                const courseDesc = locale === 'ar' ? course.description_ar : course.description_en;
                                const leadTeacher = course.teachers?.[0]?.name;

                                return (
                                    <div
                                        key={course.id}
                                        className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#E2E8F0] group"
                                    >
                                        <div className="relative h-48 w-full bg-[#002043] overflow-hidden">
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

                                        <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                                            <div>
                                                <div className="flex items-center justify-between text-xs text-[#64748B] mb-2">
                                                    <span className="flex items-center gap-1 font-medium">
                                                        <Clock className="w-3.5 h-3.5 text-[#2060A3]" />
                                                        {course.duration_weeks} {t('weeks')} ({course.duration_hours} {t('hours')})
                                                    </span>
                                                    <span className="flex items-center gap-1 text-[#D6A84F] font-bold">
                                                        <Star className="w-3.5 h-3.5 fill-[#D6A84F]" />
                                                        {Number(course.rating || 4.9).toFixed(1)}
                                                    </span>
                                                </div>

                                                <h3 className="text-base font-bold text-[#002043] line-clamp-2 leading-snug group-hover:text-[#2060A3] transition-colors">
                                                    {courseTitle}
                                                </h3>

                                                <p className="text-xs text-[#64748B] mt-1.5 line-clamp-2 leading-relaxed">
                                                    {courseDesc}
                                                </p>
                                            </div>

                                            <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-6 h-6 rounded-full bg-[#E7EEFF] text-[#002043] flex items-center justify-center font-bold text-[10px]">
                                                        {leadTeacher ? leadTeacher.substring(0, 2) : 'SU'}
                                                    </div>
                                                    <span className="text-xs font-semibold text-[#1E293B] max-w-[120px] truncate">
                                                        {leadTeacher || 'Faculty Chair'}
                                                    </span>
                                                </div>

                                                <Link
                                                    href={route('courses.show', { course: course.slug })}
                                                    className="px-3.5 py-1.5 rounded-lg bg-[#002043] hover:bg-[#2060A3] text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                                                >
                                                    <span>{locale === 'ar' ? 'تفاصيل المقرر' : 'Course Details'}</span>
                                                    <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {courses.links && courses.links.length > 3 && (
                        <div className="flex items-center justify-center gap-1.5 mt-10">
                            {courses.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        link.active
                                            ? 'bg-[#002043] text-white shadow-2xs'
                                            : link.url
                                            ? 'bg-white border border-[#CBD5E1] text-[#1E293B] hover:bg-[#F1F5F9]'
                                            : 'text-[#94A3B8] cursor-not-allowed'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

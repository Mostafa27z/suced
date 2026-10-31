import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import {
    BookOpen,
    Video,
    FileText,
    Users,
    Clock,
    Plus,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';

interface CourseItem {
    id: number;
    slug: string;
    code: string;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    thumbnail: string;
    duration_hours: number;
    is_published: boolean;
    students_count: number;
    lectures_count: number;
    exams_count: number;
}

interface Props {
    courses: {
        data: CourseItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function TeacherCourses({ courses }: Props) {
    const { t, locale, isRtl } = useTranslation();

    return (
        <AuthenticatedLayout
            title={locale === 'ar' ? 'المقررات المكلف بها' : 'My Teaching Courses'}
            breadcrumb={locale === 'ar' ? 'إدارة المقررات' : 'Courses'}
        >
            <Head title={locale === 'ar' ? 'المقررات المكلف بها - SUCED' : 'Teaching Courses - SUCED'} />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-[#17365D]">
                            {locale === 'ar' ? 'المقررات الدراسية الخاضعة لإشرافك' : 'Assigned Academic Courses'}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            {locale === 'ar'
                                ? `لديك ${courses.total} مقرر خاضع لإشرافك الأكاديمي المباشر.`
                                : `You are assigned to oversee ${courses.total} academic courses.`}
                        </p>
                    </div>
                </div>

                {/* Courses Grid */}
                {courses.data.length === 0 ? (
                    <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="font-bold text-slate-800 text-base">
                            {locale === 'ar' ? 'لا توجد مقررات مكلف بها حالياً' : 'No Assigned Courses'}
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            {locale === 'ar'
                                ? 'سيقوم مسؤول النظام بتكليفك بالمقررات المناسبة لتتمكن من إضافة المحاضرات والاختبارات.'
                                : 'The system administrator will assign you courses to manage content and assessments.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.data.map((c) => (
                            <div
                                key={c.id}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
                            >
                                <div>
                                    <div className="relative h-44 bg-slate-900 overflow-hidden">
                                        <img
                                            src={c.thumbnail || '/images/stitch/campus_architecture_hero.png'}
                                            alt={c.title_en}
                                            className="w-full h-full object-cover"
                                        />
                                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#17365D]/90 backdrop-blur-sm text-white text-xs font-mono font-bold">
                                            {c.code}
                                        </span>
                                        <span
                                            className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm ${
                                                c.is_published
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-amber-500 text-white'
                                            }`}
                                        >
                                            {c.is_published
                                                ? (locale === 'ar' ? 'منشور' : 'Published')
                                                : (locale === 'ar' ? 'مسودة' : 'Draft')}
                                        </span>
                                    </div>

                                    <div className="p-5 space-y-3">
                                        <h3 className="font-bold text-[#17365D] text-base line-clamp-1">
                                            {locale === 'ar' ? c.title_ar : c.title_en}
                                        </h3>

                                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                            {locale === 'ar' ? c.description_ar : c.description_en}
                                        </p>

                                        <div className="grid grid-cols-3 gap-2 text-center text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                            <div>
                                                <span className="text-slate-400 block text-[10px]">{locale === 'ar' ? 'المحاضرات' : 'Lectures'}</span>
                                                <strong className="text-slate-800">{c.lectures_count}</strong>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block text-[10px]">{locale === 'ar' ? 'الاختبارات' : 'Exams'}</span>
                                                <strong className="text-slate-800">{c.exams_count}</strong>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block text-[10px]">{locale === 'ar' ? 'الطلاب' : 'Students'}</span>
                                                <strong className="text-blue-700">{c.students_count}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 pt-0 border-t border-slate-100 flex flex-col gap-2">
                                    <Link
                                        href={route('teacher.courses.lectures', { course: c.id })}
                                        className="w-full py-2 px-3 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                        <Video className="w-3.5 h-3.5" />
                                        <span>{locale === 'ar' ? 'إدارة محاضرات الفيديو' : 'Manage Lectures'}</span>
                                    </Link>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link
                                            href={route('teacher.exams')}
                                            className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                                        >
                                            <FileText className="w-3.5 h-3.5 text-amber-600" />
                                            <span>{locale === 'ar' ? 'الاختبارات' : 'Exams'}</span>
                                        </Link>
                                        <Link
                                            href={route('teacher.student-progress')}
                                            className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                                        >
                                            <Users className="w-3.5 h-3.5 text-[#2563A6]" />
                                            <span>{locale === 'ar' ? 'تقدم الطلاب' : 'Progress'}</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

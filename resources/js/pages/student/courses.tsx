import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import {
    BookOpen,
    Play,
    CheckCircle2,
    Clock,
    User,
    GraduationCap,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';

interface EnrollmentItem {
    id: number;
    course_id: number;
    status: string;
    enrolled_at: string;
    completed_at?: string;
    course: {
        id: number;
        slug: string;
        code: string;
        title_en: string;
        title_ar: string;
        description_en: string;
        description_ar: string;
        thumbnail: string;
        duration_hours: number;
        lectures: Array<{ id: number; position: number }>;
        teachers: Array<{ id: number; name: string }>;
    };
}

interface Props {
    enrollments: {
        data: EnrollmentItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function StudentCourses({ enrollments }: Props) {
    const { t, locale, isRtl } = useTranslation();
    const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

    return (
        <AuthenticatedLayout
            title={locale === 'ar' ? 'مقرراتي الدراسية' : 'My Courses'}
            breadcrumb={locale === 'ar' ? 'الدورات المسجلة' : 'Enrolled Programs'}
        >
            <Head title={locale === 'ar' ? 'مقرراتي الدراسية - SUCED' : 'My Courses - SUCED'} />

            <div className="space-y-6">
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-[#17365D]">
                            {locale === 'ar' ? 'المقررات والدورات المسجلة' : 'My Enrolled Courses'}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            {locale === 'ar'
                                ? `أنت مسجل حالياً في ${enrollments.total} دورة تدريبية معتمدة.`
                                : `You are actively enrolled in ${enrollments.total} continuing education modules.`}
                        </p>
                    </div>

                    <Link
                        href={route('courses.index')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-semibold transition-colors shadow-sm shrink-0"
                    >
                        <GraduationCap className="w-4 h-4" />
                        <span>{t('explore_courses')}</span>
                    </Link>
                </div>

                {/* Course Grid */}
                {enrollments.data.length === 0 ? (
                    <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="font-bold text-slate-800 text-base">
                            {locale === 'ar' ? 'لم تسجل في أي دورة تدريبية حتى الآن' : 'No Enrolled Courses'}
                        </h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                            {locale === 'ar'
                                ? 'تصفح قائمة الدورات المتاحة واختر ما يناسب مسارك المهني والأكاديمي.'
                                : 'Explore the published course catalog and enroll in modules that fit your professional path.'}
                        </p>
                        <Link
                            href={route('courses.index')}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563A6] hover:bg-[#17365D] text-white text-xs font-semibold transition-colors shadow-md"
                        >
                            <GraduationCap className="w-4 h-4" />
                            <span>{t('courses_catalog')}</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrollments.data.map((enr) => {
                            const c = enr.course;
                            const isCompleted = enr.status === 'completed';

                            return (
                                <div
                                    key={enr.id}
                                    className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Image */}
                                        <div className="relative h-44 bg-slate-900 overflow-hidden">
                                            <img
                                                src={c.thumbnail || '/images/stitch/campus_architecture_hero.png'}
                                                alt={c.title_en}
                                                className="w-full h-full object-cover"
                                            />
                                            <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#17365D]/90 backdrop-blur-sm text-white text-xs font-mono font-bold">
                                                {c.code}
                                            </span>
                                            {isCompleted ? (
                                                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    <span>{locale === 'ar' ? 'مكتمل' : 'Completed'}</span>
                                                </span>
                                            ) : (
                                                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-blue-500 text-white text-[11px] font-bold shadow-sm">
                                                    {locale === 'ar' ? 'قيد الدراسة' : 'In Progress'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="p-5 space-y-3">
                                            <div className="flex items-center justify-between text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {c.duration_hours} {t('hours')}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <BookOpen className="w-3.5 h-3.5" />
                                                    {c.lectures?.length || 0} {t('lectures')}
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-[#17365D] text-base line-clamp-1">
                                                {locale === 'ar' ? c.title_ar : c.title_en}
                                            </h3>

                                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                                {locale === 'ar' ? c.description_ar : c.description_en}
                                            </p>

                                            <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                                                <User className="w-3.5 h-3.5 text-[#2563A6]" />
                                                <span className="truncate">
                                                    {c.teachers?.[0]?.name || (locale === 'ar' ? 'هيئة التدريس' : 'Faculty Member')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Foot */}
                                    <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-3">
                                        <Link
                                            href={route('student.learn', { course: c.slug })}
                                            className="w-full py-2.5 px-4 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <Play className="w-3.5 h-3.5 fill-current" />
                                            <span>{locale === 'ar' ? 'قاعة المحاضرات' : 'Classroom'}</span>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

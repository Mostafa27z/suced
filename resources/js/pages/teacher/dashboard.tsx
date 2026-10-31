import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import {
    BookOpen,
    Users,
    Video,
    BarChart3,
    FileText,
    Play,
    Plus,
    Clock,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    TrendingUp,
    ShieldAlert
} from 'lucide-react';

interface CourseCard {
    id: number;
    slug: string;
    code: string;
    title_en: string;
    title_ar: string;
    thumbnail: string;
    duration_hours: number;
    enrolled_count: number;
    lectures_count: number;
    exams_count: number;
    completion_rate: number;
}

interface RecentLecture {
    id: number;
    title_en: string;
    title_ar: string;
    duration_minutes: number;
    is_published: boolean;
    course: {
        id: number;
        title_en: string;
        title_ar: string;
        slug: string;
    };
}

interface Props {
    metrics: {
        assigned_courses: number;
        total_enrolled: number;
        published_lectures: number;
        recent_attempts: number;
    };
    assignedCourses: CourseCard[];
    recentLectures: RecentLecture[];
}

export default function TeacherDashboard({
    metrics,
    assignedCourses,
    recentLectures,
}: Props) {
    const { t, locale, isRtl } = useTranslation();
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

    return (
        <AuthenticatedLayout
            title={locale === 'ar' ? 'بوابة هيئة التدريس' : 'Faculty Instructor Cockpit'}
            breadcrumb={locale === 'ar' ? 'لوحة تحكم الأستاذ' : 'Instructor Dashboard'}
        >
            <Head title={locale === 'ar' ? 'بوابة هيئة التدريس - SUCED' : 'Faculty Dashboard - SUCED'} />

            <div className="space-y-8">
                {/* Faculty Welcome Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200">
                    <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gradient-to-br from-[#17365D]/10 to-[#2563A6]/10 pointer-events-none blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#2563A6] border border-blue-200/60 text-xs font-bold uppercase tracking-wider">
                                    {locale === 'ar' ? 'عضو هيئة تدريس معتمد' : 'Authorized Faculty Member'}
                                </span>
                                <span className="text-xs font-semibold text-slate-500">
                                    {locale === 'ar' ? 'جامعة سوهاج - التعليم المستمر' : 'Sohag University • SUCED'}
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17365D] tracking-tight">
                                {locale === 'ar' ? `مرحباً بك يا دكتور ${user?.name}` : `Welcome back, Dr. ${user?.name}`}
                            </h1>

                            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                                {locale === 'ar'
                                    ? 'إدارة المحاضرات المسجلة على YouTube، إعداد بنك الأسئلة والاختبارات، ومتابعة تقدم الطلاب في مقرراتك المكلف بها.'
                                    : 'Manage your assigned video lectures, author examination question banks, and track student completion velocity.'}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <Link
                                href={route('teacher.courses')}
                                className="px-5 py-2.5 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-bold transition-colors shadow-md flex items-center gap-2"
                            >
                                <BookOpen className="w-4 h-4" />
                                <span>{locale === 'ar' ? 'إدارة المقررات' : 'My Courses'}</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 4 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Metric 1 */}
                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                {locale === 'ar' ? 'المقررات المكلف بها' : 'Assigned Courses'}
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-[#17365D]/10 text-[#17365D] flex items-center justify-center">
                                <BookOpen className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-[#17365D]">
                                {metrics.assigned_courses}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                                {locale === 'ar' ? 'مقررات نشطة' : 'Active tracks'}
                            </span>
                        </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                {locale === 'ar' ? 'الطلاب المسجلين' : 'Total Enrolled'}
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563A6] flex items-center justify-center">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-[#17365D]">
                                {metrics.total_enrolled}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                                {locale === 'ar' ? 'طالب وطالبة' : 'Students'}
                            </span>
                        </div>
                    </div>

                    {/* Metric 3 */}
                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                {locale === 'ar' ? 'المحاضرات المنشورة' : 'Published Lectures'}
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                <Video className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-[#17365D]">
                                {metrics.published_lectures}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                                {locale === 'ar' ? 'محاضرة يوتيوب' : 'Video lectures'}
                            </span>
                        </div>
                    </div>

                    {/* Metric 4 */}
                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                {locale === 'ar' ? 'تسليمات الاختبارات' : 'Exam Submissions'}
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#9E7317] flex items-center justify-center">
                                <FileText className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-[#17365D]">
                                {metrics.recent_attempts}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                                {locale === 'ar' ? 'محاولة مصححة' : 'Attempts'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Assigned Courses Grid */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-[#17365D]" />
                            <h2 className="text-lg font-bold text-[#17365D]">
                                {locale === 'ar' ? 'المقررات الخاضعة لإشرافك' : 'My Assigned Courses'}
                            </h2>
                        </div>
                        <Link
                            href={route('teacher.courses')}
                            className="text-xs font-bold text-[#2563A6] hover:text-[#17365D] flex items-center gap-1"
                        >
                            <span>{locale === 'ar' ? 'عرض الكل' : 'View All'}</span>
                            <ArrowIcon className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assignedCourses.map((c) => (
                            <div
                                key={c.id}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
                            >
                                <div>
                                    <div className="relative h-40 bg-slate-900 overflow-hidden">
                                        <img
                                            src={c.thumbnail || '/images/stitch/campus_architecture_hero.png'}
                                            alt={c.title_en}
                                            className="w-full h-full object-cover"
                                        />
                                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#17365D]/90 backdrop-blur-sm text-white text-xs font-mono font-bold">
                                            {c.code}
                                        </span>
                                        <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-white/95 text-[#17365D] text-[11px] font-bold shadow-sm">
                                            {c.enrolled_count} {locale === 'ar' ? 'طالب' : 'students'}
                                        </span>
                                    </div>

                                    <div className="p-5 space-y-3">
                                        <h3 className="font-bold text-[#17365D] text-base line-clamp-1">
                                            {locale === 'ar' ? c.title_ar : c.title_en}
                                        </h3>

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
                                                <span className="text-slate-400 block text-[10px]">{locale === 'ar' ? 'الإنجاز' : 'Completion'}</span>
                                                <strong className="text-emerald-700">{c.completion_rate}%</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 pt-0 border-t border-slate-100 grid grid-cols-2 gap-2">
                                    <Link
                                        href={route('teacher.courses.lectures', { course: c.id })}
                                        className="py-2 px-3 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                        <Video className="w-3.5 h-3.5" />
                                        <span>{locale === 'ar' ? 'المحاضرات' : 'Lectures'}</span>
                                    </Link>
                                    <Link
                                        href={route('teacher.student-progress')}
                                        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        <Users className="w-3.5 h-3.5" />
                                        <span>{locale === 'ar' ? 'الطلاب' : 'Students'}</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Lectures Added Strip */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-slate-600" />
                            <h3 className="font-bold text-[#17365D] text-base">
                                {locale === 'ar' ? 'آخر المحاضرات المحدثة' : 'Recently Updated Lectures'}
                            </h3>
                        </div>
                    </div>

                    {recentLectures.length === 0 ? (
                        <p className="text-xs text-slate-500 py-3 text-center">
                            {locale === 'ar' ? 'لم يتم إضافة أي محاضرات بعد.' : 'No lectures added yet.'}
                        </p>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {recentLectures.map((lec) => (
                                <div key={lec.id} className="py-3 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563A6] flex items-center justify-center">
                                            <Video className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                                                {locale === 'ar' ? lec.title_ar : lec.title_en}
                                            </h4>
                                            <span className="text-[11px] text-slate-500">
                                                {locale === 'ar' ? lec.course.title_ar : lec.course.title_en} • {lec.duration_minutes}m
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                lec.is_published
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-slate-100 text-slate-600'
                                            }`}
                                        >
                                            {lec.is_published
                                                ? (locale === 'ar' ? 'منشور' : 'Published')
                                                : (locale === 'ar' ? 'مسودة' : 'Draft')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

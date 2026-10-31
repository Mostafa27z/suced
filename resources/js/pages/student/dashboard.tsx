import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import {
    BookOpen,
    CheckCircle2,
    Award,
    FileText,
    Play,
    Clock,
    Calendar,
    ArrowRight,
    ArrowLeft,
    TrendingUp,
    Shield,
    QrCode,
    Download,
    History,
    GraduationCap,
    AlertCircle,
    ChevronRight,
    Sparkles
} from 'lucide-react';

interface Props {
    metrics: {
        enrolled_courses: number;
        completed_courses: number;
        exams_passed: number;
        certificates_earned: number;
    };
    enrolledCourses: Array<{
        id: number;
        slug: string;
        code: string;
        title_en: string;
        title_ar: string;
        thumbnail: string;
        total_lectures: number;
        completed_lectures: number;
        progress_percentage: number;
        lead_teacher?: string;
        next_lecture?: {
            id: number;
            position: number;
            title_en: string;
            title_ar: string;
        };
    }>;
    exams: Array<{
        id: number;
        title_en: string;
        title_ar: string;
        course_title_en: string;
        course_title_ar: string;
        duration_minutes: number;
        passing_score: number;
        remaining_attempts: number;
        passed: boolean;
        best_score?: number | null;
        status: string;
    }>;
    certificates: Array<{
        id: number;
        public_code: string;
        certificate_number: string;
        course_title_en: string;
        course_title_ar: string;
        issue_date: string;
        score_percentage: number;
    }>;
    recentActivity: Array<{
        type: 'lecture' | 'exam';
        title_en: string;
        title_ar: string;
        course: string;
        time: string;
    }>;
}

export default function StudentDashboard({
    metrics,
    enrolledCourses,
    exams,
    certificates,
    recentActivity,
}: Props) {
    const { t, locale, isRtl } = useTranslation();
    const { auth } = usePage().props as any;
    const user = auth?.user;

    const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

    return (
        <AuthenticatedLayout
            title={locale === 'ar' ? 'بوابة الطالب' : 'Student Portal'}
            breadcrumb={locale === 'ar' ? 'لوحة التحكم الأكاديمية' : 'Academic Console'}
        >
            <Head title={locale === 'ar' ? 'لوحة تحكم الطالب - SUCED' : 'Student Dashboard - SUCED'} />

            <div className="space-y-8">
                {/* 1. Welcome & Status Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200">
                    <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gradient-to-br from-[#2563A6]/10 to-[#D6A84F]/10 pointer-events-none blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#2563A6] border border-blue-200/60 text-xs font-bold tracking-wider uppercase">
                                    {t('term_label')}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    {locale === 'ar' ? 'حساب أكاديمي نشط' : 'Verified Learner Account'}
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17365D] tracking-tight">
                                {t('welcome_back')} {user?.name}!
                            </h1>

                            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                                {t('student_sub')}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <Link
                                href={route('courses.index')}
                                className="px-5 py-2.5 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-sm font-semibold transition-colors shadow-md flex items-center gap-2"
                            >
                                <GraduationCap className="w-4 h-4" />
                                <span>{t('explore_courses')}</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 2. Key Metrics Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Metric 1: Enrolled Courses */}
                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                {t('enrolled_courses')}
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-[#17365D]/10 text-[#17365D] flex items-center justify-center">
                                <BookOpen className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-[#17365D]">
                                {metrics.enrolled_courses}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                                {locale === 'ar' ? 'دورات قيد الدراسة' : 'Active tracks'}
                            </span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>{locale === 'ar' ? 'ساعات معتمدة مسجلة' : 'Registered modules'}</span>
                        </div>
                    </div>

                    {/* Metric 2: Completed Courses */}
                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                {t('courses_completed')}
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563A6] flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-[#17365D]">
                                {metrics.completed_courses}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                                {locale === 'ar' ? 'مكتملة بنجاح' : 'Finished'}
                            </span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                            <span>{locale === 'ar' ? 'تغطية كاملة للمنهج' : '100% syllabus completed'}</span>
                        </div>
                    </div>

                    {/* Metric 3: Exams Passed */}
                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                {t('exams_passed')}
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#9E7317] flex items-center justify-center">
                                <FileText className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-[#17365D]">
                                {metrics.exams_passed}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                                {locale === 'ar' ? 'اختبارات مجتازة' : 'Passed assessments'}
                            </span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                            <span>{locale === 'ar' ? 'الحد الأدنى للاجتياز 70%' : 'Min 70% threshold'}</span>
                        </div>
                    </div>

                    {/* Metric 4: Certificates Earned */}
                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                {t('certificates_earned')}
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-[#D6A84F]/15 text-[#9E7317] flex items-center justify-center">
                                <Award className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-[#17365D]">
                                {metrics.certificates_earned}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                                {locale === 'ar' ? 'شهادات موثقة' : 'Verified'}
                            </span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-[#2563A6] font-semibold">
                            <Shield className="w-3.5 h-3.5" />
                            <span>{locale === 'ar' ? 'موثقة برمز QR رسمي' : 'Digitally authenticated'}</span>
                        </div>
                    </div>
                </div>

                {/* 3. Primary Content Grid: Left Column (Courses & Assessments), Right Column (Recent Activity & Credentials) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Section: Continue Learning */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-[#17365D]/10 text-[#17365D] flex items-center justify-center">
                                        <Play className="w-4 h-4 fill-current" />
                                    </div>
                                    <h2 className="text-lg font-bold text-[#17365D]">
                                        {t('continue_learning')}
                                    </h2>
                                </div>
                                <Link
                                    href={route('student.courses')}
                                    className="text-xs font-bold text-[#2563A6] hover:text-[#17365D] flex items-center gap-1"
                                >
                                    <span>{t('view_all_courses')}</span>
                                    <ArrowIcon className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            {enrolledCourses.length === 0 ? (
                                <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
                                    <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
                                    <h3 className="font-bold text-slate-800 text-base">
                                        {locale === 'ar' ? 'لست مسجلاً في أي دورة بعد' : 'No Enrolled Courses Yet'}
                                    </h3>
                                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                        {locale === 'ar'
                                            ? 'استكشف برامج ودورات التعليم المستمر المتاحة وابدأ رحلتك الأكاديمية الآن.'
                                            : 'Explore available continuing education courses and start your academic journey today.'}
                                    </p>
                                    <Link
                                        href={route('courses.index')}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-semibold transition-colors shadow-sm"
                                    >
                                        <GraduationCap className="w-4 h-4" />
                                        <span>{t('explore_courses')}</span>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {enrolledCourses.map((c) => {
                                        const learnUrl = c.next_lecture
                                            ? route('student.learn', { course: c.slug, lecture: c.next_lecture.id })
                                            : route('student.learn', { course: c.slug });

                                        return (
                                            <div
                                                key={c.id}
                                                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-5 items-stretch"
                                            >
                                                {/* Thumbnail */}
                                                <div className="relative w-full md:w-56 h-36 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                                                    <img
                                                        src={c.thumbnail || '/images/stitch/campus_architecture_hero.png'}
                                                        alt={c.title_en}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#17365D]/90 backdrop-blur-sm text-white text-[11px] font-bold font-mono">
                                                        {c.code}
                                                    </span>
                                                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-sm text-[#17365D] text-[11px] font-bold shadow-sm">
                                                        {c.progress_percentage}% {locale === 'ar' ? 'منجز' : 'Done'}
                                                    </span>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 flex flex-col justify-between gap-3 min-w-0">
                                                    <div>
                                                        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                                                            <span>{c.lead_teacher || (locale === 'ar' ? 'هيئة التدريس' : 'Faculty Instructor')}</span>
                                                            <span className="font-semibold text-[#17365D]">
                                                                {c.completed_lectures} / {c.total_lectures} {t('lectures')}
                                                            </span>
                                                        </div>

                                                        <h3 className="font-bold text-[#17365D] text-base sm:text-lg mt-1 truncate">
                                                            {locale === 'ar' ? c.title_ar : c.title_en}
                                                        </h3>

                                                        {c.next_lecture && (
                                                            <p className="text-xs text-slate-600 mt-1 truncate">
                                                                {locale === 'ar' ? 'المحاضرة التالية: ' : 'Up Next: '}
                                                                <span className="font-semibold text-slate-800">
                                                                    {c.next_lecture.position}. {locale === 'ar' ? c.next_lecture.title_ar : c.next_lecture.title_en}
                                                                </span>
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Progress bar */}
                                                    <div className="space-y-1.5">
                                                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-[#17365D] to-[#2563A6] rounded-full transition-all duration-300"
                                                                style={{ width: `${Math.min(100, Math.max(0, c.progress_percentage))}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    {/* Action button */}
                                                    <div className="flex items-center justify-between pt-1">
                                                        <span className="text-[11px] font-semibold text-slate-500">
                                                            {c.progress_percentage === 100
                                                                ? (locale === 'ar' ? 'اكتملت المحاضرات' : 'Lectures Completed')
                                                                : (locale === 'ar' ? 'تابع المشاهدة الآن' : 'Continue Lecture')}
                                                        </span>
                                                        <Link
                                                            href={learnUrl}
                                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-semibold transition-colors shadow-sm"
                                                        >
                                                            <Play className="w-3.5 h-3.5 fill-current" />
                                                            <span>{locale === 'ar' ? 'دخول قاعة المحاضرات' : 'Enter Classroom'}</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {/* Section: Upcoming Exams & Assessments */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#9E7317] flex items-center justify-center">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <h2 className="text-lg font-bold text-[#17365D]">
                                        {locale === 'ar' ? 'جدول الاختبارات والتقييمات' : 'Assessments & Examination Schedule'}
                                    </h2>
                                </div>
                                <Link
                                    href={route('student.exams')}
                                    className="text-xs font-bold text-[#2563A6] hover:text-[#17365D] flex items-center gap-1"
                                >
                                    <span>{locale === 'ar' ? 'سجل الاختبارات الكامل' : 'All Exams'}</span>
                                    <ArrowIcon className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                                            <tr>
                                                <th className="py-3 px-4">{locale === 'ar' ? 'عنوان الاختبار' : 'Assessment Title'}</th>
                                                <th className="py-3 px-4">{locale === 'ar' ? 'الدورة التدريبية' : 'Course'}</th>
                                                <th className="py-3 px-4">{locale === 'ar' ? 'المدة' : 'Duration'}</th>
                                                <th className="py-3 px-4">{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                                                <th className="py-3 px-4 text-right">{locale === 'ar' ? 'الإجراء' : 'Action'}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {exams.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="py-8 text-center text-xs text-slate-500">
                                                        {locale === 'ar' ? 'لا توجد اختبارات معلنة حالياً' : 'No examinations scheduled currently.'}
                                                    </td>
                                                </tr>
                                            ) : (
                                                exams.map((exam) => (
                                                    <tr key={exam.id} className="hover:bg-slate-50/60 transition-colors">
                                                        <td className="py-3.5 px-4 font-semibold text-[#17365D]">
                                                            {locale === 'ar' ? exam.title_ar : exam.title_en}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-xs text-slate-600">
                                                            {locale === 'ar' ? exam.course_title_ar : exam.course_title_en}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                                                            {exam.duration_minutes} {locale === 'ar' ? 'دقيقة' : 'mins'}
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            {exam.passed ? (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                                                    <CheckCircle2 className="w-3 h-3" />
                                                                    <span>{locale === 'ar' ? `ناجح (${exam.best_score}%)` : `Passed (${exam.best_score}%)`}</span>
                                                                </span>
                                                            ) : exam.remaining_attempts > 0 ? (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563A6] text-xs font-bold border border-blue-200">
                                                                    <span>{locale === 'ar' ? `متاح (${exam.remaining_attempts} محاولة)` : `Available (${exam.remaining_attempts} left)`}</span>
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                                                                    <span>{locale === 'ar' ? 'استنفدت المحاولات' : 'Attempts Exhausted'}</span>
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-right">
                                                            {exam.passed ? (
                                                                <Link
                                                                    href={route('student.exams')}
                                                                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors inline-block"
                                                                >
                                                                    {locale === 'ar' ? 'عرض النتيجة' : 'View Result'}
                                                                </Link>
                                                            ) : exam.remaining_attempts > 0 ? (
                                                                <Link
                                                                    href={route('student.exams.take', { exam: exam.id })}
                                                                    className="px-3 py-1.5 rounded-lg bg-[#2563A6] hover:bg-[#17365D] text-white text-xs font-semibold transition-colors inline-block shadow-sm"
                                                                >
                                                                    {locale === 'ar' ? 'بدء الاختبار' : 'Start Exam'}
                                                                </Link>
                                                            ) : (
                                                                <span className="text-xs text-slate-400 font-medium">
                                                                    {locale === 'ar' ? 'مغلق' : 'Closed'}
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Verified Academic Credentials Showcase */}
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-[#D6A84F]" />
                                    <h3 className="font-bold text-[#17365D] text-base">
                                        {locale === 'ar' ? 'شهاداتي الأكاديمية' : 'Verified Credentials'}
                                    </h3>
                                </div>
                                <Link
                                    href={route('student.certificates')}
                                    className="text-xs font-bold text-[#2563A6] hover:text-[#17365D]"
                                >
                                    {locale === 'ar' ? 'السجل الكامل' : 'All'}
                                </Link>
                            </div>

                            {certificates.length === 0 ? (
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-2">
                                    <Award className="w-8 h-8 text-slate-300 mx-auto" />
                                    <p className="text-xs text-slate-500">
                                        {locale === 'ar'
                                            ? 'أكمل محاضرات الدورة واجتز الامتحان النهائي بنسبة 70% لإصدار شهادتك المعتمدة.'
                                            : 'Complete all lectures & pass the final exam at >= 70% to receive your university certificate.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {certificates.map((cert) => (
                                        <div
                                            key={cert.id}
                                            className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-amber-50/30 border border-amber-200/50 space-y-2.5 relative overflow-hidden"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#D6A84F]/20 text-[#9E7317]">
                                                        {locale === 'ar' ? 'معتمدة رسمياً' : 'Official Credential'}
                                                    </span>
                                                    <h4 className="font-bold text-[#17365D] text-sm mt-1">
                                                        {locale === 'ar' ? cert.course_title_ar : cert.course_title_en}
                                                    </h4>
                                                </div>
                                                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                                    {cert.score_percentage}%
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                                                <span>{cert.certificate_number}</span>
                                                <span>{cert.issue_date}</span>
                                            </div>

                                            <div className="flex items-center gap-2 pt-1">
                                                <a
                                                    href={route('certificates.download', { certificate: cert.id })}
                                                    className="flex-1 py-1.5 px-3 rounded-lg bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    <span>{locale === 'ar' ? 'تحميل PDF' : 'PDF'}</span>
                                                </a>
                                                <Link
                                                    href={route('verify.show', { code: cert.public_code })}
                                                    className="py-1.5 px-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <QrCode className="w-3.5 h-3.5 text-[#2563A6]" />
                                                    <span>{locale === 'ar' ? 'فحص' : 'Verify'}</span>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent Activity Timeline */}
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-center gap-2">
                                <History className="w-5 h-5 text-slate-600" />
                                <h3 className="font-bold text-[#17365D] text-base">
                                    {locale === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
                                </h3>
                            </div>

                            {recentActivity.length === 0 ? (
                                <p className="text-xs text-slate-500 py-3 text-center">
                                    {locale === 'ar' ? 'لا يوجد نشاط مسجل حتى الآن.' : 'No recorded activity yet.'}
                                </p>
                            ) : (
                                <div className="space-y-4 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                    {recentActivity.map((act, idx) => (
                                        <div key={idx} className="relative space-y-0.5">
                                            <div className="absolute -left-[1.35rem] top-1.5 w-3 h-3 rounded-full bg-[#2563A6] border-2 border-white shadow-sm"></div>
                                            <span className="text-xs font-bold text-slate-800 block">
                                                {locale === 'ar' ? act.title_ar : act.title_en}
                                            </span>
                                            <span className="text-[11px] text-slate-500 block truncate">
                                                {act.course}
                                            </span>
                                            <span className="text-[10px] text-slate-400 block font-medium">
                                                {act.time}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Weekly Study Velocity Helper */}
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    {locale === 'ar' ? 'سرعة التعلم الأسبوعية' : 'Study Velocity'}
                                </span>
                                <span className="text-xs font-bold text-[#2563A6]">
                                    {locale === 'ar' ? 'منتظم ومستقر' : 'Consistent'}
                                </span>
                            </div>
                            <div className="h-24 flex items-end justify-between pt-4 px-2 gap-2">
                                {[
                                    { day: 'S', height: '40%' },
                                    { day: 'M', height: '65%' },
                                    { day: 'T', height: '85%' },
                                    { day: 'W', height: '50%' },
                                    { day: 'T', height: '100%' },
                                    { day: 'F', height: '30%' },
                                    { day: 'S', height: '45%' },
                                ].map((d, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                                        <div
                                            className="w-full rounded-t bg-gradient-to-t from-[#17365D] to-[#2563A6] opacity-90 transition-all hover:opacity-100"
                                            style={{ height: d.height }}
                                        ></div>
                                        <span className="text-[10px] font-semibold text-slate-400">{d.day}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[11px] text-slate-500 pt-1 text-center">
                                {locale === 'ar'
                                    ? 'يُنصح بحضور المحاضرات أسبوعياً للحفاظ على مستوى الاستيعاب المطلوب.'
                                    : 'Consistent weekly lecture attendance maximizes knowledge retention.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

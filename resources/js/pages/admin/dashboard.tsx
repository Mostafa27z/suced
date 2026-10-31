import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    Users,
    BookOpen,
    GraduationCap,
    Award,
    TrendingUp,
    FileSpreadsheet,
    Shield,
    CheckCircle2,
    Calendar,
    ArrowRight,
    ArrowLeft,
    Download
} from 'lucide-react';

interface Props {
    metrics: {
        total_students: number;
        total_teachers: number;
        total_admins: number;
        published_courses: number;
        total_courses: number;
        total_enrollments: number;
        completed_courses: number;
        exams_evaluated: number;
        certificates_issued: number;
    };
    enrollmentTrends: Array<{ date: string; count: number }>;
    completionRatesByCategory: Array<{ category: string; rate: number }>;
    courses: Array<{
        id: number;
        slug: string;
        code: string;
        title_en: string;
        title_ar: string;
        is_published: boolean;
        students_count: number;
        lectures_count: number;
        exams_count: number;
        teachers: Array<{ id: number; name: string }>;
    }>;
    recentEnrollments: Array<{
        id: number;
        enrolled_at: string;
        user: { name: string; email: string };
        course: { title_en: string; title_ar: string };
    }>;
    recentCertificates: Array<{
        id: number;
        certificate_number: string;
        public_code: string;
        student_name: string;
        course_title_en: string;
        course_title_ar: string;
        issue_date: string;
        score_percentage: number;
    }>;
}

export default function AdminDashboard({
    metrics,
    enrollmentTrends,
    completionRatesByCategory,
    courses,
    recentEnrollments,
    recentCertificates,
}: Props) {
    const { t, locale, isRtl } = useTranslation();
    const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

    return (
        <AuthenticatedLayout
            title={locale === 'ar' ? 'مركز القيادة والتحكم الإداري' : 'Administrative Governance Command'}
            breadcrumb={locale === 'ar' ? 'لوحة القيادة' : 'Platform Overview'}
        >
            <Head title={locale === 'ar' ? 'لوحة تحكم المسؤول - SUCED' : 'Admin Dashboard - SUCED'} />

            <div className="space-y-8">
                {/* Admin Welcome & Action Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200">
                    <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gradient-to-br from-[#17365D]/10 to-[#D6A84F]/10 pointer-events-none blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-3 py-1 rounded-full bg-[#17365D] text-white text-xs font-bold uppercase tracking-wider">
                                    {locale === 'ar' ? 'الإدارة المركزية المعتمدة' : 'SUCED Central Governance'}
                                </span>
                                <span className="text-xs font-semibold text-slate-500">
                                    {locale === 'ar' ? 'نظام التعليم المستمر • جامعة سوهاج' : 'Sohag University LMS Core'}
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17365D] tracking-tight">
                                {t('platform_overview')}
                            </h1>

                            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                                {locale === 'ar'
                                    ? 'متابعة مؤشرات الأداء اللحظية، حركة التسجيل والالتحاق بالمقررات، حوكمة بنك الأسئلة، والتحقق من إصدار الشهادات الرقمية.'
                                    : 'Real-time university enrollment velocity, curriculum governance, teacher assignments, and cryptographically verified digital certificate records.'}
                            </p>
                        </div>

                        {/* Export Quick Reports */}
                        <div className="flex items-center gap-3 shrink-0">
                            <a
                                href={route('admin.reports.export', { type: 'enrollments' })}
                                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-2"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>{locale === 'ar' ? 'تصدير الالتحاقات (CSV)' : 'Enrollments CSV'}</span>
                            </a>
                            <a
                                href={route('admin.reports.export', { type: 'certificates' })}
                                className="px-4 py-2.5 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-2"
                            >
                                <FileSpreadsheet className="w-3.5 h-3.5 text-[#D6A84F]" />
                                <span>{locale === 'ar' ? 'سجل الشهادات (CSV)' : 'Certificates CSV'}</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* 5 Real Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                    {/* Metric 1 */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                {locale === 'ar' ? 'إجمالي الطلاب' : 'Registered Students'}
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563A6] flex items-center justify-center">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-[#17365D]">
                                {metrics.total_students}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                                {locale === 'ar' ? 'طالب' : 'active'}
                            </span>
                        </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                {locale === 'ar' ? 'هيئة التدريس' : 'Active Faculty'}
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-[#17365D]/10 text-[#17365D] flex items-center justify-center">
                                <GraduationCap className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-[#17365D]">
                                {metrics.total_teachers}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                                {locale === 'ar' ? 'أستاذ' : 'instructors'}
                            </span>
                        </div>
                    </div>

                    {/* Metric 3 */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                {locale === 'ar' ? 'المقررات المنشورة' : 'Published Tracks'}
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                <BookOpen className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-[#17365D]">
                                {metrics.published_courses}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                                / {metrics.total_courses}
                            </span>
                        </div>
                    </div>

                    {/* Metric 4 */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                {locale === 'ar' ? 'إجمالي الالتحاقات' : 'Enrollments'}
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-[#17365D]">
                                {metrics.total_enrollments}
                            </span>
                            <span className="text-xs text-emerald-600 font-semibold">
                                ({metrics.completed_courses} {locale === 'ar' ? 'أتموا' : 'done'})
                            </span>
                        </div>
                    </div>

                    {/* Metric 5 */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                {locale === 'ar' ? 'الشهادات الممنوحة' : 'Certificates'}
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-[#D6A84F]/15 text-[#9E7317] flex items-center justify-center">
                                <Award className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-[#17365D]">
                                {metrics.certificates_issued}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                                {locale === 'ar' ? 'موثقة' : 'issued'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Recharts Analytics Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Enrollment Trends AreaChart (7 cols) */}
                    <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h3 className="font-bold text-[#17365D] text-base">
                                    {locale === 'ar' ? 'معدل تسجيل الطلاب (آخر 30 يوماً)' : 'Student Enrollment Velocity (Last 30 Days)'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {locale === 'ar' ? 'البيانات المسجلة بقاعدة بيانات جامعة سوهاج' : 'Live database metrics for continuing modules'}
                                </p>
                            </div>
                        </div>

                        <div className="h-64 w-full pt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={enrollmentTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="enrollmentGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563A6" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#17365D" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#17365D',
                                            borderRadius: '12px',
                                            color: '#FFFFFF',
                                            fontSize: '12px',
                                            border: 'none',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#2563A6"
                                        strokeWidth={2.5}
                                        fillOpacity={1}
                                        fill="url(#enrollmentGrad)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Completion Rates by Category BarChart (5 cols) */}
                    <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="space-y-0.5">
                            <h3 className="font-bold text-[#17365D] text-base">
                                {locale === 'ar' ? 'نسب إتمام المقررات حسب التخصص' : 'Completion Rate by Discipline'}
                            </h3>
                            <p className="text-xs text-slate-500">
                                {locale === 'ar' ? 'مؤشر نجاح الطلاب في تجاوز الامتحانات' : 'Student curriculum mastery index (%)'}
                            </p>
                        </div>

                        <div className="h-64 w-full pt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={completionRatesByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                                    <XAxis dataKey="category" stroke="#94A3B8" fontSize={10} tickLine={false} />
                                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} unit="%" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#17365D',
                                            borderRadius: '12px',
                                            color: '#FFFFFF',
                                            fontSize: '12px',
                                            border: 'none',
                                        }}
                                    />
                                    <Bar dataKey="rate" fill="#D6A84F" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Course Governance Ledger Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-[#17365D]" />
                            <h3 className="font-bold text-[#17365D] text-base">
                                {t('governance_title')}
                            </h3>
                        </div>
                        <Link
                            href={route('admin.courses')}
                            className="text-xs font-bold text-[#2563A6] hover:text-[#17365D] flex items-center gap-1"
                        >
                            <span>{locale === 'ar' ? 'إدارة جميع المقررات' : 'Manage All'}</span>
                            <ArrowIcon className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">{locale === 'ar' ? 'المقرر والكود' : 'Course & Code'}</th>
                                    <th className="py-3 px-4">{locale === 'ar' ? 'هيئة التدريس' : 'Faculty'}</th>
                                    <th className="py-3 px-4">{locale === 'ar' ? 'المحاضرات' : 'Lectures'}</th>
                                    <th className="py-3 px-4">{locale === 'ar' ? 'الاختبارات' : 'Exams'}</th>
                                    <th className="py-3 px-4">{locale === 'ar' ? 'الطلاب' : 'Students'}</th>
                                    <th className="py-3 px-4">{locale === 'ar' ? 'حالة النشر' : 'Status'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {courses.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="font-bold text-[#17365D]">
                                                {locale === 'ar' ? c.title_ar : c.title_en}
                                            </div>
                                            <span className="text-[11px] font-mono text-slate-400">
                                                {c.code}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-xs text-slate-700">
                                            {c.teachers?.[0]?.name || (locale === 'ar' ? 'غير مخصص' : 'Unassigned')}
                                        </td>
                                        <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                                            {c.lectures_count}
                                        </td>
                                        <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                                            {c.exams_count}
                                        </td>
                                        <td className="py-3 px-4 text-xs font-bold text-blue-700">
                                            {c.students_count}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                    c.is_published
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-amber-50 text-amber-700'
                                                }`}
                                            >
                                                {c.is_published
                                                    ? (locale === 'ar' ? 'منشور' : 'Published')
                                                    : (locale === 'ar' ? 'مسودة' : 'Draft')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bottom Recent Activity: Enrollments & Certificates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Recent Enrollments */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-[#17365D] text-sm">
                                {locale === 'ar' ? 'آخر الالتحاقات المسجلة' : 'Recent Registrations'}
                            </h4>
                            <span className="text-xs text-slate-400">{recentEnrollments.length}</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {recentEnrollments.map((enr) => (
                                <div key={enr.id} className="py-2.5 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="font-semibold text-slate-800 block">
                                            {enr.user?.name}
                                        </span>
                                        <span className="text-slate-400 text-[11px]">
                                            {locale === 'ar' ? enr.course?.title_ar : enr.course?.title_en}
                                        </span>
                                    </div>
                                    <span className="text-slate-400 font-mono text-[10px]">
                                        {enr.enrolled_at}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Certificates Issued */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-[#17365D] text-sm">
                                {locale === 'ar' ? 'آخر الشهادات الممنوحة' : 'Recent Issued Certificates'}
                            </h4>
                            <span className="text-xs text-slate-400">{recentCertificates.length}</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {recentCertificates.map((cert) => (
                                <div key={cert.id} className="py-2.5 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="font-semibold text-slate-800 block">
                                            {cert.student_name}
                                        </span>
                                        <span className="text-slate-400 text-[11px]">
                                            {cert.certificate_number} • {cert.score_percentage}%
                                        </span>
                                    </div>
                                    <Link
                                        href={route('verify.show', { code: cert.public_code })}
                                        className="text-[#2563A6] hover:underline font-semibold"
                                    >
                                        {locale === 'ar' ? 'فحص' : 'Verify'}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import {
    BarChart3,
    CheckCircle2,
    XCircle,
    User,
    Clock,
    FileText
} from 'lucide-react';

interface AttemptItem {
    id: number;
    attempt_number: number;
    score: number;
    max_score: number;
    percentage: number;
    passed: boolean;
    status: string;
    submitted_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    exam: {
        id: number;
        title_en: string;
        title_ar: string;
        passing_score: number;
        course: {
            id: number;
            title_en: string;
            title_ar: string;
        };
    };
}

interface Props {
    attempts: {
        data: AttemptItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function TeacherExamResults({ attempts }: Props) {
    const { t, locale, isRtl } = useTranslation();

    return (
        <AuthenticatedLayout
            title={locale === 'ar' ? 'نتائج الاختبارات والتقييم' : 'Examination Results Ledger'}
            breadcrumb={locale === 'ar' ? 'سجل الدرجات' : 'Exam Results'}
        >
            <Head title={locale === 'ar' ? 'نتائج الاختبارات - SUCED' : 'Exam Results - SUCED'} />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-[#17365D]">
                            {locale === 'ar' ? 'سجل تسليمات الاختبارات المصححة إلكترونياً' : 'Graded Assessment Submissions'}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            {locale === 'ar'
                                ? `إجمالي محاولات الاختبار المرصودة: ${attempts.total} تسليم.`
                                : `Total evaluated attempts recorded: ${attempts.total}.`}
                        </p>
                    </div>
                </div>

                {/* Table */}
                {attempts.data.length === 0 ? (
                    <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                        <BarChart3 className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="font-bold text-slate-800 text-base">
                            {locale === 'ar' ? 'لا توجد تسليمات اختبارات مسجلة حتى الآن' : 'No Submissions Recorded'}
                        </h3>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'الطالب' : 'Student'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'الاختبار والمقرر' : 'Exam & Course'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'المحاولة' : 'Attempt'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'الدرجة' : 'Score'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'النسبة' : 'Percentage'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'تاريخ التسليم' : 'Submitted'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {attempts.data.map((att) => (
                                        <tr key={att.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3.5 px-4">
                                                <span className="font-semibold text-[#17365D] block">
                                                    {att.user?.name}
                                                </span>
                                                <span className="text-[11px] text-slate-400">
                                                    {att.user?.email}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="font-semibold text-slate-800 block">
                                                    {locale === 'ar' ? att.exam?.title_ar : att.exam?.title_en}
                                                </span>
                                                <span className="text-[11px] text-slate-400">
                                                    {locale === 'ar' ? att.exam?.course?.title_ar : att.exam?.course?.title_en}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono font-bold text-slate-600">
                                                #{att.attempt_number}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                                                {att.score} / {att.max_score}
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-slate-900">
                                                {att.percentage}%
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {att.passed ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        <span>{locale === 'ar' ? 'ناجح' : 'Passed'}</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                                                        <XCircle className="w-3 h-3" />
                                                        <span>{locale === 'ar' ? 'راسب' : 'Failed'}</span>
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-slate-500">
                                                {att.submitted_at}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

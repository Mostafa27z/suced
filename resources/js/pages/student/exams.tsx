import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import {
    FileText,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    Play,
    Award,
    ChevronDown,
    ChevronUp,
    History
} from 'lucide-react';

interface Attempt {
    id: number;
    attempt_number: number;
    score: number;
    max_score: number;
    percentage: number;
    passed: boolean;
    status: string;
    submitted_at: string | null;
}

interface ExamItem {
    id: number;
    title_en: string;
    title_ar: string;
    course_title_en: string;
    course_title_ar: string;
    duration_minutes: number;
    passing_score: number;
    max_attempts: number;
    remaining_attempts: number;
    best_score: number | null;
    passed: boolean;
    attempts: Attempt[];
}

interface Props {
    exams: ExamItem[];
}

export default function StudentExams({ exams }: Props) {
    const { t, locale, isRtl } = useTranslation();
    const [expandedExamId, setExpandedExamId] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        setExpandedExamId(expandedExamId === id ? null : id);
    };

    return (
        <AuthenticatedLayout
            title={locale === 'ar' ? 'الاختبارات والتقييمات' : 'Exams & Assessments'}
            breadcrumb={locale === 'ar' ? 'سجل الامتحانات' : 'Assessments'}
        >
            <Head title={locale === 'ar' ? 'الاختبارات والتقييمات - SUCED' : 'Exams & Assessments - SUCED'} />

            <div className="space-y-6">
                {/* Header Strip */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-[#17365D]">
                            {locale === 'ar' ? 'سجل التقييمات والاختبارات الأكاديمية' : 'Academic Assessments & Examination Records'}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            {locale === 'ar'
                                ? 'يتم تصحيح جميع الاختبارات إلكترونياً وبشكل آمن وفوري عبر خوادم الجامعة.'
                                : 'All examinations are securely auto-evaluated server-side upon submission.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#2563A6] border border-blue-200/60 text-xs font-bold">
                            {locale === 'ar' ? 'الحد الأدنى للاجتياز: 70%' : 'Passing Threshold: 70%'}
                        </span>
                    </div>
                </div>

                {/* Exams List */}
                {exams.length === 0 ? (
                    <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="font-bold text-slate-800 text-base">
                            {locale === 'ar' ? 'لا توجد اختبارات معلنة حالياً' : 'No Assessments Scheduled'}
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            {locale === 'ar'
                                ? 'ستظهر هنا الاختبارات الخاصة بالمقررات التي قمت بالتسجيل فيها.'
                                : 'Assessments for your enrolled courses will appear here once published by faculty.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {exams.map((exam) => {
                            const isExpanded = expandedExamId === exam.id;

                            return (
                                <div
                                    key={exam.id}
                                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-slate-300"
                                >
                                    <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                                        {/* Left Info */}
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="px-2.5 py-0.5 rounded-md bg-[#17365D] text-white text-[11px] font-bold">
                                                    {locale === 'ar' ? exam.course_title_ar : exam.course_title_en}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {exam.duration_minutes} {locale === 'ar' ? 'دقيقة' : 'minutes'}
                                                </span>
                                                <span className="text-xs text-slate-400">•</span>
                                                <span className="text-xs text-slate-500 font-medium">
                                                    {locale === 'ar' ? `الدرجة المطلوبة: ${exam.passing_score}%` : `Pass: ${exam.passing_score}%`}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-bold text-[#17365D]">
                                                {locale === 'ar' ? exam.title_ar : exam.title_en}
                                            </h3>

                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <span>
                                                    {locale === 'ar' ? 'المحاولات المتبقية: ' : 'Attempts Left: '}
                                                    <strong className="text-slate-800">{exam.remaining_attempts}</strong> / {exam.max_attempts}
                                                </span>
                                                {exam.best_score !== null && (
                                                    <span>
                                                        {locale === 'ar' ? 'أفضل نتيجة: ' : 'Best Score: '}
                                                        <strong className={exam.passed ? 'text-emerald-700' : 'text-slate-800'}>
                                                            {exam.best_score}%
                                                        </strong>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Status & Actions */}
                                        <div className="flex items-center gap-3 shrink-0">
                                            {exam.passed ? (
                                                <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span>{locale === 'ar' ? 'مجتاز بنجاح' : 'Passed'}</span>
                                                </span>
                                            ) : exam.remaining_attempts > 0 ? (
                                                <Link
                                                    href={route('student.exams.take', { exam: exam.id })}
                                                    className="px-5 py-2.5 rounded-xl bg-[#2563A6] hover:bg-[#17365D] text-white text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
                                                >
                                                    <Play className="w-3.5 h-3.5 fill-current" />
                                                    <span>{locale === 'ar' ? 'بدء المحاولة' : 'Start Assessment'}</span>
                                                </Link>
                                            ) : (
                                                <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                                                    {locale === 'ar' ? 'استنفدت المحاولات' : 'No Attempts Left'}
                                                </span>
                                            )}

                                            {exam.attempts.length > 0 && (
                                                <button
                                                    onClick={() => toggleExpand(exam.id)}
                                                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                                                    title={locale === 'ar' ? 'عرض المحاولات السابقة' : 'View attempt history'}
                                                >
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Collapsible Attempt History */}
                                    {isExpanded && exam.attempts.length > 0 && (
                                        <div className="bg-slate-50 border-t border-slate-200 p-5 space-y-3">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                <History className="w-4 h-4 text-[#2563A6]" />
                                                <span>{locale === 'ar' ? 'سجل المحاولات السابقة' : 'Attempt History'}</span>
                                            </div>

                                            <div className="overflow-x-auto">
                                                <table className="w-full text-xs text-left">
                                                    <thead className="bg-white text-slate-500 border border-slate-200">
                                                        <tr>
                                                            <th className="py-2.5 px-3">{locale === 'ar' ? 'المحاولة' : 'Attempt'}</th>
                                                            <th className="py-2.5 px-3">{locale === 'ar' ? 'الدرجة' : 'Score'}</th>
                                                            <th className="py-2.5 px-3">{locale === 'ar' ? 'النسبة المئوية' : 'Percentage'}</th>
                                                            <th className="py-2.5 px-3">{locale === 'ar' ? 'النتيجة' : 'Result'}</th>
                                                            <th className="py-2.5 px-3">{locale === 'ar' ? 'تاريخ التسليم' : 'Submitted At'}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-200 bg-white border border-slate-200">
                                                        {exam.attempts.map((att) => (
                                                            <tr key={att.id} className="hover:bg-slate-50">
                                                                <td className="py-2 px-3 font-semibold text-slate-800">
                                                                    #{att.attempt_number}
                                                                </td>
                                                                <td className="py-2 px-3 text-slate-700">
                                                                    {att.score} / {att.max_score}
                                                                </td>
                                                                <td className="py-2 px-3 font-bold text-slate-800">
                                                                    {att.percentage}%
                                                                </td>
                                                                <td className="py-2 px-3">
                                                                    {att.passed ? (
                                                                        <span className="text-emerald-700 font-bold">
                                                                            {locale === 'ar' ? 'ناجح' : 'Passed'}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-red-600 font-medium">
                                                                            {locale === 'ar' ? 'راسب' : 'Failed'}
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="py-2 px-3 text-slate-500">
                                                                    {att.submitted_at || '-'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import {
    CheckCircle2,
    XCircle,
    Award,
    ArrowRight,
    ArrowLeft,
    Clock,
    FileText,
    BookOpen,
    GraduationCap,
    RotateCcw
} from 'lucide-react';

interface Props {
    attempt: {
        id: number;
        attempt_number: number;
        score: number;
        max_score: number;
        percentage: number;
        passed: boolean;
        status: string;
        time_spent_seconds?: number;
    };
    exam: {
        id: number;
        title_en: string;
        title_ar: string;
        passing_score: number;
        course: {
            slug: string;
            title_en: string;
            title_ar: string;
        };
    };
}

export default function StudentExamResult({ attempt, exam }: Props) {
    const { t, locale, isRtl } = useTranslation();
    const isPassed = attempt.passed;

    return (
        <AuthenticatedLayout
            title={locale === 'ar' ? 'نتيجة الاختبار' : 'Exam Result'}
            breadcrumb={locale === 'ar' ? 'تقرير التقييم' : 'Assessment Report'}
        >
            <Head title={`${locale === 'ar' ? 'نتيجة' : 'Result:'} ${locale === 'ar' ? exam.title_ar : exam.title_en} - SUCED`} />

            <div className="max-w-2xl mx-auto space-y-6 pt-4">
                {/* Result Hero Card */}
                <div
                    className={`p-8 rounded-3xl bg-white border-2 shadow-xl text-center space-y-6 ${
                        isPassed ? 'border-emerald-500' : 'border-amber-400'
                    }`}
                >
                    {/* Badge Icon */}
                    <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg ${
                            isPassed
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-amber-100 text-amber-600'
                        }`}
                    >
                        {isPassed ? (
                            <CheckCircle2 className="w-10 h-10" />
                        ) : (
                            <XCircle className="w-10 h-10" />
                        )}
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {locale === 'ar' ? exam.course.title_ar : exam.course.title_en}
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17365D]">
                            {isPassed
                                ? (locale === 'ar' ? 'تهانينا! لقد اجتزت الاختبار بنجاح' : 'Congratulations! Assessment Passed')
                                : (locale === 'ar' ? 'لم يتم بلوغ حد النجاح الأدنى' : 'Assessment Not Passed')}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                            {locale === 'ar'
                                ? `تم رصد نتيجة المحاولة رقم #${attempt.attempt_number} في ${exam.title_ar} بنجاح.`
                                : `Attempt #${attempt.attempt_number} for ${exam.title_en} has been officially recorded.`}
                        </p>
                    </div>

                    {/* Score Circle / Display */}
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-around gap-4">
                        <div>
                            <span className="text-xs font-semibold text-slate-500 block uppercase">
                                {locale === 'ar' ? 'الدرجة المحصلة' : 'Final Score'}
                            </span>
                            <span className="text-2xl sm:text-3xl font-black text-[#17365D]">
                                {attempt.score} <span className="text-sm font-semibold text-slate-400">/ {attempt.max_score}</span>
                            </span>
                        </div>

                        <div className="h-10 w-px bg-slate-200"></div>

                        <div>
                            <span className="text-xs font-semibold text-slate-500 block uppercase">
                                {locale === 'ar' ? 'النسبة المئوية' : 'Percentage'}
                            </span>
                            <span
                                className={`text-2xl sm:text-3xl font-black ${
                                    isPassed ? 'text-emerald-600' : 'text-amber-600'
                                }`}
                            >
                                {attempt.percentage}%
                            </span>
                        </div>

                        <div className="h-10 w-px bg-slate-200"></div>

                        <div>
                            <span className="text-xs font-semibold text-slate-500 block uppercase">
                                {locale === 'ar' ? 'حد النجاح' : 'Passing Mark'}
                            </span>
                            <span className="text-2xl sm:text-3xl font-black text-slate-700">
                                {exam.passing_score}%
                            </span>
                        </div>
                    </div>

                    {/* Additional Message / Certification */}
                    {isPassed ? (
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-3">
                            <Award className="w-6 h-6 text-emerald-600 shrink-0" />
                            <div className="text-left rtl:text-right">
                                <span className="font-bold block">
                                    {locale === 'ar' ? 'مؤهل لإصدار الشهادة الأكاديمية:' : 'Eligible for University Certificate:'}
                                </span>
                                <span>
                                    {locale === 'ar'
                                        ? 'إذا كانت جميع محاضرات الدورة مكتملة، يمكنك الآن الانتقال لاستعراض وتحميل شهادتك الرقمية المعتمدة.'
                                        : 'If all course lectures are completed, your verified certificate has been automatically issued.'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-3">
                            <RotateCcw className="w-5 h-5 text-amber-600 shrink-0" />
                            <div className="text-left rtl:text-right">
                                <span className="font-bold block">
                                    {locale === 'ar' ? 'يمكنك إعادة المحاولة لاحقاً:' : 'You can attempt again:'}
                                </span>
                                <span>
                                    {locale === 'ar'
                                        ? 'راجع المحاضرات ومحتوى الدورة وأعد المحاولة في إطار الحد الأقصى للمحاولات المسموحة.'
                                        : 'Review course materials and try again within your allowed attempts limit.'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                        <Link
                            href={route('student.learn', { course: exam.course.slug })}
                            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>{locale === 'ar' ? 'العودة للدورة' : 'Back to Classroom'}</span>
                        </Link>

                        <Link
                            href={route('student.certificates')}
                            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                            <Award className="w-4 h-4 text-[#D6A84F]" />
                            <span>{locale === 'ar' ? 'سجل شهاداتي' : 'My Certificates'}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

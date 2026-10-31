import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import {
    Clock,
    AlertCircle,
    CheckCircle2,
    HelpCircle,
    Send,
    ShieldAlert,
    BookOpen,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';

interface QuestionOption {
    id: number;
    question_id: number;
    option_text_en: string;
    option_text_ar: string;
    position: number;
}

interface Question {
    id: number;
    question_text_en: string;
    question_text_ar: string;
    question_type: string;
    points: number;
    position: number;
    options: QuestionOption[];
}

interface Props {
    exam: {
        id: number;
        title_en: string;
        title_ar: string;
        instructions_en?: string;
        instructions_ar?: string;
        duration_minutes: number;
        passing_score: number;
        course: {
            slug: string;
            title_en: string;
            title_ar: string;
        };
    };
    attempt: {
        id: number;
        attempt_number: number;
        started_at: string;
        expires_at: string;
        remaining_seconds: number;
    };
    questions: Question[];
    savedAnswers: Record<number, number>;
}

export default function StudentTakeExam({
    exam,
    attempt,
    questions,
    savedAnswers = {},
}: Props) {
    const { t, locale, isRtl } = useTranslation();
    const [timeLeft, setTimeLeft] = useState<number>(attempt.remaining_seconds);
    const [answers, setAnswers] = useState<Record<number, number>>(savedAnswers);
    const [submitting, setSubmitting] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);

    // Live countdown timer
    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const handleSelectOption = (questionId: number, optionId: number) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
    };

    const handleSubmit = () => {
        if (submitting) return;
        setSubmitting(true);
        setConfirmModal(false);

        router.post(
            route('student.exams.submit', { attempt: attempt.id }),
            { answers },
            {
                onFinish: () => setSubmitting(false),
            }
        );
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const answeredCount = Object.keys(answers).length;
    const totalCount = questions.length;
    const progressPercent = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
    const isUrgent = timeLeft < 120; // less than 2 mins

    return (
        <AuthenticatedLayout
            title={locale === 'ar' ? exam.title_ar : exam.title_en}
            breadcrumb={locale === 'ar' ? 'جلسة الاختبار' : 'Exam Session'}
        >
            <Head title={`${locale === 'ar' ? exam.title_ar : exam.title_en} - SUCED`} />

            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Fixed Top Bar for Exam Session */}
                <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-md flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            {locale === 'ar' ? exam.course.title_ar : exam.course.title_en}
                        </span>
                        <h1 className="text-base sm:text-lg font-bold text-[#17365D] truncate">
                            {locale === 'ar' ? exam.title_ar : exam.title_en}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        {/* Progress */}
                        <div className="hidden sm:block text-right">
                            <span className="text-[11px] font-semibold text-slate-500 block">
                                {locale === 'ar' ? 'الأسئلة المجابة' : 'Answered'}
                            </span>
                            <span className="text-xs font-bold text-[#17365D]">
                                {answeredCount} / {totalCount}
                            </span>
                        </div>

                        {/* Countdown Clock */}
                        <div
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm sm:text-base font-bold shadow-inner ${
                                isUrgent
                                    ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
                                    : 'bg-slate-100 text-[#17365D] border border-slate-200'
                            }`}
                        >
                            <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-500' : 'text-[#2563A6]'}`} />
                            <span>{formatTime(timeLeft)}</span>
                        </div>

                        {/* Finish Button */}
                        <button
                            onClick={() => setConfirmModal(true)}
                            disabled={submitting}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                            <Send className="w-3.5 h-3.5" />
                            <span>{locale === 'ar' ? 'تسليم الاختبار' : 'Submit'}</span>
                        </button>
                    </div>
                </div>

                {/* Instructions Card */}
                {(exam.instructions_en || exam.instructions_ar) && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold block">
                                {locale === 'ar' ? 'تعليمات الاختبار الأكاديمي:' : 'Exam Instructions:'}
                            </span>
                            <p className="mt-0.5 leading-relaxed">
                                {locale === 'ar' ? exam.instructions_ar : exam.instructions_en}
                            </p>
                        </div>
                    </div>
                )}

                {/* Questions List */}
                <div className="space-y-6">
                    {questions.map((q, qIndex) => {
                        const selectedOptionId = answers[q.id];
                        const isAnswered = selectedOptionId !== undefined;

                        return (
                            <div
                                key={q.id}
                                className={`p-6 rounded-2xl bg-white border shadow-sm transition-all ${
                                    isAnswered
                                        ? 'border-slate-300'
                                        : 'border-slate-200 hover:border-blue-300'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-7 h-7 rounded-lg bg-[#17365D] text-white flex items-center justify-center text-xs font-bold font-mono">
                                            {q.position || qIndex + 1}
                                        </span>
                                        <span className="text-xs font-semibold uppercase text-slate-500">
                                            {q.question_type === 'true_false'
                                                ? (locale === 'ar' ? 'صح / خطأ' : 'True / False')
                                                : (locale === 'ar' ? 'اختيار من متعدد' : 'Multiple Choice')}
                                        </span>
                                    </div>

                                    <span className="text-xs font-bold text-slate-400">
                                        {q.points} {locale === 'ar' ? 'درجة' : 'pts'}
                                    </span>
                                </div>

                                <div className="py-4">
                                    <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                                        {locale === 'ar' ? q.question_text_ar : q.question_text_en}
                                    </p>
                                </div>

                                {/* Options */}
                                <div className="space-y-2.5 pt-2">
                                    {q.options.map((opt) => {
                                        const isChecked = selectedOptionId === opt.id;

                                        return (
                                            <label
                                                key={opt.id}
                                                onClick={() => handleSelectOption(q.id, opt.id)}
                                                className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                                                    isChecked
                                                        ? 'bg-blue-50/80 border-[#2563A6] text-[#17365D] font-semibold shadow-sm'
                                                        : 'bg-slate-50/50 hover:bg-slate-100/60 border-slate-200 text-slate-700'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question_${q.id}`}
                                                    checked={isChecked}
                                                    onChange={() => handleSelectOption(q.id, opt.id)}
                                                    className="w-4 h-4 text-[#2563A6] focus:ring-[#2563A6]"
                                                />
                                                <span className="flex-1">
                                                    {locale === 'ar' ? opt.option_text_ar : opt.option_text_en}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Submit Strip */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-500">
                        {locale === 'ar' ? 'تمت الإجابة على ' : 'Completed '}
                        <strong className="text-slate-900">{answeredCount}</strong> {locale === 'ar' ? 'من أصل ' : 'of '}
                        <strong className="text-slate-900">{totalCount}</strong> {locale === 'ar' ? 'سؤالاً.' : 'questions.'}
                    </div>

                    <button
                        onClick={() => setConfirmModal(true)}
                        disabled={submitting}
                        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{locale === 'ar' ? 'تأكيد وتسليم الإجابات الآن' : 'Confirm & Submit Exam'}</span>
                    </button>
                </div>

                {/* Confirmation Modal */}
                {confirmModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-scaleUp">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                                <Send className="w-6 h-6" />
                            </div>

                            <div className="text-center space-y-2">
                                <h3 className="text-lg font-bold text-slate-900">
                                    {locale === 'ar' ? 'هل أنت متأكد من رغبتك في التسليم؟' : 'Ready to Submit Your Exam?'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {answeredCount < totalCount ? (
                                        <span className="text-amber-600 font-semibold block">
                                            {locale === 'ar'
                                                ? `تنبيه: لقد أجبت على ${answeredCount} من أصل ${totalCount} أسئلة فقط!`
                                                : `Warning: You have only answered ${answeredCount} of ${totalCount} questions!`}
                                        </span>
                                    ) : null}
                                    {locale === 'ar'
                                        ? 'بمجرد التسليم، سيتم رصد نتيجتك النهائية إلكترونياً ولا يمكنك التراجع.'
                                        : 'Once submitted, your final score will be calculated immediately on the server.'}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={() => setConfirmModal(false)}
                                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                                >
                                    {locale === 'ar' ? 'متابعة المراجعة' : 'Review Answers'}
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-md flex items-center justify-center gap-1.5"
                                >
                                    <span>{submitting ? (locale === 'ar' ? 'جاري الرصد...' : 'Grading...') : (locale === 'ar' ? 'نعم، تسليم' : 'Yes, Submit')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

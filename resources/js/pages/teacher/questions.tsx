import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import {
    ListChecks,
    Plus,
    Trash2,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    ArrowRight,
    HelpCircle,
    X,
    BookOpen
} from 'lucide-react';

interface QuestionOptionItem {
    id: number;
    option_text_en: string;
    option_text_ar: string;
    is_correct: boolean;
    position: number;
}

interface QuestionItem {
    id: number;
    question_text_en: string;
    question_text_ar: string;
    question_type: string;
    points: number;
    position: number;
    explanation_en?: string;
    explanation_ar?: string;
    options: QuestionOptionItem[];
}

interface ExamInfo {
    id: number;
    title_en: string;
    title_ar: string;
    course: {
        id: number;
        title_en: string;
        title_ar: string;
    };
}

interface Props {
    exam: ExamInfo;
    questions: QuestionItem[];
}

export default function TeacherQuestions({ exam, questions }: Props) {
    const { t, locale, isRtl } = useTranslation();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [questionType, setQuestionType] = useState<'multiple_choice' | 'true_false'>('multiple_choice');

    // MCQ option state: 4 options
    const [mcqOptions, setMcqOptions] = useState([
        { option_text_en: '', option_text_ar: '', is_correct: true },
        { option_text_en: '', option_text_ar: '', is_correct: false },
        { option_text_en: '', option_text_ar: '', is_correct: false },
        { option_text_en: '', option_text_ar: '', is_correct: false },
    ]);

    // True False option state
    const [tfCorrect, setTfCorrect] = useState<'true' | 'false'>('true');

    const { data, setData, post, processing, errors, reset } = useForm({
        question_text_en: '',
        question_text_ar: '',
        question_type: 'multiple_choice',
        points: 1,
        explanation_en: '',
        explanation_ar: '',
        options: [] as Array<{ option_text_en: string; option_text_ar: string; is_correct: boolean }>,
    });

    const handleCreateQuestion = (e: React.FormEvent) => {
        e.preventDefault();

        let finalOptions: Array<{ option_text_en: string; option_text_ar: string; is_correct: boolean }> = [];

        if (questionType === 'multiple_choice') {
            finalOptions = mcqOptions;
        } else {
            finalOptions = [
                {
                    option_text_en: 'True',
                    option_text_ar: 'صواب',
                    is_correct: tfCorrect === 'true',
                },
                {
                    option_text_en: 'False',
                    option_text_ar: 'خطأ',
                    is_correct: tfCorrect === 'false',
                },
            ];
        }

        router.post(
            route('teacher.questions.store', { exam: exam.id }),
            {
                question_text_en: data.question_text_en,
                question_text_ar: data.question_text_ar,
                question_type: questionType,
                points: data.points,
                explanation_en: data.explanation_en,
                explanation_ar: data.explanation_ar,
                options: finalOptions,
            },
            {
                onSuccess: () => {
                    setIsAddModalOpen(false);
                    reset();
                },
            }
        );
    };

    const handleDeleteQuestion = (questionId: number) => {
        if (confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذا السؤال؟' : 'Are you sure you want to delete this question?')) {
            router.delete(route('teacher.questions.delete', { question: questionId }), {
                preserveScroll: true,
            });
        }
    };

    const setCorrectMcqOption = (index: number) => {
        setMcqOptions((prev) =>
            prev.map((opt, i) => ({
                ...opt,
                is_correct: i === index,
            }))
        );
    };

    return (
        <AuthenticatedLayout
            title={`${locale === 'ar' ? 'بنك أسئلة' : 'Questions:'} ${locale === 'ar' ? exam.title_ar : exam.title_en}`}
            breadcrumb={locale === 'ar' ? 'بنك الأسئلة' : 'Question Bank'}
        >
            <Head title={`${locale === 'ar' ? 'أسئلة' : 'Questions:'} ${locale === 'ar' ? exam.title_ar : exam.title_en} - SUCED`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded bg-[#17365D] text-white text-xs font-mono font-bold">
                                {locale === 'ar' ? exam.course?.title_ar : exam.course?.title_en}
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">
                                {questions.length} {locale === 'ar' ? 'سؤال مبرمج' : 'questions configured'}
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-[#17365D]">
                            {locale === 'ar' ? exam.title_ar : exam.title_en}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route('teacher.exams')}
                            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                        >
                            {locale === 'ar' ? 'العودة للاختبارات' : 'Back to Exams'}
                        </Link>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-5 py-2.5 rounded-xl bg-[#2563A6] hover:bg-[#17365D] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            <span>{locale === 'ar' ? 'إضافة سؤال جديد' : 'Add Question'}</span>
                        </button>
                    </div>
                </div>

                {/* Questions List */}
                {questions.length === 0 ? (
                    <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                        <ListChecks className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="font-bold text-slate-800 text-base">
                            {locale === 'ar' ? 'لم يتم إضافة أسئلة لهذا الاختبار بعد' : 'No Questions in this Exam'}
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            {locale === 'ar'
                                ? 'أضف أسئلة متعددة الاختيارات أو أسئلة الصواب والخطأ لبدء تفعيل الاختبار للطلاب.'
                                : 'Add multiple-choice or true/false questions to prepare this examination for students.'}
                        </p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-semibold transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span>{locale === 'ar' ? 'إضافة أول سؤال' : 'Add First Question'}</span>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {questions.map((q, index) => (
                            <div
                                key={q.id}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-slate-300 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-[#17365D] text-white flex items-center justify-center text-xs font-bold font-mono">
                                            {index + 1}
                                        </span>
                                        <div>
                                            <span className="text-[11px] font-bold uppercase text-[#2563A6]">
                                                {q.question_type === 'true_false'
                                                    ? (locale === 'ar' ? 'صح / خطأ' : 'True / False')
                                                    : (locale === 'ar' ? 'اختيار من متعدد' : 'Multiple Choice')}
                                            </span>
                                            <span className="text-xs text-slate-400 mx-2">•</span>
                                            <span className="text-xs font-semibold text-slate-500">
                                                {q.points} {locale === 'ar' ? 'درجة' : 'pts'}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDeleteQuestion(q.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                        title={locale === 'ar' ? 'حذف السؤال' : 'Delete question'}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-[#17365D]">
                                        {locale === 'ar' ? q.question_text_ar : q.question_text_en}
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        {locale === 'ar' ? q.question_text_en : q.question_text_ar}
                                    </p>
                                </div>

                                {/* Options breakdown with correct answer highlighted */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                                    {q.options.map((opt) => (
                                        <div
                                            key={opt.id}
                                            className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                                                opt.is_correct
                                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                                    : 'bg-slate-50 border-slate-100 text-slate-700'
                                            }`}
                                        >
                                            <span>{locale === 'ar' ? opt.option_text_ar : opt.option_text_en}</span>
                                            {opt.is_correct && (
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] uppercase font-bold shrink-0">
                                                    {locale === 'ar' ? 'الإجابة الصحيحة ✓' : 'Correct ✓'}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Question Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-[#2563A6]" />
                                    <h3 className="font-bold text-slate-900 text-base">
                                        {locale === 'ar' ? 'إضافة سؤال جديد للتقييم' : 'Add Examination Question'}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateQuestion} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'نوع السؤال' : 'Question Type'}
                                        </label>
                                        <select
                                            value={questionType}
                                            onChange={(e) => setQuestionType(e.target.value as any)}
                                            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563A6]"
                                        >
                                            <option value="multiple_choice">{locale === 'ar' ? 'اختيار من متعدد' : 'Multiple Choice'}</option>
                                            <option value="true_false">{locale === 'ar' ? 'صح / خطأ' : 'True / False'}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'الدرجات (Points)' : 'Points'}
                                        </label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0.5"
                                            value={data.points}
                                            onChange={(e) => setData('points', parseFloat(e.target.value) || 1)}
                                            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        {locale === 'ar' ? 'نص السؤال (بالعربية) *' : 'Question Text (Arabic) *'}
                                    </label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={data.question_text_ar}
                                        onChange={(e) => setData('question_text_ar', e.target.value)}
                                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563A6]"
                                        placeholder="اكتب السؤال باللغة العربية..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        {locale === 'ar' ? 'نص السؤال (بالإنجليزية) *' : 'Question Text (English) *'}
                                    </label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={data.question_text_en}
                                        onChange={(e) => setData('question_text_en', e.target.value)}
                                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563A6]"
                                        placeholder="Write the question in English..."
                                    ></textarea>
                                </div>

                                {/* Answers Section */}
                                {questionType === 'multiple_choice' ? (
                                    <div className="space-y-3 pt-2">
                                        <span className="text-xs font-bold uppercase text-slate-700 block">
                                            {locale === 'ar' ? 'خيارات الإجابة (حدد الإجابة الصحيحة بالدائرة):' : 'Options (Check radio for correct answer):'}
                                        </span>
                                        {mcqOptions.map((opt, idx) => (
                                            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#17365D]">
                                                        <input
                                                            type="radio"
                                                            name="correct_option"
                                                            checked={opt.is_correct}
                                                            onChange={() => setCorrectMcqOption(idx)}
                                                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                                                        />
                                                        <span>{locale === 'ar' ? `الخيار #${idx + 1}` : `Option #${idx + 1}`}</span>
                                                        {opt.is_correct && (
                                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                                                {locale === 'ar' ? 'الإجابة الصحيحة' : 'Correct Answer'}
                                                            </span>
                                                        )}
                                                    </label>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder={locale === 'ar' ? 'النص بالعربية' : 'Arabic Text'}
                                                        value={opt.option_text_ar}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setMcqOptions((prev) =>
                                                                prev.map((o, i) => (i === idx ? { ...o, option_text_ar: val } : o))
                                                            );
                                                        }}
                                                        className="w-full text-xs p-2 rounded-lg border border-slate-200"
                                                    />
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder={locale === 'ar' ? 'النص بالإنجليزية' : 'English Text'}
                                                        value={opt.option_text_en}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setMcqOptions((prev) =>
                                                                prev.map((o, i) => (i === idx ? { ...o, option_text_en: val } : o))
                                                            );
                                                        }}
                                                        className="w-full text-xs p-2 rounded-lg border border-slate-200"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2 pt-2">
                                        <span className="text-xs font-bold uppercase text-slate-700 block">
                                            {locale === 'ar' ? 'الإجابة الصحيحة لسؤال الصواب والخطأ:' : 'Correct Answer for True/False:'}
                                        </span>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setTfCorrect('true')}
                                                className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                                    tfCorrect === 'true'
                                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                                        : 'bg-slate-50 border-slate-200 text-slate-600'
                                                }`}
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>{locale === 'ar' ? 'صواب (True)' : 'True'}</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setTfCorrect('false')}
                                                className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                                    tfCorrect === 'false'
                                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                                        : 'bg-slate-50 border-slate-200 text-slate-600'
                                                }`}
                                            >
                                                <XCircle className="w-4 h-4" />
                                                <span>{locale === 'ar' ? 'خطأ (False)' : 'False'}</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                                    >
                                        {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2.5 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-bold transition-colors shadow-sm"
                                    >
                                        {locale === 'ar' ? 'إضافة السؤال للبنك' : 'Save Question'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

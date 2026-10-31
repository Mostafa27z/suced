import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import {
    FileText,
    Plus,
    Clock,
    CheckCircle2,
    ListChecks,
    X,
    Users,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';

interface ExamItem {
    id: number;
    course_id: number;
    title_en: string;
    title_ar: string;
    instructions_en?: string;
    instructions_ar?: string;
    duration_minutes: number;
    passing_score: number;
    max_attempts: number;
    is_final: boolean;
    is_published: boolean;
    course: {
        id: number;
        title_en: string;
        title_ar: string;
    };
    questions_count: number;
    attempts_count: number;
}

interface CourseOption {
    id: number;
    title_en: string;
    title_ar: string;
}

interface Props {
    exams: {
        data: ExamItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    courses: CourseOption[];
}

export default function TeacherExams({ exams, courses }: Props) {
    const { t, locale, isRtl } = useTranslation();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<number>(courses[0]?.id || 0);

    const { data, setData, post, processing, errors, reset } = useForm({
        title_en: '',
        title_ar: '',
        instructions_en: '',
        instructions_ar: '',
        duration_minutes: 30,
        passing_score: 70,
        max_attempts: 3,
        is_final: true,
        is_published: true,
    });

    const handleCreateExam = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourseId) return;

        post(route('teacher.exams.store', { course: selectedCourseId }), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            title={locale === 'ar' ? 'إدارة بنك الاختبارات' : 'Exam & Assessment Management'}
            breadcrumb={locale === 'ar' ? 'الاختبارات' : 'Exams'}
        >
            <Head title={locale === 'ar' ? 'إدارة الاختبارات - SUCED' : 'Manage Exams - SUCED'} />

            <div className="space-y-6">
                {/* Header Strip */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-[#17365D]">
                            {locale === 'ar' ? 'الاختبارات والتقييمات الأكاديمية' : 'Course Examinations & Assessments'}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            {locale === 'ar'
                                ? `لديك ${exams.total} اختبار مبرمج لمقرراتك التدريبية.`
                                : `You have ${exams.total} examinations authored for your courses.`}
                        </p>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        disabled={courses.length === 0}
                        className="px-5 py-2.5 rounded-xl bg-[#2563A6] hover:bg-[#17365D] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md shrink-0 disabled:opacity-50"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{locale === 'ar' ? 'إنشاء اختبار جديد' : 'Create New Exam'}</span>
                    </button>
                </div>

                {/* Exams List */}
                {exams.data.length === 0 ? (
                    <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="font-bold text-slate-800 text-base">
                            {locale === 'ar' ? 'لا توجد اختبارات مسجلة حتى الآن' : 'No Exams Created Yet'}
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            {locale === 'ar'
                                ? 'أنشئ أول اختبار أكاديمي وأضف بنك الأسئلة المعتمدة ليتمكن الطلاب من التقييم.'
                                : 'Create your first course assessment and add question items for auto-grading.'}
                        </p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-semibold transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span>{locale === 'ar' ? 'إنشاء اختبار' : 'Create Exam'}</span>
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'عنوان الاختبار' : 'Exam Title'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'المقرر' : 'Course'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'المدة' : 'Duration'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'الأسئلة' : 'Questions'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'المحاولات' : 'Attempts'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                                        <th className="py-3 px-4 text-right">{locale === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {exams.data.map((ex) => (
                                        <tr key={ex.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3.5 px-4">
                                                <div className="font-bold text-[#17365D]">
                                                    {locale === 'ar' ? ex.title_ar : ex.title_en}
                                                </div>
                                                <div className="text-[11px] text-slate-400">
                                                    {ex.is_final ? (locale === 'ar' ? 'امتحان نهائي شامل' : 'Comprehensive Final Exam') : (locale === 'ar' ? 'كويز فصلي' : 'Module Quiz')}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                                                {locale === 'ar' ? ex.course?.title_ar : ex.course?.title_en}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                                                {ex.duration_minutes} {locale === 'ar' ? 'دقيقة' : 'm'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#2563A6] text-xs font-bold font-mono">
                                                    {ex.questions_count} {locale === 'ar' ? 'سؤال' : 'items'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                                                {ex.attempts_count} {locale === 'ar' ? 'تسليم' : 'submissions'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                        ex.is_published
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-slate-100 text-slate-500'
                                                    }`}
                                                >
                                                    {ex.is_published
                                                        ? (locale === 'ar' ? 'منشور' : 'Published')
                                                        : (locale === 'ar' ? 'مسودة' : 'Draft')}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <Link
                                                    href={route('teacher.exams.questions', { exam: ex.id })}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-semibold transition-colors shadow-sm"
                                                >
                                                    <ListChecks className="w-3.5 h-3.5" />
                                                    <span>{locale === 'ar' ? 'بنك الأسئلة' : 'Questions'}</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Create Exam Modal */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-amber-600" />
                                    <h3 className="font-bold text-slate-900 text-base">
                                        {locale === 'ar' ? 'إعداد اختبار جديد' : 'Create New Assessment'}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateExam} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        {locale === 'ar' ? 'المقرر الدراسي المكلف به *' : 'Assigned Course *'}
                                    </label>
                                    <select
                                        value={selectedCourseId}
                                        onChange={(e) => setSelectedCourseId(parseInt(e.target.value))}
                                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563A6]"
                                    >
                                        {courses.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {locale === 'ar' ? c.title_ar : c.title_en}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        {locale === 'ar' ? 'عنوان الاختبار (بالعربية) *' : 'Exam Title (Arabic) *'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.title_ar}
                                        onChange={(e) => setData('title_ar', e.target.value)}
                                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563A6]"
                                        placeholder="مثال: الاختبار النهائي في إدارة المشروعات..."
                                    />
                                    {errors.title_ar && <span className="text-xs text-red-600">{errors.title_ar}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        {locale === 'ar' ? 'عنوان الاختبار (بالإنجليزية) *' : 'Exam Title (English) *'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.title_en}
                                        onChange={(e) => setData('title_en', e.target.value)}
                                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563A6]"
                                        placeholder="e.g., Final Examination in Project Management..."
                                    />
                                    {errors.title_en && <span className="text-xs text-red-600">{errors.title_en}</span>}
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'المدة (دقائق)' : 'Duration (mins)'}
                                        </label>
                                        <input
                                            type="number"
                                            min={5}
                                            max={180}
                                            value={data.duration_minutes}
                                            onChange={(e) => setData('duration_minutes', parseInt(e.target.value) || 30)}
                                            className="w-full text-xs sm:text-sm p-2 rounded-xl border border-slate-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'النجاح (%)' : 'Pass (%)'}
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={100}
                                            value={data.passing_score}
                                            onChange={(e) => setData('passing_score', parseInt(e.target.value) || 70)}
                                            className="w-full text-xs sm:text-sm p-2 rounded-xl border border-slate-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'المحاولات' : 'Max Attempts'}
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={10}
                                            value={data.max_attempts}
                                            onChange={(e) => setData('max_attempts', parseInt(e.target.value) || 3)}
                                            className="w-full text-xs sm:text-sm p-2 rounded-xl border border-slate-200"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        {locale === 'ar' ? 'التعليمات الأكاديمية (بالعربية)' : 'Instructions (Arabic)'}
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={data.instructions_ar}
                                        onChange={(e) => setData('instructions_ar', e.target.value)}
                                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563A6]"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        {locale === 'ar' ? 'التعليمات الأكاديمية (بالإنجليزية)' : 'Instructions (English)'}
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={data.instructions_en}
                                        onChange={(e) => setData('instructions_en', e.target.value)}
                                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563A6]"
                                    ></textarea>
                                </div>

                                <div className="flex items-center gap-4 pt-1">
                                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_final}
                                            onChange={(e) => setData('is_final', e.target.checked)}
                                            className="w-4 h-4 text-[#2563A6] rounded"
                                        />
                                        <span>{locale === 'ar' ? 'امتحان نهائي لمنح الشهادة' : 'Final Exam for Certificate'}</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_published}
                                            onChange={(e) => setData('is_published', e.target.checked)}
                                            className="w-4 h-4 text-[#2563A6] rounded"
                                        />
                                        <span>{locale === 'ar' ? 'نشر فوري' : 'Publish Immediately'}</span>
                                    </label>
                                </div>

                                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                                    >
                                        {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-2.5 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-bold transition-colors shadow-sm"
                                    >
                                        {processing
                                            ? (locale === 'ar' ? 'جاري الإنشاء...' : 'Creating...')
                                            : (locale === 'ar' ? 'إنشاء وحفظ' : 'Create Exam')}
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

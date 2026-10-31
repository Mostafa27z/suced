import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import {
    Video,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    ArrowLeft,
    ArrowRight,
    Play,
    Clock,
    X,
    CheckCircle2,
    BookOpen
} from 'lucide-react';

interface LectureItem {
    id: number;
    position: number;
    title_en: string;
    title_ar: string;
    description_en?: string;
    description_ar?: string;
    youtube_url: string;
    embed_url?: string;
    duration_minutes: number;
    is_published: boolean;
}

interface CourseItem {
    id: number;
    slug: string;
    code: string;
    title_en: string;
    title_ar: string;
}

interface Props {
    course: CourseItem;
    lectures: LectureItem[];
}

export default function TeacherLectures({ course, lectures }: Props) {
    const { t, locale, isRtl } = useTranslation();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [previewLecture, setPreviewLecture] = useState<LectureItem | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title_en: '',
        title_ar: '',
        description_en: '',
        description_ar: '',
        youtube_url: '',
        duration_minutes: 30,
        position: lectures.length + 1,
        is_published: true,
    });

    const handleCreateLecture = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('teacher.lectures.store', { course: course.id }), {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    const handleTogglePublish = (lectureId: number) => {
        router.post(route('teacher.lectures.toggle-publish', { lecture: lectureId }), {}, {
            preserveScroll: true,
        });
    };

    const handleDeleteLecture = (lectureId: number) => {
        if (confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذه المحاضرة؟' : 'Are you sure you want to delete this lecture?')) {
            router.delete(route('teacher.lectures.delete', { lecture: lectureId }), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            title={`${locale === 'ar' ? 'إدارة محاضرات' : 'Manage Lectures:'} ${locale === 'ar' ? course.title_ar : course.title_en}`}
            breadcrumb={locale === 'ar' ? 'المحاضرات' : 'Lectures'}
        >
            <Head title={`${locale === 'ar' ? 'محاضرات' : 'Lectures:'} ${locale === 'ar' ? course.title_ar : course.title_en} - SUCED`} />

            <div className="space-y-6">
                {/* Header Strip */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded bg-[#17365D] text-white text-xs font-mono font-bold">
                                {course.code}
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">
                                {lectures.length} {locale === 'ar' ? 'محاضرة مسجلة' : 'lectures logged'}
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-[#17365D]">
                            {locale === 'ar' ? course.title_ar : course.title_en}
                        </h1>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#2563A6] hover:bg-[#17365D] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{locale === 'ar' ? 'إضافة محاضرة جديدة' : 'Add New Lecture'}</span>
                    </button>
                </div>

                {/* Lectures Ordered Table */}
                {lectures.length === 0 ? (
                    <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                        <Video className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="font-bold text-slate-800 text-base">
                            {locale === 'ar' ? 'لم يتم إضافة أي محاضرات بعد' : 'No Lectures Added Yet'}
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            {locale === 'ar'
                                ? 'ابدأ بإضافة المحاضرات المسجلة على YouTube وترتيبها حسب الخطة الدراسية.'
                                : 'Add your hosted YouTube video lectures in the correct syllabus sequence.'}
                        </p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-semibold transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span>{locale === 'ar' ? 'إضافة أول محاضرة' : 'Add First Lecture'}</span>
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th className="py-3 px-4 w-16 text-center">{locale === 'ar' ? 'الترتيب' : '#' }</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'عنوان المحاضرة' : 'Lecture Title'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'المدة' : 'Duration'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'رابط الفيديو' : 'YouTube Link'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'حالة النشر' : 'Status'}</th>
                                        <th className="py-3 px-4 text-right">{locale === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {lectures.map((lec) => (
                                        <tr key={lec.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                                                {lec.position}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-[#17365D]">
                                                    {locale === 'ar' ? lec.title_ar : lec.title_en}
                                                </div>
                                                <div className="text-xs text-slate-400 truncate max-w-xs">
                                                    {locale === 'ar' ? lec.title_en : lec.title_ar}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                                                {lec.duration_minutes} {locale === 'ar' ? 'دقيقة' : 'mins'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <a
                                                    href={lec.youtube_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-[#2563A6] hover:underline font-mono truncate max-w-[200px] block"
                                                >
                                                    {lec.youtube_url}
                                                </a>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <button
                                                    onClick={() => handleTogglePublish(lec.id)}
                                                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                                                        lec.is_published
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : 'bg-slate-100 text-slate-500'
                                                    }`}
                                                >
                                                    {lec.is_published
                                                        ? (locale === 'ar' ? 'منشور' : 'Published')
                                                        : (locale === 'ar' ? 'مسودة' : 'Draft')}
                                                </button>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {lec.embed_url && (
                                                        <button
                                                            onClick={() => setPreviewLecture(lec)}
                                                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                                            title={locale === 'ar' ? 'معاينة الفيديو' : 'Preview video'}
                                                        >
                                                            <Play className="w-3.5 h-3.5 fill-current" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteLecture(lec.id)}
                                                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                                        title={locale === 'ar' ? 'حذف المحاضرة' : 'Delete lecture'}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Add Lecture Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Video className="w-5 h-5 text-[#2563A6]" />
                                    <h3 className="font-bold text-slate-900 text-base">
                                        {locale === 'ar' ? 'إضافة محاضرة يوتيوب جديدة' : 'Add YouTube Lecture'}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateLecture} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        {locale === 'ar' ? 'عنوان المحاضرة (بالعربية) *' : 'Lecture Title (Arabic) *'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.title_ar}
                                        onChange={(e) => setData('title_ar', e.target.value)}
                                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563A6]"
                                        placeholder="مثال: مقدمة في خوارزميات التعلم العميق..."
                                    />
                                    {errors.title_ar && <span className="text-xs text-red-600">{errors.title_ar}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        {locale === 'ar' ? 'عنوان المحاضرة (بالإنجليزية) *' : 'Lecture Title (English) *'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.title_en}
                                        onChange={(e) => setData('title_en', e.target.value)}
                                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563A6]"
                                        placeholder="e.g., Intro to Deep Learning Algorithms..."
                                    />
                                    {errors.title_en && <span className="text-xs text-red-600">{errors.title_en}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        {locale === 'ar' ? 'رابط يوتيوب (YouTube URL) *' : 'YouTube URL *'}
                                    </label>
                                    <input
                                        type="url"
                                        required
                                        value={data.youtube_url}
                                        onChange={(e) => setData('youtube_url', e.target.value)}
                                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563A6] font-mono"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                    {errors.youtube_url && <span className="text-xs text-red-600">{errors.youtube_url}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'المدة التقديرية (دقائق)' : 'Duration (Mins)'}
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={data.duration_minutes}
                                            onChange={(e) => setData('duration_minutes', parseInt(e.target.value) || 0)}
                                            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563A6]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'الترتيب الأكاديمي' : 'Sequence Position'}
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={data.position}
                                            onChange={(e) => setData('position', parseInt(e.target.value) || 1)}
                                            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563A6]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        {locale === 'ar' ? 'الوصف (بالعربية)' : 'Description (Arabic)'}
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={data.description_ar}
                                        onChange={(e) => setData('description_ar', e.target.value)}
                                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563A6]"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        {locale === 'ar' ? 'الوصف (بالإنجليزية)' : 'Description (English)'}
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={data.description_en}
                                        onChange={(e) => setData('description_en', e.target.value)}
                                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563A6]"
                                    ></textarea>
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    <input
                                        type="checkbox"
                                        id="is_published"
                                        checked={data.is_published}
                                        onChange={(e) => setData('is_published', e.target.checked)}
                                        className="w-4 h-4 text-[#2563A6] rounded focus:ring-[#2563A6]"
                                    />
                                    <label htmlFor="is_published" className="text-xs font-semibold text-slate-700 cursor-pointer">
                                        {locale === 'ar' ? 'نشر المحاضرة فوراً للطلاب المسجلين' : 'Publish immediately to enrolled students'}
                                    </label>
                                </div>

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
                                        disabled={processing}
                                        className="flex-1 py-2.5 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-bold transition-colors shadow-sm"
                                    >
                                        {processing
                                            ? (locale === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                                            : (locale === 'ar' ? 'حفظ المحاضرة' : 'Save Lecture')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Video Preview Modal */}
                {previewLecture && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 animate-scaleUp">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-slate-900 text-base">
                                    {locale === 'ar' ? previewLecture.title_ar : previewLecture.title_en}
                                </h3>
                                <button
                                    onClick={() => setPreviewLecture(null)}
                                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-inner">
                                <iframe
                                    src={previewLecture.embed_url}
                                    title="Lecture Preview"
                                    className="w-full h-full border-0"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import {
    BookOpen,
    Plus,
    Search,
    Edit3,
    Trash2,
    Users,
    Video,
    FileText,
    X,
    CheckCircle2,
    Award,
    Palette,
    Sliders,
    Download,
    Eye,
    Sparkles,
    Check
} from 'lucide-react';

interface TeacherOption {
    id: number;
    name: string;
    email: string;
}

export interface CertificateTemplateData {
    theme: 'classic_navy' | 'royal_gold' | 'emerald_heritage' | 'burgundy_excellence' | 'slate_modern';
    border_style: 'classic_double' | 'modern_clean' | 'vintage_ornate';
    org_name_en: string;
    org_name_ar?: string;
    center_name_en?: string;
    center_name_ar?: string;
    certificate_title_en: string;
    certificate_title_ar?: string;
    introduction_text_en?: string;
    introduction_text_ar?: string;
    completion_text_en?: string;
    completion_text_ar?: string;
    signatory1_name: string;
    signatory1_title: string;
    signatory1_name_ar?: string;
    signatory1_title_ar?: string;
    signatory2_name: string;
    signatory2_title: string;
    signatory2_name_ar?: string;
    signatory2_title_ar?: string;
    show_qr: boolean;
    show_grade: boolean;
    show_watermark: boolean;
}

interface CourseItem {
    id: number;
    slug: string;
    code: string;
    title_en: string;
    title_ar: string;
    description_en?: string;
    description_ar?: string;
    thumbnail?: string;
    duration_hours: number;
    passing_score: number;
    is_published: boolean;
    students_count: number;
    lectures_count: number;
    exams_count: number;
    teachers: Array<{ id: number; name: string }>;
    certificate_template?: CertificateTemplateData;
    effective_certificate_template?: CertificateTemplateData;
}

interface Props {
    courses: {
        data: CourseItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    teachers: TeacherOption[];
    filters: {
        search: string;
        status: string;
    };
}

const DEFAULT_CERT_TEMPLATE: CertificateTemplateData = {
    theme: 'classic_navy',
    border_style: 'classic_double',
    org_name_en: 'Sohag University',
    org_name_ar: 'جامعة سوهاج',
    center_name_en: 'Center for Continuing Education & Development (SUCED)',
    center_name_ar: 'مركز التعليم المستمر وتطوير القدرات',
    certificate_title_en: 'Certificate of Completion',
    certificate_title_ar: 'شهادة إتمام معتمدة',
    introduction_text_en: 'This is officially certified to acknowledge that',
    introduction_text_ar: 'تشهد إدارة مركز التعليم المستمر وتطوير القدرات بجامعة سوهاج بأن الطالب / المتدرب',
    completion_text_en: 'has successfully completed all prescribed coursework, assessments, and requirements for',
    completion_text_ar: 'قد اجتاز بنجاح متطلبات واختبارات المقرر التدريبي المعتمد والموسوم بعنوان',
    signatory1_name: 'Dr. Mostafa Kamel',
    signatory1_title: 'Director of Continuing Education',
    signatory1_name_ar: 'د. مصطفى كامل',
    signatory1_title_ar: 'مدير مركز التعليم المستمر',
    signatory2_name: 'Prof. Dr. Hassan El-Noubi',
    signatory2_title: 'President, Sohag University',
    signatory2_name_ar: 'أ.د. حسان النعماني',
    signatory2_title_ar: 'رئيس الجامعة',
    show_qr: true,
    show_grade: true,
    show_watermark: true,
};

const THEME_OPTIONS = [
    {
        id: 'classic_navy',
        name_en: 'Academic Navy',
        name_ar: 'الأزرق الأكاديمي والذهبي',
        primary: '#17365D',
        accent: '#D6A84F',
        secondary: '#2563A6',
        bg: '#FFFFFF',
    },
    {
        id: 'royal_gold',
        name_en: 'Royal Gold',
        name_ar: 'الذهبي الملكي والبرونزي',
        primary: '#78350F',
        accent: '#D97706',
        secondary: '#B45309',
        bg: '#FFFDF7',
    },
    {
        id: 'emerald_heritage',
        name_en: 'Emerald Heritage',
        name_ar: 'الزمردي التراثي والأخضر',
        primary: '#064E3B',
        accent: '#059669',
        secondary: '#047857',
        bg: '#FFFFFF',
    },
    {
        id: 'burgundy_excellence',
        name_en: 'Burgundy Excellence',
        name_ar: 'العنابي الأكاديمي والمارون',
        primary: '#701A75',
        accent: '#C026D3',
        secondary: '#86198F',
        bg: '#FFFFFF',
    },
    {
        id: 'slate_modern',
        name_en: 'Modern Slate',
        name_ar: 'الرمادي العصري الحديث',
        primary: '#0F172A',
        accent: '#2563A6',
        secondary: '#334155',
        bg: '#FFFFFF',
    },
];

const BORDER_OPTIONS = [
    {
        id: 'classic_double',
        name_en: 'Classic Double Academic',
        name_ar: 'إطار أكاديمي مزدوج بأركان مذهبة',
    },
    {
        id: 'modern_clean',
        name_en: 'Modern Clean Frame',
        name_ar: 'إطار عصري نقي ومحدد',
    },
    {
        id: 'vintage_ornate',
        name_en: 'Vintage Ornate Frame',
        name_ar: 'إطار تراثي زخرفي متعدد الطبقات',
    },
];

export default function AdminCourses({ courses, teachers, filters }: Props) {
    const { t, locale, isRtl } = useTranslation();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);

    // Certificate Designer State
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const [selectedCourseForCert, setSelectedCourseForCert] = useState<CourseItem | null>(null);
    const [certActiveTab, setCertActiveTab] = useState<'theme' | 'institution' | 'signatories'>('theme');
    const [certPreviewLang, setCertPreviewLang] = useState<'ar' | 'en'>('ar');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title_en: '',
        title_ar: '',
        code: '',
        description_en: '',
        description_ar: '',
        thumbnail: '',
        duration_hours: 24,
        passing_score: 70,
        is_published: true,
        teacher_ids: [] as number[],
    });

    // Certificate Form
    const certForm = useForm<CertificateTemplateData>(DEFAULT_CERT_TEMPLATE);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('admin.courses'),
            { search: searchTerm, status: statusFilter },
            { preserveState: true }
        );
    };

    const handleOpenCreate = () => {
        setEditingCourse(null);
        reset();
        setIsCreateModalOpen(true);
    };

    const handleOpenEdit = (course: CourseItem) => {
        setEditingCourse(course);
        setData({
            title_en: course.title_en,
            title_ar: course.title_ar,
            code: course.code,
            description_en: course.description_en || '',
            description_ar: course.description_ar || '',
            thumbnail: course.thumbnail || '',
            duration_hours: course.duration_hours,
            passing_score: course.passing_score,
            is_published: course.is_published,
            teacher_ids: course.teachers ? course.teachers.map((t) => t.id) : [],
        });
        setIsCreateModalOpen(true);
    };

    const handleTogglePublish = (courseId: number) => {
        router.post(route('admin.courses.toggle-publish', { course: courseId }), {}, {
            preserveScroll: true,
        });
    };

    const handleDeleteCourse = (courseId: number) => {
        if (confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذا المقرر وجميع بياناته؟' : 'Are you sure you want to delete this course?')) {
            router.delete(route('admin.courses.delete', { course: courseId }), {
                preserveScroll: true,
            });
        }
    };

    const handleSaveCourse = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCourse) {
            put(route('admin.courses.update', { course: editingCourse.id }), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('admin.courses.store'), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                },
            });
        }
    };

    const toggleTeacherSelect = (teacherId: number) => {
        const current = [...data.teacher_ids];
        const idx = current.indexOf(teacherId);
        if (idx > -1) {
            current.splice(idx, 1);
        } else {
            current.push(teacherId);
        }
        setData('teacher_ids', current);
    };

    // Open Certificate Designer Modal
    const handleOpenCertDesigner = (course: CourseItem) => {
        setSelectedCourseForCert(course);
        const template = course.effective_certificate_template || course.certificate_template || DEFAULT_CERT_TEMPLATE;
        certForm.setData({
            ...DEFAULT_CERT_TEMPLATE,
            ...template,
        });
        setCertActiveTab('theme');
        setIsCertModalOpen(true);
    };

    // Save Certificate Template
    const handleSaveCertTemplate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourseForCert) return;

        certForm.post(route('admin.courses.certificate-template', { course: selectedCourseForCert.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCertModalOpen(false);
            },
        });
    };

    // Download/Preview PDF
    const handlePreviewPdf = (langOverride?: 'ar' | 'en') => {
        if (!selectedCourseForCert) return;
        const targetLang = langOverride || certPreviewLang;
        const queryParams = new URLSearchParams({
            ...(certForm.data as any),
            lang: targetLang,
        }).toString();
        const url = route('admin.courses.certificate-preview', { course: selectedCourseForCert.id }) + '?' + queryParams;
        window.open(url, '_blank');
    };

    // Active Theme Palette for Live Preview
    const currentTheme = THEME_OPTIONS.find((t) => t.id === certForm.data.theme) || THEME_OPTIONS[0];

    return (
        <AuthenticatedLayout
            title={locale === 'ar' ? 'إدارة وحوكمة المقررات الدراسية' : 'Curriculum & Courses Governance'}
            breadcrumb={locale === 'ar' ? 'المقررات' : 'Courses'}
        >
            <Head title={locale === 'ar' ? 'إدارة المقررات - SUCED' : 'Courses Governance - SUCED'} />

            <div className="space-y-6">
                {/* Header Action Strip */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-[#17365D]">
                            {t('governance_title')}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            {locale === 'ar'
                                ? `إجمالي البرامج والمقررات المسجلة في المركز: ${courses.total} مقرر.`
                                : `Total university diploma and continuing education offerings: ${courses.total}.`}
                        </p>
                    </div>

                    <button
                        onClick={handleOpenCreate}
                        className="px-5 py-2.5 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 shrink-0"
                    >
                        <Plus className="w-4 h-4 text-[#D6A84F]" />
                        <span>{t('create_course_btn')}</span>
                    </button>
                </div>

                {/* Search & Filters */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3"
                >
                    <div className="relative flex-1 w-full">
                        <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={locale === 'ar' ? 'البحث باسم المقرر أو الكود الأكاديمي...' : 'Search by course title or code...'}
                            className="w-full ps-9 pe-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            router.get(
                                route('admin.courses'),
                                { search: searchTerm, status: e.target.value },
                                { preserveState: true }
                            );
                        }}
                        className="w-full sm:w-44 text-xs sm:text-sm p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
                    >
                        <option value="all">{locale === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
                        <option value="published">{locale === 'ar' ? 'المنشور فقط' : 'Published'}</option>
                        <option value="draft">{locale === 'ar' ? 'المسودات' : 'Drafts'}</option>
                    </select>

                    <button
                        type="submit"
                        className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-semibold transition-colors shrink-0"
                    >
                        {locale === 'ar' ? 'تطبيق الفلتر' : 'Filter'}
                    </button>
                </form>

                {/* Courses Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">{locale === 'ar' ? 'المقرر' : 'Course Title'}</th>
                                    <th className="py-3 px-4">{locale === 'ar' ? 'الكود' : 'Code'}</th>
                                    <th className="py-3 px-4">{locale === 'ar' ? 'الأساتذة المكلفين' : 'Assigned Faculty'}</th>
                                    <th className="py-3 px-4">{locale === 'ar' ? 'المحاضرات' : 'Lectures'}</th>
                                    <th className="py-3 px-4">{locale === 'ar' ? 'الطلاب' : 'Students'}</th>
                                    <th className="py-3 px-4">{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                                    <th className="py-3 px-4 text-right">{locale === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {courses.data.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="font-bold text-[#17365D]">
                                                {locale === 'ar' ? c.title_ar : c.title_en}
                                            </div>
                                            <span className="text-[11px] text-slate-400 truncate block max-w-xs">
                                                {locale === 'ar' ? c.title_en : c.title_ar}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 font-mono font-bold text-xs text-slate-700">
                                            {c.code}
                                        </td>
                                        <td className="py-3 px-4 text-xs text-slate-600">
                                            {c.teachers?.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {c.teachers.map((t) => (
                                                        <span key={t.id} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                                                            {t.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-amber-600 font-semibold text-xs">
                                                    {locale === 'ar' ? 'بدون أستاذ' : 'Unassigned'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                                            {c.lectures_count}
                                        </td>
                                        <td className="py-3 px-4 text-xs font-bold text-blue-700">
                                            {c.students_count}
                                        </td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => handleTogglePublish(c.id)}
                                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                                                    c.is_published
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                }`}
                                            >
                                                {c.is_published
                                                    ? (locale === 'ar' ? 'منشور' : 'Published')
                                                    : (locale === 'ar' ? 'مسودة' : 'Draft')}
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {/* Certificate Designer Button */}
                                                <button
                                                    onClick={() => handleOpenCertDesigner(c)}
                                                    className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#9E7317] border border-amber-200/80 transition-all flex items-center gap-1.5 text-xs font-bold shadow-xs hover:border-[#D6A84F]"
                                                    title={locale === 'ar' ? 'تخصيص شكل الشهادة وموقعيها' : 'Customize Certificate Design'}
                                                >
                                                    <Award className="w-3.5 h-3.5 text-[#D6A84F]" />
                                                    <span className="hidden sm:inline">{t('cert_customize_btn')}</span>
                                                </button>

                                                <button
                                                    onClick={() => handleOpenEdit(c)}
                                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                                    title={locale === 'ar' ? 'تعديل المقرر' : 'Edit course'}
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCourse(c.id)}
                                                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                                    title={locale === 'ar' ? 'حذف المقرر' : 'Delete course'}
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

                {/* Create / Edit Course Modal */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 md:p-6 overflow-hidden">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
                            {/* Modal Header */}
                            <div className="shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-white">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-[#2563A6] flex items-center justify-center shrink-0">
                                        <BookOpen className="w-5 h-5 text-[#2563A6]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                                            {editingCourse
                                                ? (locale === 'ar' ? 'تعديل بيانات المقرر' : 'Edit Academic Course')
                                                : (locale === 'ar' ? 'إنشاء مقرر أكاديمي جديد' : 'Create New Course')}
                                        </h3>
                                        <p className="text-[11px] text-slate-500">
                                            {locale === 'ar' ? 'أدخل تفاصيل البرنامج والمحاضرين' : 'Enter program details and assign instructors'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={handleSaveCourse} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                                {locale === 'ar' ? 'عنوان المقرر (بالعربية) *' : 'Course Title (Arabic) *'}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.title_ar}
                                                onChange={(e) => setData('title_ar', e.target.value)}
                                                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                                {locale === 'ar' ? 'رمز المقرر (الكود) *' : 'Course Code *'}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.code}
                                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                placeholder="AI-401"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'عنوان المقرر (بالإنجليزية) *' : 'Course Title (English) *'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.title_en}
                                            onChange={(e) => setData('title_en', e.target.value)}
                                            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                                {locale === 'ar' ? 'الساعات المعتمدة' : 'Duration (Hours)'}
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={data.duration_hours}
                                                onChange={(e) => setData('duration_hours', parseInt(e.target.value) || 20)}
                                                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                                {locale === 'ar' ? 'حد النجاح (%)' : 'Passing Mark (%)'}
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={100}
                                                value={data.passing_score}
                                                onChange={(e) => setData('passing_score', parseInt(e.target.value) || 70)}
                                                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'الوصف والتفاصيل (بالعربية)' : 'Description (Arabic)'}
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={data.description_ar}
                                            onChange={(e) => setData('description_ar', e.target.value)}
                                            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {locale === 'ar' ? 'الوصف والتفاصيل (بالإنجليزية)' : 'Description (English)'}
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={data.description_en}
                                            onChange={(e) => setData('description_en', e.target.value)}
                                            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                        ></textarea>
                                    </div>

                                    {/* Assign Teachers Checkboxes */}
                                    <div className="space-y-1.5 pt-1">
                                        <label className="block text-xs font-bold text-slate-700 uppercase">
                                            {locale === 'ar' ? 'تكليف أعضاء هيئة التدريس:' : 'Assign Faculty Members:'}
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                                            {teachers.map((t) => {
                                                const isChecked = data.teacher_ids.includes(t.id);
                                                return (
                                                    <label
                                                        key={t.id}
                                                        onClick={() => toggleTeacherSelect(t.id)}
                                                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                                                            isChecked
                                                                ? 'bg-blue-100/70 text-[#17365D] font-bold'
                                                                : 'hover:bg-slate-100 text-slate-700'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => toggleTeacherSelect(t.id)}
                                                            className="w-3.5 h-3.5 text-[#2563A6] rounded"
                                                        />
                                                        <span className="truncate">{t.name}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <input
                                            type="checkbox"
                                            id="course_publish"
                                            checked={data.is_published}
                                            onChange={(e) => setData('is_published', e.target.checked)}
                                            className="w-4 h-4 text-[#2563A6] rounded"
                                        />
                                        <label htmlFor="course_publish" className="text-xs font-semibold text-slate-700 cursor-pointer">
                                            {locale === 'ar' ? 'نشر المقرر فوراً في دليل البرامج المتاحة' : 'Publish course to student catalog'}
                                        </label>
                                    </div>
                                </div>

                                {/* Modal Sticky Footer */}
                                <div className="shrink-0 flex items-center justify-end gap-3 p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
                                    >
                                        {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="py-2.5 px-5 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        {processing
                                            ? (locale === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                                            : (locale === 'ar' ? 'حفظ المقرر' : 'Save Course')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* Certificate Designer Modal (Theme, Border, Titles, Signatories Customizer) */}
                {/* ========================================================================= */}
                {isCertModalOpen && selectedCourseForCert && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 md:p-6 overflow-hidden">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
                            {/* Sticky Modal Header & Tabs Bar */}
                            <div className="shrink-0 bg-white border-b border-slate-200 px-4 sm:px-6 pt-4 sm:pt-5 pb-0">
                                <div className="flex items-start justify-between gap-3 pb-3">
                                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-[#D6A84F]/40 text-[#9E7317] flex items-center justify-center shrink-0">
                                            <Award className="w-5 h-5 text-[#D6A84F]" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-extrabold text-[#17365D] text-base sm:text-lg lg:text-xl truncate">
                                                {t('cert_designer_title')}
                                            </h3>
                                            <p className="text-xs text-slate-500 truncate mt-0.5">
                                                <span className="font-bold text-slate-700">{selectedCourseForCert.code}</span> • {locale === 'ar' ? selectedCourseForCert.title_ar : selectedCourseForCert.title_en}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsCertModalOpen(false)}
                                        className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors shrink-0"
                                        aria-label="Close"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Tabs Navigation (Horizontally scrollable on mobile with touch support) */}
                                <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                                    <button
                                        type="button"
                                        onClick={() => setCertActiveTab('theme')}
                                        className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                                            certActiveTab === 'theme'
                                                ? 'border-[#17365D] text-[#17365D]'
                                                : 'border-transparent text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        <Palette className="w-4 h-4 text-[#D6A84F]" />
                                        <span>{t('cert_theme')} & {t('cert_border_style')}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setCertActiveTab('signatories')}
                                        className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                                            certActiveTab === 'signatories'
                                                ? 'border-[#17365D] text-[#17365D]'
                                                : 'border-transparent text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        <Award className="w-4 h-4 text-[#2563A6]" />
                                        <span>{t('cert_signatories_title')}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setCertActiveTab('institution')}
                                        className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                                            certActiveTab === 'institution'
                                                ? 'border-[#17365D] text-[#17365D]'
                                                : 'border-transparent text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        <Sliders className="w-4 h-4 text-emerald-600" />
                                        <span>{t('cert_institution_title')}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Modal Form with independent Scrollable Body and Sticky Footer */}
                            <form onSubmit={handleSaveCertTemplate} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 overscroll-contain">
                                    {/* TAB 1: Theme & Border Style */}
                                    {certActiveTab === 'theme' && (
                                        <div className="space-y-5">
                                            {/* Color Themes */}
                                            <div>
                                                <label className="block text-xs font-bold text-[#17365D] mb-2 uppercase tracking-wider">
                                                    {t('cert_theme')}
                                                </label>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
                                                    {THEME_OPTIONS.map((theme) => {
                                                        const isSelected = certForm.data.theme === theme.id;
                                                        return (
                                                            <button
                                                                key={theme.id}
                                                                type="button"
                                                                onClick={() => certForm.setData('theme', theme.id as any)}
                                                                className={`p-3 rounded-2xl border text-start transition-all relative ${
                                                                    isSelected
                                                                        ? 'border-[#17365D] ring-2 ring-[#17365D]/20 bg-slate-50 shadow-sm'
                                                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-1.5 mb-2">
                                                                    <span
                                                                        className="w-4 h-4 rounded-full border border-black/10 inline-block shadow-xs"
                                                                        style={{ backgroundColor: theme.primary }}
                                                                    ></span>
                                                                    <span
                                                                        className="w-4 h-4 rounded-full border border-black/10 inline-block shadow-xs"
                                                                        style={{ backgroundColor: theme.accent }}
                                                                    ></span>
                                                                    <span
                                                                        className="w-4 h-4 rounded-full border border-black/10 inline-block shadow-xs"
                                                                        style={{ backgroundColor: theme.secondary }}
                                                                    ></span>
                                                                </div>
                                                                <div className="text-xs font-bold text-slate-800">
                                                                    {locale === 'ar' ? theme.name_ar : theme.name_en}
                                                                </div>
                                                                {isSelected && (
                                                                    <div className="absolute top-2 end-2 w-4 h-4 rounded-full bg-[#17365D] text-white flex items-center justify-center text-[9px]">
                                                                        ✓
                                                                    </div>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Border Style */}
                                            <div>
                                                <label className="block text-xs font-bold text-[#17365D] mb-2 uppercase tracking-wider">
                                                    {t('cert_border_style')}
                                                </label>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                                                    {BORDER_OPTIONS.map((border) => {
                                                        const isSelected = certForm.data.border_style === border.id;
                                                        return (
                                                            <button
                                                                key={border.id}
                                                                type="button"
                                                                onClick={() => certForm.setData('border_style', border.id as any)}
                                                                className={`p-3.5 rounded-2xl border text-start transition-all ${
                                                                    isSelected
                                                                        ? 'border-[#17365D] ring-2 ring-[#17365D]/20 bg-slate-50 font-bold'
                                                                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                                                                }`}
                                                            >
                                                                <div className="text-xs font-bold text-[#17365D]">
                                                                    {locale === 'ar' ? border.name_ar : border.name_en}
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Elements Toggles */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                                                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={certForm.data.show_qr}
                                                        onChange={(e) => certForm.setData('show_qr', e.target.checked)}
                                                        className="w-4 h-4 text-[#17365D] rounded"
                                                    />
                                                    <span>{t('cert_show_qr')}</span>
                                                </label>

                                                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={certForm.data.show_grade}
                                                        onChange={(e) => certForm.setData('show_grade', e.target.checked)}
                                                        className="w-4 h-4 text-[#17365D] rounded"
                                                    />
                                                    <span>{t('cert_show_grade')}</span>
                                                </label>

                                                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={certForm.data.show_watermark}
                                                        onChange={(e) => certForm.setData('show_watermark', e.target.checked)}
                                                        className="w-4 h-4 text-[#17365D] rounded"
                                                    />
                                                    <span>{t('cert_show_watermark')}</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB 2: Signatories / مانحي الشهادة */}
                                    {certActiveTab === 'signatories' && (
                                        <div className="space-y-4 sm:space-y-5">
                                            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                                                {locale === 'ar'
                                                    ? 'يمكنك هنا تحديد أسماء ومناصب مانحي ومعتمدي الشهادة لهذا المقرر تحديداً (مثل عميد الكلية، المشرف الأكاديمي، مدير المركز، أو رئيس الجامعة). تدعم الحقول اللغتين العربية والإنجليزية مع معالجة وتشكيل تلقائي للغة العربية.'
                                                    : 'Customize the signatories and official grantors for this course certificate (e.g. Dean of Faculty, Course Academic Director, Center Director, or University President). Both English and Arabic are fully supported.'}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                                                {/* Signatory 1 (Left) */}
                                                <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
                                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                                        <span className="w-2.5 h-2.5 rounded-full bg-[#D6A84F]"></span>
                                                        <h4 className="text-xs font-bold text-[#17365D] uppercase">
                                                            {t('cert_signatory_1')}
                                                        </h4>
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                            {t('cert_name_en')} *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={certForm.data.signatory1_name}
                                                            onChange={(e) => certForm.setData('signatory1_name', e.target.value)}
                                                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                            placeholder="e.g. Dr. Mostafa Kamel"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                            {t('cert_name_ar')}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={certForm.data.signatory1_name_ar || ''}
                                                            onChange={(e) => certForm.setData('signatory1_name_ar', e.target.value)}
                                                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                            placeholder="مثال: د. مصطفى كامل"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                            {t('cert_title_en')} *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={certForm.data.signatory1_title}
                                                            onChange={(e) => certForm.setData('signatory1_title', e.target.value)}
                                                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                            placeholder="e.g. Director of Continuing Education"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                            {t('cert_title_ar')}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={certForm.data.signatory1_title_ar || ''}
                                                            onChange={(e) => certForm.setData('signatory1_title_ar', e.target.value)}
                                                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                            placeholder="مثال: مدير مركز التعليم المستمر"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Signatory 2 (Right) */}
                                                <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
                                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                                        <span className="w-2.5 h-2.5 rounded-full bg-[#2563A6]"></span>
                                                        <h4 className="text-xs font-bold text-[#17365D] uppercase">
                                                            {t('cert_signatory_2')}
                                                        </h4>
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                            {t('cert_name_en')} *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={certForm.data.signatory2_name}
                                                            onChange={(e) => certForm.setData('signatory2_name', e.target.value)}
                                                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                            placeholder="e.g. Prof. Dr. Hassan El-Noubi"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                            {t('cert_name_ar')}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={certForm.data.signatory2_name_ar || ''}
                                                            onChange={(e) => certForm.setData('signatory2_name_ar', e.target.value)}
                                                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                            placeholder="مثال: أ.د. حسان النعماني"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                            {t('cert_title_en')} *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={certForm.data.signatory2_title}
                                                            onChange={(e) => certForm.setData('signatory2_title', e.target.value)}
                                                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                            placeholder="e.g. President, Sohag University"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                            {t('cert_title_ar')}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={certForm.data.signatory2_title_ar || ''}
                                                            onChange={(e) => certForm.setData('signatory2_title_ar', e.target.value)}
                                                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                            placeholder="مثال: رئيس الجامعة"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB 3: Institution & Titles */}
                                    {certActiveTab === 'institution' && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                                        Organization / University (English) *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={certForm.data.org_name_en}
                                                        onChange={(e) => certForm.setData('org_name_en', e.target.value)}
                                                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                        placeholder="Sohag University"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                                        اسم الجامعة أو المؤسسة (بالعربية)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={certForm.data.org_name_ar || ''}
                                                        onChange={(e) => certForm.setData('org_name_ar', e.target.value)}
                                                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                        placeholder="جامعة سوهاج"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                                        Faculty / Center Name (English)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={certForm.data.center_name_en || ''}
                                                        onChange={(e) => certForm.setData('center_name_en', e.target.value)}
                                                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                        placeholder="Center for Continuing Education & Development (SUCED)"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                                        اسم المركز أو الكلية (بالعربية)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={certForm.data.center_name_ar || ''}
                                                        onChange={(e) => certForm.setData('center_name_ar', e.target.value)}
                                                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                        placeholder="مركز التعليم المستمر وتطوير القدرات"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                                        Certificate Main Title (English) *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={certForm.data.certificate_title_en}
                                                        onChange={(e) => certForm.setData('certificate_title_en', e.target.value)}
                                                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                        placeholder="Certificate of Completion / Professional Diploma"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                                        عنوان الشهادة الرئيسي (بالعربية)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={certForm.data.certificate_title_ar || ''}
                                                        onChange={(e) => certForm.setData('certificate_title_ar', e.target.value)}
                                                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                        placeholder="شهادة إتمام معتمدة / دبلوم مهني متخصص"
                                                    />
                                                </div>
                                            </div>
                                            <div className="pt-3 border-t border-slate-100">
                                                <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                                                    <FileText className="w-3.5 h-3.5 text-[#2563A6]" />
                                                    <span>{locale === 'ar' ? 'صيغة ونصوص منح الشهادة' : 'Certificate Award Wording'}</span>
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3">
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                                            Introduction Text (English)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={certForm.data.introduction_text_en || ''}
                                                            onChange={(e) => certForm.setData('introduction_text_en', e.target.value)}
                                                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                            placeholder="This is officially certified to acknowledge that"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                                            نص التمهيد والافتتاحية (بالعربية)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={certForm.data.introduction_text_ar || ''}
                                                            onChange={(e) => certForm.setData('introduction_text_ar', e.target.value)}
                                                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                            placeholder="تشهد إدارة مركز التعليم المستمر وتطوير القدرات بأن المتدرب"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                                            Completion / Requirement Text (English)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={certForm.data.completion_text_en || ''}
                                                            onChange={(e) => certForm.setData('completion_text_en', e.target.value)}
                                                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                            placeholder="has successfully completed all coursework for"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                                            نص الإتمام والاستحقاق (بالعربية)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={certForm.data.completion_text_ar || ''}
                                                            onChange={(e) => certForm.setData('completion_text_ar', e.target.value)}
                                                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#17365D]/20 focus:border-[#17365D]"
                                                            placeholder="قد اجتاز بنجاح متطلبات واختبارات المقرر الموسوم بعنوان"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ========================================================= */}
                                    {/* LIVE CERTIFICATE MINIATURE VISUAL PREVIEW                  */}
                                    {/* ========================================================= */}
                                    <div className="space-y-2 pt-2 border-t border-slate-100">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-[#17365D] uppercase tracking-wider flex items-center gap-1.5">
                                                    <Sparkles className="w-3.5 h-3.5 text-[#D6A84F]" />
                                                    {t('cert_live_preview')}
                                                </span>

                                                {/* Preview Language Switcher */}
                                                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                                                    <button
                                                        type="button"
                                                        onClick={() => setCertPreviewLang('ar')}
                                                        className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                                                            certPreviewLang === 'ar'
                                                                ? 'bg-emerald-600 text-white shadow-xs'
                                                                : 'text-slate-600 hover:text-slate-900'
                                                        }`}
                                                    >
                                                        عربي (AR)
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setCertPreviewLang('en')}
                                                        className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                                                            certPreviewLang === 'en'
                                                                ? 'bg-[#17365D] text-white shadow-xs'
                                                                : 'text-slate-600 hover:text-slate-900'
                                                        }`}
                                                    >
                                                        English (EN)
                                                    </button>
                                                </div>
                                            </div>

                                            {/* PDF Preview Actions */}
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => handlePreviewPdf('ar')}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-xs"
                                                    title="معاينة الشهادة بصيغة PDF باللغة العربية"
                                                >
                                                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span>PDF عربي</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handlePreviewPdf('en')}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#17365D] border border-blue-200 text-xs font-bold transition-all shadow-xs"
                                                    title="Preview PDF in English"
                                                >
                                                    <Download className="w-3.5 h-3.5 text-[#2563A6]" />
                                                    <span>PDF EN</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Preview Card with horizontal scroll containment */}
                                        <div className="w-full overflow-x-auto pb-1">
                                            <div
                                                dir={certPreviewLang === 'ar' ? 'rtl' : 'ltr'}
                                                className="min-w-[440px] sm:min-w-0 p-4 sm:p-5 rounded-2xl border transition-all text-center relative overflow-hidden"
                                                style={{
                                                    backgroundColor: currentTheme.bg,
                                                    borderColor: currentTheme.primary,
                                                    borderWidth: certForm.data.border_style === 'classic_double' ? '4px' : '2px',
                                                    borderStyle: certForm.data.border_style === 'classic_double' ? 'double' : 'solid',
                                                }}
                                            >
                                                {/* Watermark preview */}
                                                {certForm.data.show_watermark && (
                                                    <div
                                                        className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none font-bold text-5xl sm:text-6xl tracking-widest"
                                                        style={{ color: currentTheme.primary }}
                                                    >
                                                        {certPreviewLang === 'ar' ? 'جامعة سوهاج' : 'SUCED'}
                                                    </div>
                                                )}

                                                {/* Header */}
                                                <div className="space-y-0.5">
                                                    <div
                                                        className="text-xs sm:text-sm font-extrabold tracking-wide uppercase"
                                                        style={{ color: currentTheme.primary }}
                                                    >
                                                        {certPreviewLang === 'ar'
                                                            ? (certForm.data.org_name_ar || certForm.data.org_name_en)
                                                            : certForm.data.org_name_en}
                                                    </div>
                                                    <div className="text-[10px] sm:text-[11px] font-semibold" style={{ color: currentTheme.secondary }}>
                                                        {certPreviewLang === 'ar'
                                                            ? (certForm.data.center_name_ar || certForm.data.center_name_en)
                                                            : certForm.data.center_name_en}
                                                    </div>
                                                    <div
                                                        className="inline-block text-[11px] sm:text-xs font-bold uppercase tracking-wider pb-0.5 mt-1 border-b"
                                                        style={{
                                                            color: currentTheme.primary,
                                                            borderColor: currentTheme.accent,
                                                        }}
                                                    >
                                                        {certPreviewLang === 'ar'
                                                            ? (certForm.data.certificate_title_ar || certForm.data.certificate_title_en)
                                                            : certForm.data.certificate_title_en}
                                                    </div>
                                                </div>

                                                {/* Body */}
                                                <div className="my-3 space-y-1">
                                                    <div className="text-[10px] text-slate-400">
                                                        {certPreviewLang === 'ar'
                                                            ? (certForm.data.introduction_text_ar || DEFAULT_CERT_TEMPLATE.introduction_text_ar)
                                                            : (certForm.data.introduction_text_en || DEFAULT_CERT_TEMPLATE.introduction_text_en)}
                                                    </div>
                                                    <div
                                                        className="text-sm sm:text-base font-extrabold underline"
                                                        style={{
                                                            color: currentTheme.primary,
                                                            textDecorationColor: currentTheme.accent,
                                                        }}
                                                    >
                                                        {certPreviewLang === 'ar' ? 'أحمد منصور بدوي' : 'Ahmed Mansour Badawi'}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400">
                                                        {certPreviewLang === 'ar'
                                                            ? (certForm.data.completion_text_ar || DEFAULT_CERT_TEMPLATE.completion_text_ar)
                                                            : (certForm.data.completion_text_en || DEFAULT_CERT_TEMPLATE.completion_text_en)}
                                                    </div>
                                                    <div className="text-xs sm:text-sm font-bold" style={{ color: currentTheme.secondary }}>
                                                        {certPreviewLang === 'ar'
                                                            ? (selectedCourseForCert.title_ar || selectedCourseForCert.title_en)
                                                            : selectedCourseForCert.title_en}
                                                    </div>

                                                    {certForm.data.show_grade && (
                                                        <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 mt-1">
                                                            {certPreviewLang === 'ar'
                                                                ? 'التقدير العام: ممتاز (98.5%)'
                                                                : 'Final Grade: 98.5% • Passed with Distinction'}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Footer / Signatories */}
                                                <div className="pt-3 border-t border-slate-200/60 grid grid-cols-3 items-end text-center gap-2">
                                                    <div>
                                                        <div className="w-16 sm:w-20 mx-auto border-t border-slate-400 mb-1"></div>
                                                        <div className="text-[10px] sm:text-[11px] font-bold truncate" style={{ color: currentTheme.primary }}>
                                                            {certPreviewLang === 'ar'
                                                                ? (certForm.data.signatory1_name_ar || certForm.data.signatory1_name)
                                                                : certForm.data.signatory1_name}
                                                        </div>
                                                        <div className="text-[8px] sm:text-[9px] text-slate-500 truncate">
                                                            {certPreviewLang === 'ar'
                                                                ? (certForm.data.signatory1_title_ar || certForm.data.signatory1_title)
                                                                : certForm.data.signatory1_title}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        {certForm.data.show_qr && (
                                                            <div className="inline-block p-1 bg-slate-50 border border-slate-200 rounded text-[8px] text-slate-600 font-mono">
                                                                {certPreviewLang === 'ar' ? 'معتمد رقمياً ✓' : '✓ QR Verified'}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <div className="w-16 sm:w-20 mx-auto border-t border-slate-400 mb-1"></div>
                                                        <div className="text-[10px] sm:text-[11px] font-bold truncate" style={{ color: currentTheme.primary }}>
                                                            {certPreviewLang === 'ar'
                                                                ? (certForm.data.signatory2_name_ar || certForm.data.signatory2_name)
                                                                : certForm.data.signatory2_name}
                                                        </div>
                                                        <div className="text-[8px] sm:text-[9px] text-slate-500 truncate">
                                                            {certPreviewLang === 'ar'
                                                                ? (certForm.data.signatory2_title_ar || certForm.data.signatory2_title)
                                                                : certForm.data.signatory2_title}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sticky Footer with Responsive Actions */}
                                <div className="shrink-0 border-t border-slate-200 bg-slate-50/95 backdrop-blur-xs px-4 sm:px-6 py-3 sm:py-3.5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => certForm.setData(DEFAULT_CERT_TEMPLATE)}
                                            className="flex-1 sm:flex-none py-2 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
                                        >
                                            {locale === 'ar' ? 'استعادة الافتراضي' : 'Reset Defaults'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsCertModalOpen(false)}
                                            className="flex-1 sm:flex-none py-2 px-3.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
                                        >
                                            {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handlePreviewPdf('ar')}
                                            className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                                        >
                                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>PDF عربي</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handlePreviewPdf('en')}
                                            className="py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#17365D] border border-blue-200 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                                        >
                                            <Download className="w-3.5 h-3.5 text-[#2563A6]" />
                                            <span>PDF EN</span>
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={certForm.processing}
                                            className="flex-1 sm:flex-none py-2 px-4 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <Award className="w-4 h-4 text-[#D6A84F]" />
                                            <span>
                                                {certForm.processing
                                                    ? (locale === 'ar' ? 'جاري الحفظ...' : 'Saving Design...')
                                                    : t('cert_save_template')}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

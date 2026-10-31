import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import {
    Play,
    CheckCircle2,
    Circle,
    ArrowLeft,
    ArrowRight,
    Clock,
    BookOpen,
    Award,
    FileText,
    Download,
    QrCode,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    FileDown,
    ShieldCheck
} from 'lucide-react';

interface Props {
    course: {
        id: number;
        slug: string;
        code: string;
        title_en: string;
        title_ar: string;
        description_en: string;
        description_ar: string;
    };
    lectures: Array<{
        id: number;
        position: number;
        title_en: string;
        title_ar: string;
        duration_minutes: number;
        is_completed: boolean;
    }>;
    activeLecture: {
        id: number;
        position: number;
        title_en: string;
        title_ar: string;
        description_en: string;
        description_ar: string;
        youtube_url: string;
        embed_url: string;
        resource_path?: string;
        duration_minutes: number;
        is_completed: boolean;
    };
    prevLectureSlug: number | null;
    nextLectureSlug: number | null;
    finalExam: {
        id: number;
        title_en: string;
        title_ar: string;
        duration_minutes: number;
        passing_score: number;
        has_passed: boolean;
    } | null;
    evaluation: {
        eligible: boolean;
        lectures_completed: number;
        lectures_required: number;
        final_exam_passed: boolean;
        score_achieved?: number;
        certificate_issued: boolean;
    };
    certificate: {
        certificate_number: string;
        public_code: string;
    } | null;
}

export default function StudentLearn({
    course,
    lectures,
    activeLecture,
    prevLectureSlug,
    nextLectureSlug,
    finalExam,
    evaluation,
    certificate,
}: Props) {
    const { t, locale, isRtl } = useTranslation();
    const [toggling, setToggling] = useState(false);

    const handleToggleComplete = () => {
        setToggling(true);
        router.post(
            route('student.lectures.complete', { lecture: activeLecture.id }),
            {},
            {
                preserveScroll: true,
                onFinish: () => setToggling(false),
            }
        );
    };

    const ArrowPrev = isRtl ? ChevronRight : ChevronLeft;
    const ArrowNext = isRtl ? ChevronLeft : ChevronRight;

    return (
        <AuthenticatedLayout
            title={locale === 'ar' ? course.title_ar : course.title_en}
            breadcrumb={locale === 'ar' ? 'قاعة المحاضرات التفاعلية' : 'Classroom'}
        >
            <Head
                title={`${locale === 'ar' ? activeLecture.title_ar : activeLecture.title_en} - ${locale === 'ar' ? course.title_ar : course.title_en}`}
            />

            <div className="space-y-6">
                {/* Course Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-[#17365D] text-white text-[11px] font-mono font-bold">
                                {course.code}
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">
                                {locale === 'ar' ? 'برنامج تعليم مستمر' : 'Continuing Education Module'}
                            </span>
                        </div>
                        <h1 className="text-lg sm:text-xl font-extrabold text-[#17365D]">
                            {locale === 'ar' ? course.title_ar : course.title_en}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right sm:text-left">
                            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                                {locale === 'ar' ? 'نسبة الإنجاز' : 'Completion Rate'}
                            </span>
                            <span className="text-sm font-bold text-[#17365D]">
                                {evaluation.lectures_completed} / {evaluation.lectures_required} {t('lectures')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Classroom Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column (8 cols): Video Player & Details */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Video Player Container */}
                        <div className="bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-800 aspect-video relative">
                            {activeLecture.embed_url ? (
                                <iframe
                                    src={activeLecture.embed_url}
                                    title={activeLecture.title_en}
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                                    <Play className="w-12 h-12 text-slate-600 mb-2" />
                                    <p className="text-sm font-semibold">
                                        {locale === 'ar' ? 'رابط الفيديو غير متاح حالياً' : 'Video URL currently unavailable'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Player Controls & Action Strip */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleToggleComplete}
                                    disabled={toggling}
                                    className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shadow-sm ${
                                        activeLecture.is_completed
                                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                            : 'bg-[#17365D] hover:bg-[#2563A6] text-white'
                                    }`}
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>
                                        {activeLecture.is_completed
                                            ? (locale === 'ar' ? 'تمت المشاهدة بنجاح ✓' : 'Marked Completed ✓')
                                            : (locale === 'ar' ? 'تحديد كمكتمل' : 'Mark as Completed')}
                                    </span>
                                </button>

                                <span className="text-xs text-slate-500 font-medium">
                                    {activeLecture.duration_minutes} {locale === 'ar' ? 'دقيقة' : 'mins'}
                                </span>
                            </div>

                            {/* Prev / Next Lecture Navigation */}
                            <div className="flex items-center gap-2">
                                {prevLectureSlug ? (
                                    <Link
                                        href={route('student.learn', {
                                            course: course.slug,
                                            lecture: prevLectureSlug,
                                        })}
                                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                                        title={locale === 'ar' ? 'المحاضرة السابقة' : 'Previous Lecture'}
                                    >
                                        <ArrowPrev className="w-4 h-4" />
                                        <span>{locale === 'ar' ? 'السابقة' : 'Prev'}</span>
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="p-2.5 rounded-xl bg-slate-50 text-slate-300 text-xs font-semibold cursor-not-allowed flex items-center gap-1.5"
                                    >
                                        <ArrowPrev className="w-4 h-4" />
                                        <span>{locale === 'ar' ? 'السابقة' : 'Prev'}</span>
                                    </button>
                                )}

                                {nextLectureSlug ? (
                                    <Link
                                        href={route('student.learn', {
                                            course: course.slug,
                                            lecture: nextLectureSlug,
                                        })}
                                        className="p-2.5 rounded-xl bg-[#2563A6] hover:bg-[#17365D] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                                        title={locale === 'ar' ? 'المحاضرة التالية' : 'Next Lecture'}
                                    >
                                        <span>{locale === 'ar' ? 'التالية' : 'Next'}</span>
                                        <ArrowNext className="w-4 h-4" />
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="p-2.5 rounded-xl bg-slate-50 text-slate-300 text-xs font-semibold cursor-not-allowed flex items-center gap-1.5"
                                    >
                                        <span>{locale === 'ar' ? 'التالية' : 'Next'}</span>
                                        <ArrowNext className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Lecture Details & Description */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#2563A6] text-xs font-bold font-mono">
                                    {locale === 'ar' ? `المحاضرة ${activeLecture.position}` : `Lecture ${activeLecture.position}`}
                                </span>
                            </div>

                            <h2 className="text-xl font-bold text-[#17365D]">
                                {locale === 'ar' ? activeLecture.title_ar : activeLecture.title_en}
                            </h2>

                            <p className="text-sm text-slate-600 leading-relaxed">
                                {locale === 'ar' ? activeLecture.description_ar : activeLecture.description_en}
                            </p>
                        </div>
                    </div>

                    {/* Right Column (4 cols): Course Syllabus Playlist & Certification */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Certificate Award Banner if Earned */}
                        {certificate && (
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-[#17365D] text-white shadow-lg space-y-3">
                                <div className="flex items-center gap-2">
                                    <Award className="w-6 h-6 text-[#D6A84F]" />
                                    <h3 className="font-bold text-base">
                                        {locale === 'ar' ? 'مبارك! حصلت على الشهادة' : 'Certificate Awarded!'}
                                    </h3>
                                </div>
                                <p className="text-xs text-amber-100 leading-relaxed">
                                    {locale === 'ar'
                                        ? 'لقد استوفيت جميع متطلبات الدورة واجتزت الاختبار النهائي بنجاح.'
                                        : 'You have satisfied all course completion criteria and passed the final examination.'}
                                </p>
                                <div className="flex items-center gap-2 pt-1">
                                    <Link
                                        href={route('student.certificates')}
                                        className="flex-1 py-2 px-3 rounded-xl bg-white text-[#17365D] hover:bg-slate-100 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                        <Award className="w-4 h-4" />
                                        <span>{locale === 'ar' ? 'عرض الشهادة' : 'View Certificate'}</span>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Final Exam Callout */}
                        {finalExam && (
                            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-amber-600" />
                                        <h3 className="font-bold text-[#17365D] text-sm">
                                            {locale === 'ar' ? 'الاختبار النهائي للدورة' : 'Course Final Assessment'}
                                        </h3>
                                    </div>
                                    {finalExam.has_passed && (
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                            {locale === 'ar' ? 'مجتاز' : 'Passed'}
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {locale === 'ar' ? finalExam.title_ar : finalExam.title_en} (
                                    {finalExam.duration_minutes} {locale === 'ar' ? 'دقيقة' : 'mins'} • {finalExam.passing_score}% {locale === 'ar' ? 'للنجاح' : 'to pass'})
                                </p>

                                <Link
                                    href={route('student.exams.take', { exam: finalExam.id })}
                                    className={`w-full py-2 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                                        finalExam.has_passed
                                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                            : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                                    }`}
                                >
                                    <span>
                                        {finalExam.has_passed
                                            ? (locale === 'ar' ? 'إعادة التقييم الأكاديمي' : 'Retake Exam')
                                            : (locale === 'ar' ? 'بدء الامتحان النهائي' : 'Start Final Exam')}
                                    </span>
                                </Link>
                            </div>
                        )}

                        {/* Syllabus Playlist Drawer */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-[#17365D]" />
                                    <h3 className="font-bold text-sm text-[#17365D]">
                                        {locale === 'ar' ? 'فهرس المحاضرات' : 'Course Syllabus'}
                                    </h3>
                                </div>
                                <span className="text-xs text-slate-500 font-semibold font-mono">
                                    {evaluation.lectures_completed}/{evaluation.lectures_required}
                                </span>
                            </div>

                            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                                {lectures.map((lec) => {
                                    const isActive = lec.id === activeLecture.id;

                                    return (
                                        <Link
                                            key={lec.id}
                                            href={route('student.learn', {
                                                course: course.slug,
                                                lecture: lec.id,
                                            })}
                                            className={`p-3.5 flex items-start gap-3 transition-colors ${
                                                isActive
                                                    ? 'bg-blue-50/80 border-l-4 border-l-[#2563A6]'
                                                    : 'hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="mt-0.5 shrink-0">
                                                {lec.is_completed ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                ) : (
                                                    <Circle className="w-4 h-4 text-slate-300" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-1">
                                                    <span className="text-[11px] font-bold text-slate-400 font-mono">
                                                        {locale === 'ar' ? `محاضرة ${lec.position}` : `Lec ${lec.position}`}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        {lec.duration_minutes}m
                                                    </span>
                                                </div>

                                                <h4
                                                    className={`text-xs mt-0.5 truncate ${
                                                        isActive
                                                            ? 'font-bold text-[#17365D]'
                                                            : 'font-medium text-slate-700'
                                                    }`}
                                                >
                                                    {locale === 'ar' ? lec.title_ar : lec.title_en}
                                                </h4>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

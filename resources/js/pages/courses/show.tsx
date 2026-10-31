import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { useTranslation } from '@/lib/i18n';
import {
    Award,
    BookOpen,
    CheckCircle,
    ChevronRight,
    Clock,
    FileText,
    GraduationCap,
    Play,
    ShieldCheck,
    Star,
    Users,
    Video
} from 'lucide-react';

interface Props {
    course: any;
    enrollment: any;
    isEnrolled: boolean;
}

export default function CourseDetail({ course, enrollment, isEnrolled }: Props) {
    const { t, locale, isRtl } = useTranslation();
    const { auth } = usePage().props as any;
    const user = auth?.user;

    const { post, processing } = useForm();

    const handleEnroll = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('courses.enroll', { course: course.id }));
    };

    const courseTitle = locale === 'ar' ? course.title_ar : course.title_en;
    const courseDesc = locale === 'ar' ? course.description_ar : course.description_en;
    const leadTeacher = course.teachers?.[0];

    return (
        <div className="min-h-screen bg-[#F7F9FC] text-[#1E293B] flex flex-col">
            <Head title={`${courseTitle} — SUCED`} />
            <Navbar />

            <main className="w-full pt-20 flex-1">
                {/* Course Header Banner */}
                <div className="bg-[#002043] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#17365D]">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8 flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-[#17365D] text-[#D5E3FF] text-xs font-bold uppercase tracking-wider border border-[#2060A3]/40">
                                    {course.code}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-sm">
                                    {t('bilingual')}
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                                {courseTitle}
                            </h1>

                            <p className="text-sm sm:text-base text-[#D5E3FF] max-w-2xl leading-relaxed">
                                {courseDesc}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[#CBD5E1]">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <Clock className="w-4 h-4 text-[#80B6FE]" />
                                    {course.duration_weeks} {t('weeks')} ({course.duration_hours} {t('hours')})
                                </span>
                                <span className="flex items-center gap-1.5 font-bold text-[#F0BF64]">
                                    <Star className="w-4 h-4 fill-[#F0BF64]" />
                                    {Number(course.rating || 4.9).toFixed(1)} ({course.reviews_count} {locale === 'ar' ? 'تقييم' : 'reviews'})
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Award className="w-4 h-4 text-[#80B6FE]" />
                                    {locale === 'ar' ? 'نسبة النجاح المطلوبة:' : 'Passing Score:'} {course.passing_score}%
                                </span>
                            </div>
                        </div>

                        {/* CTA Card Desktop floating right */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-3xl p-6 shadow-2xl text-[#1E293B] border border-[#CBD5E1] flex flex-col gap-4">
                                <div className="h-44 rounded-2xl overflow-hidden relative bg-[#17365D]">
                                    <img
                                        src={course.thumbnail || '/images/stitch/campus_architecture_hero.png'}
                                        alt={courseTitle}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-white/90 text-[#002043] flex items-center justify-center shadow-lg">
                                            <Play className="w-5 h-5 ml-0.5 fill-[#002043]" />
                                        </div>
                                    </div>
                                </div>

                                {isEnrolled ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="p-3 bg-[#DCFCE7] text-[#16A34A] rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>{locale === 'ar' ? 'أنت مسجل في هذا المقرر بالفعل' : 'You are currently enrolled'}</span>
                                        </div>
                                        <Link
                                            href={route('student.learn', { course: course.slug })}
                                            className="w-full py-3.5 bg-[#002043] hover:bg-[#2060A3] text-white rounded-xl font-bold text-sm text-center shadow-md transition-all flex items-center justify-center gap-2"
                                        >
                                            <Play className="w-4 h-4 fill-white" />
                                            <span>{locale === 'ar' ? 'متابعة مشاهدة المحاضرات' : 'Continue Learning'}</span>
                                        </Link>
                                    </div>
                                ) : user ? (
                                    <form onSubmit={handleEnroll}>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full py-3.5 bg-[#002043] hover:bg-[#2060A3] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                        >
                                            <GraduationCap className="w-5 h-5" />
                                            <span>{locale === 'ar' ? 'سجل في هذا المقرر الآن (مجاناً)' : 'Enroll in Course Now (Free)'}</span>
                                        </button>
                                    </form>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href={route('login')}
                                            className="w-full py-3.5 bg-[#002043] hover:bg-[#2060A3] text-white rounded-xl font-bold text-sm text-center shadow-md transition-all"
                                        >
                                            {locale === 'ar' ? 'سجل دخول للالتحاق بالمقرر' : 'Login to Enroll'}
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="w-full py-2.5 bg-[#F0F3FF] hover:bg-[#E2E8F0] text-[#002043] rounded-xl font-semibold text-xs text-center transition-all"
                                        >
                                            {locale === 'ar' ? 'إنشاء حساب جديد' : 'Create New Account'}
                                        </Link>
                                    </div>
                                )}

                                <div className="text-[11px] text-[#64748B] space-y-1.5 pt-2 border-t border-[#F1F5F9]">
                                    <div className="flex items-center justify-between">
                                        <span>{locale === 'ar' ? 'عدد المحاضرات المرئية:' : 'Video Lectures:'}</span>
                                        <span className="font-bold text-[#1E293B]">{course.lectures?.length || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>{locale === 'ar' ? 'الاختبار النهائي:' : 'Final Examination:'}</span>
                                        <span className="font-bold text-[#1E293B]">{course.exams?.length > 0 ? (locale === 'ar' ? 'مشمول' : 'Included') : '—'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>{locale === 'ar' ? 'شهادة إتمام معتمدة:' : 'Digital Certificate:'}</span>
                                        <span className="font-bold text-[#16A34A]">✓ {locale === 'ar' ? 'متاحة عند الاجتياز' : 'Upon Completion'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Syllabus and Instructors Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left Syllabus Column */}
                        <div className="lg:col-span-8 flex flex-col gap-8">
                            {/* Course Syllabus */}
                            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2.5">
                                        <Video className="w-5 h-5 text-[#2060A3]" />
                                        <h2 className="text-xl sm:text-2xl font-bold text-[#002043]">
                                            {locale === 'ar' ? 'محتوى المقرر والمحاضرات' : 'Course Syllabus & Lectures'}
                                        </h2>
                                    </div>
                                    <span className="text-xs font-semibold text-[#64748B]">
                                        {course.lectures?.length || 0} {t('lectures')}
                                    </span>
                                </div>

                                <div className="divide-y divide-[#F1F5F9]">
                                    {course.lectures?.map((lecture: any, idx: number) => {
                                        const lecTitle = locale === 'ar' ? lecture.title_ar : lecture.title_en;
                                        const lecDesc = locale === 'ar' ? lecture.description_ar : lecture.description_en;

                                        return (
                                            <div key={lecture.id} className="py-4 flex items-start gap-4 hover:bg-[#F8FAFC] px-2 rounded-xl transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-[#E7EEFF] text-[#002043] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                                    #{lecture.position || idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-[#002043]">{lecTitle}</h4>
                                                    {lecDesc && <p className="text-xs text-[#64748B] mt-1">{lecDesc}</p>}
                                                </div>
                                                <span className="text-xs text-[#64748B] font-medium shrink-0 flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5 text-[#2060A3]" />
                                                    {lecture.duration_minutes} min
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Requirements & Completion Rules */}
                            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs flex flex-col gap-4">
                                <div className="flex items-center gap-2.5">
                                    <ShieldCheck className="w-5 h-5 text-[#D6A84F]" />
                                    <h2 className="text-xl sm:text-2xl font-bold text-[#002043]">
                                        {locale === 'ar' ? 'معايير اجتياز المقرر والشهادة' : 'Completion & Certificate Criteria'}
                                    </h2>
                                </div>
                                <ul className="space-y-2.5 text-xs sm:text-sm text-[#43474E]">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
                                        <span>{locale === 'ar' ? 'إتمام مشاهدة جميع المحاضرات المرئية المعتمدة للمقرر.' : 'Watch and complete all required video lectures.'}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
                                        <span>{locale === 'ar' ? `اجتياز الاختبار النهائي الشامل بدرجة لا تقل عن ${course.passing_score}%.` : `Pass the comprehensive final examination with at least ${course.passing_score}%.`}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
                                        <span>{locale === 'ar' ? 'إصدار فوري لشهادة رقمية موثقة بكود استجابة QR مسجلة بجامعة سوهاج.' : 'Instant issuance of university verified digital certificate with QR code.'}</span>
                                    </li>
                                </ul>
                            </section>
                        </div>

                        {/* Right Faculty Column */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            {leadTeacher && (
                                <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col gap-4">
                                    <span className="text-xs font-bold text-[#2060A3] uppercase tracking-wider">
                                        {locale === 'ar' ? 'المحاضر وأستاذ المقرر' : 'Course Instructor'}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-[#17365D] text-white flex items-center justify-center font-bold text-base uppercase">
                                            {leadTeacher.name.substring(0, 2)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-[#002043]">{leadTeacher.name}</span>
                                            <span className="text-xs text-[#64748B]">
                                                {locale === 'ar' ? leadTeacher.pivot?.role_title_ar ?? 'أستاذ المقرر' : leadTeacher.pivot?.role_title_en ?? 'Lead Professor'}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-[#64748B] leading-relaxed">
                                        {locale === 'ar'
                                            ? 'عضو هيئة تدريس معتمد بجامعة سوهاج ومشرف على التطوير المهني والأكاديمي للمقرر.'
                                            : 'Sohag University faculty member supervising professional curriculum development.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

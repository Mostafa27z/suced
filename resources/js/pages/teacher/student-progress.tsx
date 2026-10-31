import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import {
    Users,
    CheckCircle2,
    Clock,
    BookOpen,
    Mail,
    Phone,
    Shield
} from 'lucide-react';

interface EnrollmentItem {
    id: number;
    status: string;
    enrolled_at: string;
    completed_at?: string;
    user: {
        id: number;
        name: string;
        email: string;
        phone?: string;
        national_id?: string;
    };
    course: {
        id: number;
        title_en: string;
        title_ar: string;
        code: string;
    };
}

interface Props {
    enrollments: {
        data: EnrollmentItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function TeacherStudentProgress({ enrollments }: Props) {
    const { t, locale, isRtl } = useTranslation();

    return (
        <AuthenticatedLayout
            title={locale === 'ar' ? 'متابعة تقدم الطلاب' : 'Enrolled Student Progress'}
            breadcrumb={locale === 'ar' ? 'سجل الطلاب' : 'Student Progress'}
        >
            <Head title={locale === 'ar' ? 'متابعة تقدم الطلاب - SUCED' : 'Student Progress - SUCED'} />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-[#17365D]">
                            {locale === 'ar' ? 'سجل الطلاب المسجلين وتقدمهم' : 'Enrolled Students & Progress Ledger'}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            {locale === 'ar'
                                ? `إجمالي الطلاب المقيدين في مقرراتك التدريبية: ${enrollments.total} طالب.`
                                : `Total active learners registered across your assigned courses: ${enrollments.total}.`}
                        </p>
                    </div>
                </div>

                {/* Table */}
                {enrollments.data.length === 0 ? (
                    <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                        <Users className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="font-bold text-slate-800 text-base">
                            {locale === 'ar' ? 'لا يوجد طلاب مسجلين حالياً' : 'No Enrolled Students'}
                        </h3>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'اسم الطالب' : 'Student Name'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'المقرر المسجل' : 'Course'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'تاريخ التسجيل' : 'Enrolled Date'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'حالة المقرر' : 'Status'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'بيانات الاتصال' : 'Contact'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {enrollments.data.map((enr) => (
                                        <tr key={enr.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3.5 px-4 font-semibold text-[#17365D]">
                                                {enr.user?.name}
                                                {enr.user?.national_id && (
                                                    <span className="block text-[11px] font-mono text-slate-400">
                                                        ID: {enr.user.national_id}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="font-semibold text-slate-800 block">
                                                    {locale === 'ar' ? enr.course?.title_ar : enr.course?.title_en}
                                                </span>
                                                <span className="text-[11px] text-slate-400 font-mono">
                                                    {enr.course?.code}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-slate-600">
                                                {enr.enrolled_at}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {enr.status === 'completed' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        <span>{locale === 'ar' ? 'أتم المتطلبات' : 'Completed'}</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563A6] text-xs font-bold border border-blue-200">
                                                        <span>{locale === 'ar' ? 'قيد الدراسة' : 'In Progress'}</span>
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-slate-500">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="w-3 h-3 text-slate-400" />
                                                        {enr.user?.email}
                                                    </span>
                                                    {enr.user?.phone && (
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="w-3 h-3 text-slate-400" />
                                                            {enr.user.phone}
                                                        </span>
                                                    )}
                                                </div>
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

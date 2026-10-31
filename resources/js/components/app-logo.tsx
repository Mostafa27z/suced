import React from 'react';
import { useTranslation } from '@/lib/i18n';

export default function AppLogo() {
    const { locale } = useTranslation();

    return (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#17365D] text-white flex items-center justify-center font-bold text-xl shadow-md border border-[#D6A84F]/40 shrink-0">
                S
            </div>
            <div className="flex flex-col text-start">
                <span className="font-extrabold text-lg text-[#17365D] leading-none tracking-tight">
                    SUCED
                </span>
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mt-0.5">
                    {locale === 'ar' ? 'جامعة سوهاج' : 'Sohag University'}
                </span>
            </div>
        </div>
    );
}

@php
    $theme = $template['theme'] ?? 'classic_navy';
    $borderStyle = $template['border_style'] ?? 'classic_double';
    $isArabic = ($lang ?? 'en') === 'ar';

    // Theme color definitions
    $palettes = [
        'classic_navy' => [
            'primary' => '#17365D',
            'accent' => '#D6A84F',
            'secondary' => '#2563A6',
            'bg' => '#FFFFFF',
            'page_bg' => '#F7F9FC',
            'badge_bg' => '#FEF3C7',
            'badge_text' => '#92400E',
            'text_muted' => '#64748B',
        ],
        'royal_gold' => [
            'primary' => '#78350F',
            'accent' => '#D97706',
            'secondary' => '#B45309',
            'bg' => '#FFFDF7',
            'page_bg' => '#FEFCE8',
            'badge_bg' => '#FEF3C7',
            'badge_text' => '#92400E',
            'text_muted' => '#78716C',
        ],
        'emerald_heritage' => [
            'primary' => '#064E3B',
            'accent' => '#059669',
            'secondary' => '#047857',
            'bg' => '#FFFFFF',
            'page_bg' => '#F0FDF4',
            'badge_bg' => '#D1FAE5',
            'badge_text' => '#065F46',
            'text_muted' => '#4B5563',
        ],
        'burgundy_excellence' => [
            'primary' => '#701A75',
            'accent' => '#C026D3',
            'secondary' => '#86198F',
            'bg' => '#FFFFFF',
            'page_bg' => '#FDF4FF',
            'badge_bg' => '#FCE7F3',
            'badge_text' => '#831843',
            'text_muted' => '#6B7280',
        ],
        'slate_modern' => [
            'primary' => '#0F172A',
            'accent' => '#2563A6',
            'secondary' => '#334155',
            'bg' => '#FFFFFF',
            'page_bg' => '#F8FAFC',
            'badge_bg' => '#E2E8F0',
            'badge_text' => '#1E293B',
            'text_muted' => '#64748B',
        ],
    ];

    $palette = $palettes[$theme] ?? $palettes['classic_navy'];
@endphp
<!DOCTYPE html>
<html lang="{{ $isArabic ? 'ar' : 'en' }}" dir="{{ $isArabic ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="utf-8">
    <title>{{ $content['certificate_title'] }} - {{ $certificate->certificate_number }}</title>
    <style>
        @page {
            size: a4 landscape;
            margin: 0;
        }
        body {
            font-family: 'DejaVu Sans', 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 24px;
            background-color: {{ $palette['page_bg'] }};
            color: #1E293B;
            direction: {{ $isArabic ? 'rtl' : 'ltr' }};
            -webkit-print-color-adjust: exact;
        }

        /* Border Styles */
        @if($borderStyle === 'modern_clean')
            .cert-container {
                border: 3px solid {{ $palette['primary'] }};
                padding: 24px;
                background-color: {{ $palette['bg'] }};
                min-height: 495px;
                position: relative;
                box-sizing: border-box;
                border-top: 10px solid {{ $palette['accent'] }};
                border-bottom: 10px solid {{ $palette['primary'] }};
            }
        @elseif($borderStyle === 'vintage_ornate')
            .cert-container {
                border: 1px solid {{ $palette['accent'] }};
                padding: 6px;
                background-color: {{ $palette['bg'] }};
                min-height: 495px;
                position: relative;
                box-sizing: border-box;
            }
            .inner-border-ornate {
                border: 5px double {{ $palette['primary'] }};
                padding: 20px;
                min-height: 475px;
            }
        @else
            /* classic_double default */
            .cert-container {
                border: 8px double {{ $palette['primary'] }};
                padding: 24px;
                background-color: {{ $palette['bg'] }};
                min-height: 495px;
                position: relative;
                box-sizing: border-box;
            }
        @endif

        /* Corner accents for classic & ornate */
        .corner-accent {
            position: absolute;
            width: 32px;
            height: 32px;
        }
        .corner-tl {
            top: 5px;
            left: 5px;
            border-top: 3px solid {{ $palette['accent'] }};
            border-left: 3px solid {{ $palette['accent'] }};
        }
        .corner-tr {
            top: 5px;
            right: 5px;
            border-top: 3px solid {{ $palette['accent'] }};
            border-right: 3px solid {{ $palette['accent'] }};
        }
        .corner-bl {
            bottom: 5px;
            left: 5px;
            border-bottom: 3px solid {{ $palette['accent'] }};
            border-left: 3px solid {{ $palette['accent'] }};
        }
        .corner-br {
            bottom: 5px;
            right: 5px;
            border-bottom: 3px solid {{ $palette['accent'] }};
            border-right: 3px solid {{ $palette['accent'] }};
        }

        /* Watermark Seal */
        .watermark-seal {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -140px;
            margin-left: -140px;
            width: 280px;
            height: 280px;
            border-radius: 50%;
            border: 12px double {{ $palette['primary'] }};
            opacity: 0.04;
            pointer-events: none;
            text-align: center;
            line-height: 250px;
            font-size: 80px;
            font-weight: bold;
            color: {{ $palette['primary'] }};
        }

        .header {
            text-align: center;
            margin-bottom: 12px;
        }
        .univ-title {
            font-size: 20px;
            font-weight: bold;
            color: {{ $palette['primary'] }};
            text-transform: uppercase;
            letter-spacing: {{ $isArabic ? '0' : '2px' }};
            margin: 0;
            line-height: 1.3;
        }
        .center-title {
            font-size: 13px;
            color: {{ $palette['secondary'] }};
            margin-top: 4px;
            font-weight: 600;
            line-height: 1.3;
        }
        .cert-heading-wrap {
            margin: 14px 0 8px 0;
            text-align: center;
        }
        .cert-heading {
            font-size: 24px;
            font-weight: bold;
            color: {{ $palette['primary'] }};
            text-transform: uppercase;
            letter-spacing: {{ $isArabic ? '0' : '1.5px' }};
            border-bottom: 2px solid {{ $palette['accent'] }};
            display: inline-block;
            padding-bottom: 4px;
            line-height: 1.3;
        }
        .body-text {
            font-size: 13px;
            color: {{ $palette['text_muted'] }};
            margin: 6px 0;
            line-height: 1.4;
        }
        .recipient-name {
            font-family: 'DejaVu Sans', 'Helvetica Neue', Arial, sans-serif;
            font-size: 26px;
            font-weight: bold;
            color: {{ $palette['primary'] }};
            margin: 10px 0;
            text-decoration: underline;
            text-decoration-color: {{ $palette['accent'] }};
            line-height: 1.3;
        }
        .course-title {
            font-size: 20px;
            font-weight: bold;
            color: {{ $palette['secondary'] }};
            margin: 8px 0 6px 0;
            line-height: 1.4;
        }
        .score-badge {
            display: inline-block;
            background-color: {{ $palette['badge_bg'] }};
            color: {{ $palette['badge_text'] }};
            padding: 4px 14px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            margin-top: 4px;
        }
        .footer-table {
            width: 100%;
            margin-top: 26px;
            border-collapse: collapse;
        }
        .footer-table td {
            vertical-align: bottom;
            text-align: center;
            width: 33.33%;
        }
        .signature-line {
            width: 160px;
            border-top: 1px solid {{ $palette['primary'] }};
            margin: 0 auto 5px auto;
        }
        .signature-name {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11.5px;
            color: {{ $palette['primary'] }};
            font-weight: bold;
            line-height: 1.3;
        }
        .signature-title {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 9.5px;
            color: {{ $palette['text_muted'] }};
            margin-top: 2px;
            line-height: 1.3;
        }
        .qr-box {
            display: inline-block;
            border: 1px solid #CBD5E1;
            padding: 6px 10px;
            background: #F8FAFC;
            border-radius: 6px;
            font-size: 9px;
            line-height: 1.4;
        }
        .cert-id {
            font-family: monospace;
            font-size: 10px;
            font-weight: bold;
            color: {{ $palette['primary'] }};
        }
        .valid-stamp {
            color: #16A34A;
            font-weight: bold;
            font-size: 10px;
        }
    </style>
</head>
<body>
    <div class="cert-container">
        @if($borderStyle === 'vintage_ornate')
            <div class="inner-border-ornate">
        @endif

        @if(!empty($template['show_watermark']))
            <div class="watermark-seal">SUCED</div>
        @endif

        @if($borderStyle !== 'modern_clean')
            <div class="corner-accent corner-tl"></div>
            <div class="corner-accent corner-tr"></div>
            <div class="corner-accent corner-bl"></div>
            <div class="corner-accent corner-br"></div>
        @endif

        <!-- Header / Auspices -->
        <div class="header">
            <h1 class="univ-title">{{ $content['org_name'] }}</h1>
            @if(!empty($content['center_name']))
                <div class="center-title">{{ $content['center_name'] }}</div>
            @endif

            <div class="cert-heading-wrap">
                <div class="cert-heading">{{ $content['certificate_title'] }}</div>
            </div>
        </div>

        <!-- Body & Recipient -->
        <div style="text-align: center;">
            <p class="body-text">{{ $content['intro_text'] }}</p>
            <div class="recipient-name">{{ $content['student_name'] }}</div>
            <p class="body-text">{{ $content['completion_text'] }}</p>
            <div class="course-title">{{ $content['course_title'] }}</div>

            @if(!empty($template['show_grade']))
                <div>
                    <span class="score-badge">{{ $content['grade_badge'] }}</span>
                </div>
            @endif
        </div>

        <!-- Signatories & Verification Ledger -->
        <table class="footer-table">
            <tr>
                @if($isArabic)
                    <!-- Arabic RTL: Signatory 1 (Right in RTL), QR (Center), Signatory 2 (Left in RTL) -->
                    <td>
                        <div class="signature-line"></div>
                        <div class="signature-name">{{ $content['signatory1_name'] }}</div>
                        <div class="signature-title">{{ $content['signatory1_title'] }}</div>
                    </td>

                    <td>
                        @if(!empty($template['show_qr']))
                            <div class="qr-box" style="text-align: center;">
                                <div style="margin-bottom: 2px;">
                                    <span class="valid-stamp">✓ {{ $content['verified_stamp'] }}</span>
                                </div>
                                <div>{{ $content['serial_label'] }} <span class="cert-id">{{ $certificate->certificate_number }}</span></div>
                                <div>{{ $content['issue_date_label'] }} <strong>{{ \Carbon\Carbon::parse($certificate->issue_date)->format('Y-m-d') }}</strong></div>
                                <div style="font-size: 7.5px; color: {{ $palette['text_muted'] }}; margin-top: 2px;">
                                    {{ $content['verify_label'] }} {{ $certificate->public_code }}
                                </div>
                            </div>
                        @endif
                    </td>

                    <td>
                        <div class="signature-line"></div>
                        <div class="signature-name">{{ $content['signatory2_name'] }}</div>
                        <div class="signature-title">{{ $content['signatory2_title'] }}</div>
                    </td>
                @else
                    <!-- English LTR: Signatory 1 (Left), QR (Center), Signatory 2 (Right) -->
                    <td>
                        <div class="signature-line"></div>
                        <div class="signature-name">{{ $content['signatory1_name'] }}</div>
                        <div class="signature-title">{{ $content['signatory1_title'] }}</div>
                    </td>

                    <td>
                        @if(!empty($template['show_qr']))
                            <div class="qr-box" style="text-align: left;">
                                <div style="margin-bottom: 2px;">
                                    <span class="valid-stamp">{{ $content['verified_stamp'] }}</span>
                                </div>
                                <div>{{ $content['serial_label'] }} <span class="cert-id">{{ $certificate->certificate_number }}</span></div>
                                <div>{{ $content['issue_date_label'] }} <strong>{{ \Carbon\Carbon::parse($certificate->issue_date)->format('F d, Y') }}</strong></div>
                                <div style="font-size: 7.5px; color: {{ $palette['text_muted'] }}; margin-top: 2px;">
                                    {{ $content['verify_label'] }} /verify/{{ $certificate->public_code }}
                                </div>
                            </div>
                        @endif
                    </td>

                    <td>
                        <div class="signature-line"></div>
                        <div class="signature-name">{{ $content['signatory2_name'] }}</div>
                        <div class="signature-title">{{ $content['signatory2_title'] }}</div>
                    </td>
                @endif
            </tr>
        </table>

        @if($borderStyle === 'vintage_ornate')
            </div>
        @endif
    </div>
</body>
</html>

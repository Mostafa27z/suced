<?php

namespace Database\Seeders;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\ExamAttemptAnswer;
use App\Models\Lecture;
use App\Models\LectureProgress;
use App\Models\PlatformNotification;
use App\Models\PlatformSetting;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SucedDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Administrator
        $admin = User::firstOrCreate(
            ['email' => 'admin@suced.sohag.edu.eg'],
            [
                'name' => 'Prof. Dr. Mostafa Kamel',
                'password' => Hash::make('Password123!'),
                'role' => 'admin',
                'national_id' => '27801012600123',
                'phone' => '+20 100 123 4567',
                'locale' => 'en',
                'is_active' => true,
            ]
        );

        // 2. Create Teachers
        $teacherAI = User::firstOrCreate(
            ['email' => 'tamer@suced.sohag.edu.eg'],
            [
                'name' => 'Dr. Tamer Mostafa',
                'password' => Hash::make('Password123!'),
                'role' => 'teacher',
                'national_id' => '28203052600456',
                'phone' => '+20 101 234 5678',
                'locale' => 'en',
                'is_active' => true,
            ]
        );

        $teacherBusiness = User::firstOrCreate(
            ['email' => 'salma@suced.sohag.edu.eg'],
            [
                'name' => 'Dr. Salma El-Sayed',
                'password' => Hash::make('Password123!'),
                'role' => 'teacher',
                'national_id' => '28607122600789',
                'phone' => '+20 102 345 6789',
                'locale' => 'en',
                'is_active' => true,
            ]
        );

        $teacherEngineering = User::firstOrCreate(
            ['email' => 'mahmoud@suced.sohag.edu.eg'],
            [
                'name' => 'Eng. Mahmoud Hassan',
                'password' => Hash::make('Password123!'),
                'role' => 'teacher',
                'national_id' => '28911042600987',
                'phone' => '+20 103 456 7890',
                'locale' => 'en',
                'is_active' => true,
            ]
        );

        $teacherMedical = User::firstOrCreate(
            ['email' => 'mona@suced.sohag.edu.eg'],
            [
                'name' => 'Dr. Mona Zaki',
                'password' => Hash::make('Password123!'),
                'role' => 'teacher',
                'national_id' => '29105082600112',
                'phone' => '+20 104 567 8901',
                'locale' => 'en',
                'is_active' => true,
            ]
        );

        // 3. Create Students
        $studentAhmed = User::firstOrCreate(
            ['email' => 'ahmed@suced.sohag.edu.eg'],
            [
                'name' => 'Ahmed Mansour Badawi',
                'password' => Hash::make('Password123!'),
                'role' => 'student',
                'national_id' => '29804152600321',
                'phone' => '+20 111 888 9999',
                'locale' => 'en',
                'is_active' => true,
            ]
        );

        $studentNouran = User::firstOrCreate(
            ['email' => 'nouran@suced.sohag.edu.eg'],
            [
                'name' => 'Nouran Hesham Fawzy',
                'password' => Hash::make('Password123!'),
                'role' => 'student',
                'national_id' => '30109202600654',
                'phone' => '+20 112 777 6666',
                'locale' => 'ar',
                'is_active' => true,
            ]
        );

        $studentDemo = User::firstOrCreate(
            ['email' => 'student@suced.sohag.edu.eg'],
            [
                'name' => 'Tarek Ibrahim',
                'password' => Hash::make('Password123!'),
                'role' => 'student',
                'national_id' => '29908122600555',
                'phone' => '+20 115 444 3333',
                'locale' => 'en',
                'is_active' => true,
            ]
        );

        // 4. Create Platform Settings
        PlatformSetting::set('platform_name_en', 'SUCED — Sohag University Continuing Education');
        PlatformSetting::set('platform_name_ar', 'مركز التعليم المستمر وتطوير المهارات — جامعة سوهاج');
        PlatformSetting::set('default_passing_score', 70, 'integer');
        PlatformSetting::set('enable_registration', true, 'boolean');

        // 5. Create Courses
        // Course 1: AI
        $courseAI = Course::create([
            'slug' => 'introduction-to-artificial-intelligence',
            'code' => 'AI-501',
            'department' => 'technology',
            'title_en' => 'Introduction to Artificial Intelligence',
            'title_ar' => 'مقدمة في الذكاء الاصطناعي',
            'description_en' => 'Comprehensive foundations of machine learning, neural networks, computer vision, prompt engineering, and ethical AI applications.',
            'description_ar' => 'أسس شاملة في تعلم الآلة، الشبكات العصبية، الرؤية الحاسوبية، وهندسة الأوامر وتطبيقات الذكاء الاصطناعي الأخلاقية.',
            'thumbnail' => '/images/stitch/ai_computer_lab.png',
            'duration_weeks' => 8,
            'duration_hours' => 32,
            'rating' => 4.90,
            'reviews_count' => 1240,
            'passing_score' => 70,
            'is_published' => true,
            'published_at' => now()->subMonths(3),
            'created_by' => $admin->id,
        ]);
        $courseAI->teachers()->attach($teacherAI->id, [
            'role_title_en' => 'Faculty Chair & Lead Professor',
            'role_title_ar' => 'رئيس القسم وأستاذ المقرر',
        ]);

        // Lectures for Course 1
        $lec1 = Lecture::create([
            'course_id' => $courseAI->id,
            'position' => 1,
            'title_en' => 'AI Foundations & Historical Milestones',
            'title_ar' => 'مقدمة في الذكاء الاصطناعي وتاريخه',
            'description_en' => 'Core concepts of intelligent agents, Turing tests, and rational decision architectures.',
            'description_ar' => 'المفاهيم الجوهرية للأنظمة الذكية، اختبار تورينج، وهياكل اتخاذ القرار الرشيد.',
            'youtube_url' => 'https://www.youtube.com/watch?v=JMUxmLyrhSk',
            'duration_minutes' => 35,
            'is_published' => true,
            'created_by' => $teacherAI->id,
        ]);

        $lec2 = Lecture::create([
            'course_id' => $courseAI->id,
            'position' => 2,
            'title_en' => 'Machine Learning vs Deep Learning Paradigms',
            'title_ar' => 'التعلم الآلي مقابل التعلم العميق',
            'description_en' => 'Distinctions between supervised, unsupervised, and reinforcement algorithms in Python.',
            'description_ar' => 'الفروق بين خوارزميات التعلم الخاضع للإشراف وغير الخاضع للإشراف وتعلم التعزيز.',
            'youtube_url' => 'https://www.youtube.com/watch?v=ukzFI9rgwfU',
            'duration_minutes' => 42,
            'is_published' => true,
            'created_by' => $teacherAI->id,
        ]);

        $lec3 = Lecture::create([
            'course_id' => $courseAI->id,
            'position' => 3,
            'title_en' => 'Neural Network Architecture & Backpropagation',
            'title_ar' => 'بنية الشبكات العصبية والانتشار الخلفي',
            'description_en' => 'Perceptrons, activation functions, loss optimization, and gradient descent calculations.',
            'description_ar' => 'المدركات، دوال التنشيط، تحسين دوال الخسارة، وحسابات الانحدار التدريجي.',
            'youtube_url' => 'https://www.youtube.com/watch?v=aircAruvnKk',
            'duration_minutes' => 48,
            'is_published' => true,
            'created_by' => $teacherAI->id,
        ]);

        $lec4 = Lecture::create([
            'course_id' => $courseAI->id,
            'position' => 4,
            'title_en' => 'Ethical AI & Societal Impact',
            'title_ar' => 'أخلاقيات الذكاء الاصطناعي والأثر المجتمعي',
            'description_en' => 'Algorithmic bias, data privacy governance, transparency, and European AI compliance standards.',
            'description_ar' => 'التحيز الخوارزمي، حوكمة خصوصية البيانات، الشفافية، ومعايير الامتثال الأوروبية للذكاء الاصطناعي.',
            'youtube_url' => 'https://www.youtube.com/watch?v=ea4jY0B33y4',
            'duration_minutes' => 30,
            'is_published' => true,
            'created_by' => $teacherAI->id,
        ]);

        // Exam for Course 1
        $examAI = Exam::create([
            'course_id' => $courseAI->id,
            'title_en' => 'AI Comprehensive Final Examination',
            'title_ar' => 'الاختبار النهائي الشامل للذكاء الاصطناعي',
            'instructions_en' => 'This examination covers all 4 modules. You have 30 minutes to complete 4 questions. A passing score of 70% is required for graduation.',
            'instructions_ar' => 'يغطي هذا الاختبار جميع الوحدات الأربع. لديك 30 دقيقة للإجابة على 4 أسئلة. يلزم تحقيق 70% على الأقل لاجتياز المقرر.',
            'duration_minutes' => 30,
            'passing_score' => 70,
            'max_attempts' => 3,
            'is_final' => true,
            'is_published' => true,
            'created_by' => $teacherAI->id,
        ]);

        // Questions for Exam 1
        $q1 = Question::create([
            'exam_id' => $examAI->id,
            'position' => 1,
            'question_type' => 'multiple_choice',
            'points' => 25,
            'question_text_en' => 'What is the primary objective of the Backpropagation algorithm in neural networks?',
            'question_text_ar' => 'ما هو الهدف الأساسي من خوارزمية الانتشار الخلفي (Backpropagation) في الشبكات العصبية؟',
            'explanation_en' => 'Backpropagation calculates gradients of the loss function with respect to weights to optimize parameters via gradient descent.',
            'explanation_ar' => 'تقوم الخوارزمية بحساب تدرجات دالة الخسارة بالنسبة للأوزان لتعديلها عبر الانحدار التدريجي.',
        ]);
        QuestionOption::create(['question_id' => $q1->id, 'position' => 1, 'is_correct' => false, 'option_text_en' => 'To initialize random weights', 'option_text_ar' => 'لتهيئة الأوزان العشوائية']);
        QuestionOption::create(['question_id' => $q1->id, 'position' => 2, 'is_correct' => true, 'option_text_en' => 'To compute gradients of the loss function and update network weights', 'option_text_ar' => 'لحساب تدرجات دالة الخسارة وتحديث أوزان الشبكة العصبية']);
        QuestionOption::create(['question_id' => $q1->id, 'position' => 3, 'is_correct' => false, 'option_text_en' => 'To convert audio signals to text', 'option_text_ar' => 'لتحويل الإشارات الصوتية إلى نص']);
        QuestionOption::create(['question_id' => $q1->id, 'position' => 4, 'is_correct' => false, 'option_text_en' => 'To normalize pixel values in images', 'option_text_ar' => 'لتوحيد قيم البكسل في الصور']);

        $q2 = Question::create([
            'exam_id' => $examAI->id,
            'position' => 2,
            'question_type' => 'true_false',
            'points' => 25,
            'question_text_en' => 'Supervised learning algorithms require labeled ground-truth training datasets.',
            'question_text_ar' => 'تتطلب خوارزميات التعلم الخاضع للإشراف (Supervised Learning) بيانات تدريب معنونة مسبقاً (Labeled Data).',
            'explanation_en' => 'True: Supervised learning maps inputs to known targets provided during training.',
            'explanation_ar' => 'صحيح: يتطلب التعلم الخاضع للإشراف أزواجاً من المدخلات والمخرجات المستهدفة المعروفة.',
        ]);
        QuestionOption::create(['question_id' => $q2->id, 'position' => 1, 'is_correct' => true, 'option_text_en' => 'True', 'option_text_ar' => 'صحيح']);
        QuestionOption::create(['question_id' => $q2->id, 'position' => 2, 'is_correct' => false, 'option_text_en' => 'False', 'option_text_ar' => 'خطأ']);

        $q3 = Question::create([
            'exam_id' => $examAI->id,
            'position' => 3,
            'question_type' => 'multiple_choice',
            'points' => 25,
            'question_text_en' => 'Which activation function is most widely used in hidden layers of modern deep convolutional networks?',
            'question_text_ar' => 'أي من دوال التنشيط التالية تعد الأكثر استخداماً في الطبقات الخفية للشبكات العصبية العميقة؟',
            'explanation_en' => 'ReLU (Rectified Linear Unit) avoids vanishing gradients and is computationally efficient.',
            'explanation_ar' => 'دالة ReLU تمنع مشكلة تلاشي التدرجات وتمتاز بكفاءة حسابية عالية.',
        ]);
        QuestionOption::create(['question_id' => $q3->id, 'position' => 1, 'is_correct' => false, 'option_text_en' => 'Sigmoid', 'option_text_ar' => 'دالة Sigmoid']);
        QuestionOption::create(['question_id' => $q3->id, 'position' => 2, 'is_correct' => true, 'option_text_en' => 'ReLU (Rectified Linear Unit)', 'option_text_ar' => 'دالة ReLU الخطية']);
        QuestionOption::create(['question_id' => $q3->id, 'position' => 3, 'is_correct' => false, 'option_text_en' => 'Linear Identity', 'option_text_ar' => 'الدالة الخطية المحايدة']);
        QuestionOption::create(['question_id' => $q3->id, 'position' => 4, 'is_correct' => false, 'option_text_en' => 'Step function', 'option_text_ar' => 'دالة الخطوة الثنائية']);

        $q4 = Question::create([
            'exam_id' => $examAI->id,
            'position' => 4,
            'question_type' => 'true_false',
            'points' => 25,
            'question_text_en' => 'Algorithmic bias can emerge when training data reflects historical human disparities.',
            'question_text_ar' => 'يمكن أن ينشأ التحيز الخوارزمي عندما تعكس بيانات التدريب فوارق وتفاوتات بشرية تاريخية.',
            'explanation_en' => 'True: Machine learning models replicate and often amplify patterns present in historical datasets.',
            'explanation_ar' => 'صحيح: نماذج تعلم الآلة تستنسخ وتضخم الأنماط الموجودة في مجموعات البيانات التاريخية.',
        ]);
        QuestionOption::create(['question_id' => $q4->id, 'position' => 1, 'is_correct' => true, 'option_text_en' => 'True', 'option_text_ar' => 'صحيح']);
        QuestionOption::create(['question_id' => $q4->id, 'position' => 2, 'is_correct' => false, 'option_text_en' => 'False', 'option_text_ar' => 'خطأ']);

        // Course 2: Digital Marketing
        $courseMarketing = Course::create([
            'slug' => 'digital-marketing-fundamentals',
            'code' => 'MKT-301',
            'department' => 'business',
            'title_en' => 'Digital Marketing Fundamentals',
            'title_ar' => 'أساسيات التسويق الرقمي',
            'description_en' => 'SEO mastery, search engine marketing, omnichannel campaign strategies, conversion analytics, and content optimization.',
            'description_ar' => 'إتقان تحسين محركات البحث SEO، التسويق عبر محركات البحث، استراتيجيات الحملات متعددة القنوات، وتحليلات التحويل.',
            'thumbnail' => '/images/stitch/digital_marketing.png',
            'duration_weeks' => 6,
            'duration_hours' => 24,
            'rating' => 4.80,
            'reviews_count' => 850,
            'passing_score' => 70,
            'is_published' => true,
            'published_at' => now()->subMonths(2),
            'created_by' => $admin->id,
        ]);
        $courseMarketing->teachers()->attach($teacherBusiness->id, [
            'role_title_en' => 'Associate Professor of Marketing',
            'role_title_ar' => 'أستاذ التسويق المساعد',
        ]);

        Lecture::create([
            'course_id' => $courseMarketing->id,
            'position' => 1,
            'title_en' => 'SEO Keyword Architecture & Search Intent',
            'title_ar' => 'هندسة الكلمات المفتاحية ونية البحث',
            'youtube_url' => 'https://www.youtube.com/watch?v=xsVTqzratPs',
            'duration_minutes' => 30,
            'is_published' => true,
            'created_by' => $teacherBusiness->id,
        ]);
        Lecture::create([
            'course_id' => $courseMarketing->id,
            'position' => 2,
            'title_en' => 'Omnichannel Content Funnels',
            'title_ar' => 'قمع تحويل المحتوى متعدد القنوات',
            'youtube_url' => 'https://www.youtube.com/watch?v=1xN5-uW3-X8',
            'duration_minutes' => 38,
            'is_published' => true,
            'created_by' => $teacherBusiness->id,
        ]);

        $examMKT = Exam::create([
            'course_id' => $courseMarketing->id,
            'title_en' => 'Digital Marketing Certification Exam',
            'title_ar' => 'اختبار شهادة التسويق الرقمي',
            'instructions_en' => 'Test your mastery of SEO, funnels, and CAC/LTV calculations.',
            'instructions_ar' => 'اختبر معلوماتك في تحسين محركات البحث وحسابات تكلفة اكتساب العملاء.',
            'duration_minutes' => 25,
            'passing_score' => 70,
            'max_attempts' => 3,
            'is_final' => true,
            'is_published' => true,
            'created_by' => $teacherBusiness->id,
        ]);
        $qm1 = Question::create([
            'exam_id' => $examMKT->id,
            'position' => 1,
            'question_type' => 'multiple_choice',
            'points' => 50,
            'question_text_en' => 'What metric measures the revenue gained in relation to advertising expenditure?',
            'question_text_ar' => 'ما هو المقياس الذي يعبر عن العائد المالي المحقق مقارنة بالإنفاق الإعلاني؟',
        ]);
        QuestionOption::create(['question_id' => $qm1->id, 'position' => 1, 'is_correct' => true, 'option_text_en' => 'ROAS (Return on Ad Spend)', 'option_text_ar' => 'العائد على الإنفاق الإعلاني (ROAS)']);
        QuestionOption::create(['question_id' => $qm1->id, 'position' => 2, 'is_correct' => false, 'option_text_en' => 'CTR (Click-Through Rate)', 'option_text_ar' => 'معدل النقر (CTR)']);
        QuestionOption::create(['question_id' => $qm1->id, 'position' => 3, 'is_correct' => false, 'option_text_en' => 'Bounce Rate', 'option_text_ar' => 'معدل الارتداد']);

        $qm2 = Question::create([
            'exam_id' => $examMKT->id,
            'position' => 2,
            'question_type' => 'true_false',
            'points' => 50,
            'question_text_en' => 'Organic search traffic (SEO) typically carries lower marginal cost per acquisition over the long run compared to paid PPC.',
            'question_text_ar' => 'يمتاز الزوار القادمون عبر نتائج البحث الطبيعية (SEO) بتكلفة حدية أقل على المدى الطويل مقارنة بالإعلانات المدفوعة.',
        ]);
        QuestionOption::create(['question_id' => $qm2->id, 'position' => 1, 'is_correct' => true, 'option_text_en' => 'True', 'option_text_ar' => 'صحيح']);
        QuestionOption::create(['question_id' => $qm2->id, 'position' => 2, 'is_correct' => false, 'option_text_en' => 'False', 'option_text_ar' => 'خطأ']);

        // Course 3: Project Management
        $coursePMP = Course::create([
            'slug' => 'project-management-essentials-pmp',
            'code' => 'PMP-102',
            'department' => 'management',
            'title_en' => 'Project Management Essentials (PMP Aligned)',
            'title_ar' => 'أساسيات إدارة المشاريع الاحترافية',
            'description_en' => 'Rigorous alignment with global PMI frameworks, Work Breakdown Structures (WBS), Gantt scheduling, risk registers, and stakeholder alignment.',
            'description_ar' => 'توافق تام مع أطر معهد إدارة المشاريع PMI، هياكل تجزئة العمل WBS، جداول جانت، وإدارة المخاطر.',
            'thumbnail' => '/images/stitch/project_management.png',
            'duration_weeks' => 10,
            'duration_hours' => 40,
            'rating' => 4.90,
            'reviews_count' => 2100,
            'passing_score' => 70,
            'is_published' => true,
            'published_at' => now()->subMonths(1),
            'created_by' => $admin->id,
        ]);
        $coursePMP->teachers()->attach($teacherEngineering->id, [
            'role_title_en' => 'PMP Senior Fellow & Lead Instructor',
            'role_title_ar' => 'زميل أول إدارة المشاريع وأستاذ المقرر',
        ]);

        Lecture::create([
            'course_id' => $coursePMP->id,
            'position' => 1,
            'title_en' => 'Project Charter & Stakeholder Matrix',
            'title_ar' => 'ميثاق المشروع ومصفوفة المعنيين',
            'youtube_url' => 'https://www.youtube.com/watch?v=ZKOL_cs_3eg',
            'duration_minutes' => 35,
            'is_published' => true,
            'created_by' => $teacherEngineering->id,
        ]);
        Lecture::create([
            'course_id' => $coursePMP->id,
            'position' => 2,
            'title_en' => 'Work Breakdown Structure (WBS) & Critical Path',
            'title_ar' => 'هيكل تجزئة العمل WBS والمسار الحرج',
            'youtube_url' => 'https://www.youtube.com/watch?v=Fj2F5p5YQoA',
            'duration_minutes' => 40,
            'is_published' => true,
            'created_by' => $teacherEngineering->id,
        ]);

        // Course 4: Healthcare
        $courseHealthcare = Course::create([
            'slug' => 'professional-communication-in-healthcare',
            'code' => 'HLT-204',
            'department' => 'healthcare',
            'title_en' => 'Professional Communication in Healthcare',
            'title_ar' => 'مهارات التواصل الفعال في الرعاية الصحية',
            'description_en' => 'Interpersonal mastery, patient consultation dynamics, clinical empathy, and cross-functional leadership for health professionals.',
            'description_ar' => 'مهارات التواصل مع المرضى، استشارات العيادات، التعاطف الإكلينيكي، والقيادة المشتركة لفرق الرعاية الصحية.',
            'thumbnail' => '/images/stitch/healthcare_stethoscope.png',
            'duration_weeks' => 4,
            'duration_hours' => 16,
            'rating' => 4.70,
            'reviews_count' => 620,
            'passing_score' => 70,
            'is_published' => true,
            'published_at' => now()->subWeeks(3),
            'created_by' => $admin->id,
        ]);
        $courseHealthcare->teachers()->attach($teacherMedical->id, [
            'role_title_en' => 'Consultant of Clinical Communication',
            'role_title_ar' => 'استشاري التواصل الطبي والإكلينيكي',
        ]);

        // Course 5: Academic Research (Draft state to test drafts!)
        $courseResearch = Course::create([
            'slug' => 'academic-research-methodology',
            'code' => 'RES-101',
            'department' => 'technology',
            'title_en' => 'Academic Research Methodology',
            'title_ar' => 'منهجية البحث العلمي الأكاديمي',
            'description_en' => 'Statistical modeling, literature synthesis, citation integrity, and peer-reviewed publishing standards.',
            'description_ar' => 'النمذجة الإحصائية، مراجعة الأدبيات، النزاهة العلمية، ومعايير النشر الدولي المحكم.',
            'thumbnail' => '/images/stitch/campus_lecture_hall.png',
            'duration_weeks' => 6,
            'duration_hours' => 20,
            'rating' => 4.85,
            'reviews_count' => 140,
            'passing_score' => 70,
            'is_published' => false, // draft
            'created_by' => $admin->id,
        ]);
        $courseResearch->teachers()->attach($teacherAI->id);

        // 6. Enrollments and Progress for Ahmed Mansour
        // Ahmed completed Course 1 (AI) with a certificate!
        Enrollment::create([
            'user_id' => $studentAhmed->id,
            'course_id' => $courseAI->id,
            'status' => 'completed',
            'enrolled_at' => now()->subDays(45),
            'completed_at' => now()->subDays(5),
        ]);

        // Mark all 4 lectures completed
        LectureProgress::create(['user_id' => $studentAhmed->id, 'lecture_id' => $lec1->id, 'completed' => true, 'completed_at' => now()->subDays(40)]);
        LectureProgress::create(['user_id' => $studentAhmed->id, 'lecture_id' => $lec2->id, 'completed' => true, 'completed_at' => now()->subDays(30)]);
        LectureProgress::create(['user_id' => $studentAhmed->id, 'lecture_id' => $lec3->id, 'completed' => true, 'completed_at' => now()->subDays(20)]);
        LectureProgress::create(['user_id' => $studentAhmed->id, 'lecture_id' => $lec4->id, 'completed' => true, 'completed_at' => now()->subDays(5)]);

        // Exam attempt for Ahmed with 100%
        $attemptAhmed = ExamAttempt::create([
            'exam_id' => $examAI->id,
            'user_id' => $studentAhmed->id,
            'attempt_number' => 1,
            'started_at' => now()->subDays(5)->subMinutes(25),
            'expires_at' => now()->subDays(5)->addMinutes(5),
            'submitted_at' => now()->subDays(5),
            'time_spent_seconds' => 1500,
            'score' => 100,
            'max_score' => 100,
            'percentage' => 100.0,
            'passed' => true,
            'status' => 'completed',
        ]);

        // Certificate for Ahmed (Course 1)
        Certificate::create([
            'public_code' => '550e8400-e29b-41d4-a716-446655440000',
            'certificate_number' => 'SUCED-2025-AI-8912',
            'user_id' => $studentAhmed->id,
            'course_id' => $courseAI->id,
            'student_name' => $studentAhmed->name,
            'course_title_en' => $courseAI->title_en,
            'course_title_ar' => $courseAI->title_ar,
            'score_percentage' => 100.0,
            'issue_date' => now()->subDays(5)->toDateString(),
            'template_version' => 'v1',
            'is_revoked' => false,
        ]);

        // Ahmed is also enrolled in Course 3 (PMP) in progress!
        Enrollment::create([
            'user_id' => $studentAhmed->id,
            'course_id' => $coursePMP->id,
            'status' => 'enrolled',
            'enrolled_at' => now()->subDays(15),
        ]);

        // Ahmed is also enrolled in Course 4 (Healthcare)
        Enrollment::create([
            'user_id' => $studentAhmed->id,
            'course_id' => $courseHealthcare->id,
            'status' => 'enrolled',
            'enrolled_at' => now()->subDays(10),
        ]);

        // Certificate 2 for Ahmed (Healthcare honor certificate sample)
        Certificate::create([
            'public_code' => '7b3e9400-e29b-41d4-a716-446655440001',
            'certificate_number' => 'SUCED-2025-HLT-4410',
            'user_id' => $studentAhmed->id,
            'course_id' => $courseHealthcare->id,
            'student_name' => $studentAhmed->name,
            'course_title_en' => $courseHealthcare->title_en,
            'course_title_ar' => $courseHealthcare->title_ar,
            'score_percentage' => 94.0,
            'issue_date' => now()->subDays(20)->toDateString(),
            'template_version' => 'v1',
            'is_revoked' => false,
        ]);

        // 7. Enrollments for Nouran
        Enrollment::create([
            'user_id' => $studentNouran->id,
            'course_id' => $courseMarketing->id,
            'status' => 'completed',
            'enrolled_at' => now()->subDays(40),
            'completed_at' => now()->subDays(10),
        ]);
        Certificate::create([
            'public_code' => '9c4f1200-e29b-41d4-a716-446655440002',
            'certificate_number' => 'SUCED-2025-MKT-7419',
            'user_id' => $studentNouran->id,
            'course_id' => $courseMarketing->id,
            'student_name' => $studentNouran->name,
            'course_title_en' => $courseMarketing->title_en,
            'course_title_ar' => $courseMarketing->title_ar,
            'score_percentage' => 92.5,
            'issue_date' => now()->subDays(10)->toDateString(),
            'template_version' => 'v1',
            'is_revoked' => false,
        ]);

        // Sample Revoked Certificate for demo verification testing
        Certificate::create([
            'public_code' => 'revoked-test-certificate-uuid-999',
            'certificate_number' => 'SUCED-REVOKED-0001',
            'user_id' => $studentDemo->id,
            'course_id' => $courseAI->id,
            'student_name' => 'Former Candidate Name',
            'course_title_en' => $courseAI->title_en,
            'course_title_ar' => $courseAI->title_ar,
            'score_percentage' => 72.0,
            'issue_date' => now()->subMonths(6)->toDateString(),
            'template_version' => 'v1',
            'is_revoked' => true,
            'revocation_reason' => 'Administrative identity audit failure - revoked by University Registrar',
        ]);
    }
}

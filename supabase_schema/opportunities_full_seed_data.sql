-- ============================================================
-- STOOTAP OPPORTUNITIES - COMPLETE SEED DATA FOR TESTING
-- ============================================================
-- Run this AFTER opportunities_full_schema.sql
-- Provides sample companies, jobs, and test data
-- ============================================================

-- ============ SAMPLE COMPANIES ============
-- Note: Replace user_id values with actual user IDs from your profiles table
-- For testing, you can use any existing user IDs or create test users first

INSERT INTO companies (
    id, user_id, company_name, contact_name, contact_email, phone,
    business_type, industry, company_size, website_url, description,
    city, state, verified, status, trial_start_date, trial_end_date,
    subscription_status
) VALUES 
(
    'comp-techcorp-001',
    'test-user-company-1', -- Replace with actual user ID
    'TechCorp Solutions Pvt Ltd',
    'Rahul Sharma',
    'hr@techcorp.in',
    '+91 98765 43210',
    'technology',
    'Software Development',
    'medium',
    'https://techcorp.in',
    'Leading IT solutions company specializing in web and mobile app development. We help startups and enterprises build world-class digital products using cutting-edge technologies.',
    'Bangalore',
    'Karnataka',
    true,
    'active',
    NOW(),
    NOW() + INTERVAL '60 days',
    'trial'
),
(
    'comp-growthlab-002',
    'test-user-company-2',
    'GrowthLab Digital Marketing',
    'Priya Patel',
    'careers@growthlab.co',
    '+91 87654 32109',
    'services',
    'Digital Marketing',
    'small',
    'https://growthlab.co',
    'Full-service digital marketing agency helping brands grow through data-driven strategies, content marketing, SEO, and performance advertising.',
    'Mumbai',
    'Maharashtra',
    true,
    'active',
    NOW(),
    NOW() + INTERVAL '60 days',
    'trial'
),
(
    'comp-mediahub-003',
    'test-user-company-3',
    'MediaHub Creative Agency',
    'Arjun Reddy',
    'jobs@mediahub.io',
    '+91 76543 21098',
    'services',
    'Media & Entertainment',
    'small',
    'https://mediahub.io',
    'Creative content agency producing engaging video content, social media campaigns, and brand storytelling for modern audiences.',
    'Delhi',
    'Delhi',
    false, -- Pending verification
    'active',
    NOW(),
    NOW() + INTERVAL '60 days',
    'trial'
),
(
    'comp-dataflow-004',
    'test-user-company-4',
    'DataFlow Analytics',
    'Sneha Krishnan',
    'talent@dataflow.tech',
    '+91 65432 10987',
    'technology',
    'Data Science & Analytics',
    'medium',
    'https://dataflow.tech',
    'Data science and analytics consultancy helping businesses make data-driven decisions through advanced analytics, ML models, and AI solutions.',
    'Hyderabad',
    'Telangana',
    true,
    'active',
    NOW(),
    NOW() + INTERVAL '60 days',
    'trial'
),
(
    'comp-designstudio-005',
    'test-user-company-5',
    'DesignStudio Pro',
    'Amit Verma',
    'hello@designstudio.pro',
    '+91 54321 09876',
    'services',
    'Design & Creative',
    'small',
    'https://designstudio.pro',
    'Award-winning UI/UX design studio creating beautiful and functional digital experiences for startups and enterprises.',
    'Pune',
    'Maharashtra',
    true,
    'active',
    NOW(),
    NOW() + INTERVAL '60 days',
    'trial'
),
(
    'comp-fintech-006',
    'test-user-company-6',
    'FinEdge Technologies',
    'Vikram Malhotra',
    'hiring@finedge.in',
    '+91 43210 98765',
    'technology',
    'Fintech',
    'startup',
    'https://finedge.in',
    'Innovative fintech startup building the future of digital payments and financial inclusion in India.',
    'Mumbai',
    'Maharashtra',
    true,
    'active',
    NOW(),
    NOW() + INTERVAL '60 days',
    'trial'
);

-- ============ SAMPLE JOB POSTS ============

INSERT INTO job_posts (
    id, company_id, title, slug, role_type, category, is_paid,
    salary_min, salary_max, salary_period, experience_level, location_type,
    city, state, working_days, working_hours, is_flexible,
    description, responsibilities, required_skills,
    number_of_openings, status, admin_approved, visibility, view_count
) VALUES 
-- TechCorp Jobs
(
    'job-frontend-intern-001',
    'comp-techcorp-001',
    'Frontend Developer Intern',
    'frontend-developer-intern-techcorp-' || EXTRACT(EPOCH FROM NOW())::text,
    'internship',
    'engineering',
    true,
    15000, 25000, 'monthly',
    'fresher',
    'hybrid',
    'Bangalore', 'Karnataka',
    'Mon-Fri', '9 AM - 6 PM', true,
    'Join our dynamic team as a Frontend Developer Intern and work on cutting-edge web applications using React, TypeScript, and modern CSS frameworks. You will collaborate with senior developers to build user interfaces that delight millions of users.

What you will learn:
- Building responsive React applications
- TypeScript and modern JavaScript
- CSS frameworks like Tailwind CSS
- Git version control and agile methodologies
- Working in a professional development environment',
    '- Build responsive UI components using React and TypeScript
- Collaborate with designers to implement pixel-perfect interfaces
- Write clean, maintainable, and well-documented code
- Participate in code reviews and team discussions
- Learn and apply best practices in frontend development',
    '["React", "JavaScript", "TypeScript", "HTML", "CSS", "Git"]',
    3, 'active', true, 'featured', 156
),
(
    'job-backend-dev-002',
    'comp-techcorp-001',
    'Backend Developer',
    'backend-developer-techcorp-' || EXTRACT(EPOCH FROM NOW())::text,
    'full-time',
    'engineering',
    true,
    50000, 80000, 'monthly',
    'mid-level',
    'hybrid',
    'Bangalore', 'Karnataka',
    'Mon-Fri', '10 AM - 7 PM', true,
    'Build scalable backend systems using Node.js and cloud technologies. Work on microservices architecture serving millions of requests daily.',
    '- Design and implement RESTful APIs
- Build microservices using Node.js/Express
- Work with PostgreSQL, MongoDB, and Redis
- Deploy and manage AWS/GCP infrastructure
- Write unit tests and integration tests',
    '["Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker", "REST APIs", "MongoDB"]',
    2, 'active', true, 'featured', 198
),
-- GrowthLab Jobs
(
    'job-marketing-exec-003',
    'comp-growthlab-002',
    'Marketing Executive',
    'marketing-executive-growthlab-' || EXTRACT(EPOCH FROM NOW())::text,
    'full-time',
    'marketing',
    true,
    30000, 45000, 'monthly',
    'entry-level',
    'onsite',
    'Mumbai', 'Maharashtra',
    'Mon-Sat', '10 AM - 7 PM', false,
    'Drive marketing campaigns and brand growth for our expanding client portfolio. You will work on exciting projects across industries including fintech, e-commerce, and B2B SaaS.',
    '- Plan and execute digital marketing campaigns
- Manage social media accounts and content calendars
- Analyze campaign performance and optimize ROI
- Coordinate with creative teams for content production
- Build and maintain client relationships',
    '["Digital Marketing", "Social Media", "Google Analytics", "Content Writing", "SEO", "Facebook Ads"]',
    2, 'active', true, 'standard', 89
),
(
    'job-sdr-004',
    'comp-growthlab-002',
    'Sales Development Representative',
    'sdr-growthlab-' || EXTRACT(EPOCH FROM NOW())::text,
    'full-time',
    'sales',
    true,
    25000, 35000, 'monthly',
    'entry-level',
    'onsite',
    'Mumbai', 'Maharashtra',
    'Mon-Sat', '9 AM - 6 PM', false,
    'Generate leads and build customer relationships for our B2B marketing services. Great opportunity to kickstart a career in tech sales.',
    '- Generate and qualify leads through outbound outreach
- Schedule demos and meetings for senior sales team
- Maintain accurate records in CRM
- Research prospects and industry trends
- Meet monthly targets for qualified leads',
    '["Communication", "Sales", "CRM", "LinkedIn", "Cold Calling", "Lead Generation"]',
    3, 'active', true, 'standard', 67
),
-- MediaHub Jobs
(
    'job-content-writer-005',
    'comp-mediahub-003',
    'Content Writer Intern',
    'content-writer-intern-mediahub-' || EXTRACT(EPOCH FROM NOW())::text,
    'internship',
    'marketing',
    true,
    10000, 15000, 'monthly',
    'fresher',
    'remote',
    NULL, NULL,
    'Flexible', 'Flexible', true,
    'Create engaging content for blogs, social media, and marketing materials. Perfect opportunity for creative writers looking to build their portfolio in digital content.',
    '- Write blog posts and articles on various topics
- Create social media content and captions
- Research industry trends and topics
- Edit and proofread content
- Collaborate with designers on visual content',
    '["Content Writing", "English", "Research", "Social Media", "Creativity", "SEO Writing"]',
    2, 'active', true, 'standard', 234
),
(
    'job-video-editor-006',
    'comp-mediahub-003',
    'Video Editor',
    'video-editor-mediahub-' || EXTRACT(EPOCH FROM NOW())::text,
    'full-time',
    'design',
    true,
    35000, 50000, 'monthly',
    'entry-level',
    'hybrid',
    'Delhi', 'Delhi',
    'Mon-Fri', '10 AM - 7 PM', true,
    'Edit engaging video content for social media, YouTube, and brand campaigns. Work with talented creators and brands.',
    '- Edit short-form and long-form video content
- Create motion graphics and animations
- Color grading and audio editing
- Manage video asset library
- Collaborate with content team on creative concepts',
    '["Premiere Pro", "After Effects", "DaVinci Resolve", "Motion Graphics", "Color Grading"]',
    1, 'active', true, 'standard', 112
),
-- DataFlow Jobs
(
    'job-data-analyst-007',
    'comp-dataflow-004',
    'Data Analyst',
    'data-analyst-dataflow-' || EXTRACT(EPOCH FROM NOW())::text,
    'full-time',
    'engineering',
    true,
    40000, 60000, 'monthly',
    'mid-level',
    'hybrid',
    'Hyderabad', 'Telangana',
    'Mon-Fri', '9 AM - 6 PM', true,
    'Analyze complex datasets and provide actionable insights to drive business decisions. Work with cutting-edge tools and technologies in a fast-paced consulting environment.',
    '- Analyze large datasets using SQL and Python
- Create dashboards and visualizations in Tableau/Power BI
- Present findings to clients and stakeholders
- Develop predictive models and forecasts
- Collaborate with data engineering team',
    '["SQL", "Python", "Tableau", "Excel", "Statistics", "Power BI", "Machine Learning"]',
    2, 'active', true, 'featured', 178
),
(
    'job-hr-intern-008',
    'comp-dataflow-004',
    'HR Intern',
    'hr-intern-dataflow-' || EXTRACT(EPOCH FROM NOW())::text,
    'internship',
    'hr',
    true,
    8000, 12000, 'monthly',
    'fresher',
    'onsite',
    'Hyderabad', 'Telangana',
    'Mon-Fri', '9 AM - 5 PM', false,
    'Support HR operations including recruitment, onboarding, and employee engagement. Learn the fundamentals of HR in a growing tech company.',
    '- Screen resumes and schedule interviews
- Assist with employee onboarding
- Maintain HR records and documentation
- Support employee engagement activities
- Help organize company events',
    '["Communication", "MS Office", "Organization", "English", "HR Basics"]',
    1, 'active', true, 'standard', 56
),
-- DesignStudio Jobs
(
    'job-uiux-intern-009',
    'comp-designstudio-005',
    'UI/UX Design Intern',
    'uiux-design-intern-designstudio-' || EXTRACT(EPOCH FROM NOW())::text,
    'internship',
    'design',
    true,
    12000, 18000, 'monthly',
    'fresher',
    'remote',
    NULL, NULL,
    'Mon-Fri', 'Flexible', true,
    'Design beautiful user interfaces and improve user experience for web and mobile apps. Learn from senior designers and work on real client projects.',
    '- Create wireframes and high-fidelity mockups
- Conduct user research and usability testing
- Design UI components and design systems
- Collaborate with developers on implementation
- Present designs to clients and incorporate feedback',
    '["Figma", "UI Design", "UX Research", "Prototyping", "Adobe XD", "Design Systems"]',
    2, 'active', true, 'standard', 145
),
(
    'job-graphic-designer-010',
    'comp-designstudio-005',
    'Graphic Designer',
    'graphic-designer-designstudio-' || EXTRACT(EPOCH FROM NOW())::text,
    'full-time',
    'design',
    true,
    30000, 45000, 'monthly',
    'entry-level',
    'hybrid',
    'Pune', 'Maharashtra',
    'Mon-Fri', '10 AM - 7 PM', true,
    'Create stunning visual designs for brands, marketing materials, and digital products.',
    '- Design brand identities and logos
- Create marketing materials (social media, banners, brochures)
- Design presentation decks
- Photo editing and manipulation
- Collaborate with marketing and content teams',
    '["Photoshop", "Illustrator", "InDesign", "Canva", "Brand Design", "Typography"]',
    1, 'active', true, 'standard', 89
),
-- FinEdge Jobs
(
    'job-fullstack-011',
    'comp-fintech-006',
    'Full Stack Developer',
    'fullstack-developer-finedge-' || EXTRACT(EPOCH FROM NOW())::text,
    'full-time',
    'engineering',
    true,
    60000, 90000, 'monthly',
    'mid-level',
    'hybrid',
    'Mumbai', 'Maharashtra',
    'Mon-Fri', '10 AM - 7 PM', true,
    'Build secure, scalable fintech applications from scratch. Work on payment systems, digital wallets, and financial APIs.',
    '- Develop full-stack web applications
- Build secure payment processing systems
- Implement financial APIs and integrations
- Ensure security and compliance standards
- Optimize application performance',
    '["React", "Node.js", "PostgreSQL", "TypeScript", "Payment APIs", "Security"]',
    2, 'active', true, 'featured', 234
),
(
    'job-product-intern-012',
    'comp-fintech-006',
    'Product Management Intern',
    'product-intern-finedge-' || EXTRACT(EPOCH FROM NOW())::text,
    'internship',
    'product',
    true,
    15000, 20000, 'monthly',
    'fresher',
    'onsite',
    'Mumbai', 'Maharashtra',
    'Mon-Fri', '10 AM - 6 PM', false,
    'Learn product management in a fast-paced fintech startup. Work directly with founders and senior PMs.',
    '- Conduct market research and competitor analysis
- Write product requirements documents
- Coordinate with engineering and design teams
- Analyze user feedback and metrics
- Support product launches and updates',
    '["Analytical Thinking", "Communication", "Excel", "Product Sense", "User Research"]',
    1, 'active', true, 'standard', 167
);

-- ============ SAMPLE COMPANY SUBSCRIPTIONS ============

INSERT INTO company_subscriptions (
    id, company_id, plan_type, status, price_inr, start_date, end_date
) VALUES 
('sub-001', 'comp-techcorp-001', 'trial', 'trial', 0, NOW(), NOW() + INTERVAL '60 days'),
('sub-002', 'comp-growthlab-002', 'trial', 'trial', 0, NOW(), NOW() + INTERVAL '60 days'),
('sub-003', 'comp-mediahub-003', 'trial', 'trial', 0, NOW(), NOW() + INTERVAL '60 days'),
('sub-004', 'comp-dataflow-004', 'trial', 'trial', 0, NOW(), NOW() + INTERVAL '60 days'),
('sub-005', 'comp-designstudio-005', 'trial', 'trial', 0, NOW(), NOW() + INTERVAL '60 days'),
('sub-006', 'comp-fintech-006', 'trial', 'trial', 0, NOW(), NOW() + INTERVAL '60 days');

-- ============ CONFIRMATION ============

SELECT 'Sample data inserted successfully!' as message;
SELECT 'Companies created: ' || COUNT(*) as count FROM companies;
SELECT 'Jobs created: ' || COUNT(*) as count FROM job_posts;
SELECT 'Subscriptions created: ' || COUNT(*) as count FROM company_subscriptions;

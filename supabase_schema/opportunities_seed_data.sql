-- ============================================================
-- STOOTAP OPPORTUNITIES - SAMPLE SEED DATA
-- ============================================================
-- Run this AFTER opportunities_complete_schema.sql to add test data

-- ============ SAMPLE COMPANIES ============
-- Note: Replace 'sample-user-id-1' etc. with actual user IDs from your profiles table

INSERT INTO companies (id, user_id, company_name, contact_name, contact_email, phone, business_type, website_url, description, city, state, verified, status, trial_start_date, trial_end_date)
VALUES 
(
    'company-techcorp-001',
    'sample-user-id-1',
    'TechCorp Solutions',
    'Rahul Sharma',
    'hr@techcorp.in',
    '+91 98765 43210',
    'technology',
    'https://techcorp.in',
    'Leading IT solutions company specializing in web and mobile app development. We help startups and enterprises build world-class digital products.',
    'Bangalore',
    'Karnataka',
    true,
    'active',
    NOW(),
    NOW() + INTERVAL '60 days'
),
(
    'company-growthlab-002',
    'sample-user-id-2',
    'GrowthLab Digital',
    'Priya Patel',
    'careers@growthlab.co',
    '+91 87654 32109',
    'services',
    'https://growthlab.co',
    'Full-service digital marketing agency helping brands grow through data-driven strategies, content marketing, and performance advertising.',
    'Mumbai',
    'Maharashtra',
    true,
    'active',
    NOW(),
    NOW() + INTERVAL '60 days'
),
(
    'company-mediahub-003',
    'sample-user-id-3',
    'MediaHub Creative',
    'Arjun Reddy',
    'jobs@mediahub.io',
    '+91 76543 21098',
    'services',
    'https://mediahub.io',
    'Creative content agency producing engaging video content, social media campaigns, and brand storytelling for modern audiences.',
    'Delhi',
    'Delhi',
    false,
    'active',
    NOW(),
    NOW() + INTERVAL '60 days'
),
(
    'company-dataflow-004',
    'sample-user-id-4',
    'DataFlow Analytics',
    'Sneha Krishnan',
    'talent@dataflow.tech',
    '+91 65432 10987',
    'technology',
    'https://dataflow.tech',
    'Data science and analytics consultancy helping businesses make data-driven decisions through advanced analytics and AI solutions.',
    'Hyderabad',
    'Telangana',
    true,
    'active',
    NOW(),
    NOW() + INTERVAL '60 days'
),
(
    'company-designstudio-005',
    'sample-user-id-5',
    'DesignStudio Pro',
    'Amit Verma',
    'hello@designstudio.pro',
    '+91 54321 09876',
    'services',
    'https://designstudio.pro',
    'Award-winning UI/UX design studio creating beautiful and functional digital experiences for startups and enterprises.',
    'Pune',
    'Maharashtra',
    true,
    'active',
    NOW(),
    NOW() + INTERVAL '60 days'
);

-- ============ SAMPLE JOB POSTS ============
INSERT INTO job_posts (id, company_id, title, slug, role_type, is_paid, salary_min, salary_max, experience_level, location_type, city, working_days, working_hours, is_flexible, description, responsibilities, required_skills, number_of_openings, status, visibility, view_count)
VALUES 
(
    'job-frontend-intern-001',
    'company-techcorp-001',
    'Frontend Developer Intern',
    'frontend-developer-intern-techcorp',
    'internship',
    true,
    15000,
    25000,
    'fresher',
    'hybrid',
    'Bangalore',
    'Mon-Fri',
    '9 AM - 6 PM',
    true,
    'Join our dynamic team as a Frontend Developer Intern and work on cutting-edge web applications using React, TypeScript, and modern CSS frameworks. You will collaborate with senior developers to build user interfaces that delight millions of users.',
    'Build responsive UI components using React and TypeScript
Collaborate with designers to implement pixel-perfect interfaces
Write clean, maintainable, and well-documented code
Participate in code reviews and team discussions
Learn and apply best practices in frontend development',
    '["React", "JavaScript", "TypeScript", "HTML", "CSS", "Git"]',
    3,
    'active',
    'featured',
    156
),
(
    'job-marketing-exec-002',
    'company-growthlab-002',
    'Marketing Executive',
    'marketing-executive-growthlab',
    'full-time',
    true,
    30000,
    45000,
    'entry-level',
    'onsite',
    'Mumbai',
    'Mon-Sat',
    '10 AM - 7 PM',
    false,
    'Drive marketing campaigns and brand growth for our expanding client portfolio. You will work on exciting projects across industries including fintech, e-commerce, and B2B SaaS.',
    'Plan and execute digital marketing campaigns
Manage social media accounts and content calendars
Analyze campaign performance and optimize ROI
Coordinate with creative teams for content production
Build and maintain client relationships',
    '["Digital Marketing", "Social Media", "Google Analytics", "Content Writing", "SEO"]',
    2,
    'active',
    'standard',
    89
),
(
    'job-content-writer-003',
    'company-mediahub-003',
    'Content Writer Intern',
    'content-writer-intern-mediahub',
    'internship',
    true,
    10000,
    15000,
    'fresher',
    'remote',
    NULL,
    'Flexible',
    'Flexible',
    true,
    'Create engaging content for blogs, social media, and marketing materials. Perfect opportunity for creative writers looking to build their portfolio in digital content.',
    'Write blog posts and articles on various topics
Create social media content and captions
Research industry trends and topics
Edit and proofread content
Collaborate with designers on visual content',
    '["Content Writing", "English", "Research", "Social Media", "Creativity"]',
    2,
    'active',
    'standard',
    234
),
(
    'job-data-analyst-004',
    'company-dataflow-004',
    'Data Analyst',
    'data-analyst-dataflow',
    'full-time',
    true,
    40000,
    60000,
    'mid-level',
    'hybrid',
    'Hyderabad',
    'Mon-Fri',
    '9 AM - 6 PM',
    true,
    'Analyze complex datasets and provide actionable insights to drive business decisions. Work with cutting-edge tools and technologies in a fast-paced consulting environment.',
    'Analyze large datasets using SQL and Python
Create dashboards and visualizations in Tableau/Power BI
Present findings to clients and stakeholders
Develop predictive models and forecasts
Collaborate with data engineering team',
    '["SQL", "Python", "Tableau", "Excel", "Statistics", "Power BI"]',
    2,
    'active',
    'featured',
    178
),
(
    'job-ui-ux-intern-005',
    'company-designstudio-005',
    'UI/UX Design Intern',
    'ui-ux-design-intern-designstudio',
    'internship',
    true,
    12000,
    18000,
    'fresher',
    'remote',
    NULL,
    'Mon-Fri',
    'Flexible',
    true,
    'Design beautiful user interfaces and improve user experience for web and mobile apps. Learn from senior designers and work on real client projects.',
    'Create wireframes and high-fidelity mockups
Conduct user research and usability testing
Design UI components and design systems
Collaborate with developers on implementation
Present designs to clients and incorporate feedback',
    '["Figma", "UI Design", "UX Research", "Prototyping", "Adobe XD"]',
    2,
    'active',
    'standard',
    145
),
(
    'job-sdr-006',
    'company-growthlab-002',
    'Sales Development Representative',
    'sdr-growthlab-digital',
    'full-time',
    true,
    25000,
    35000,
    'entry-level',
    'onsite',
    'Mumbai',
    'Mon-Sat',
    '9 AM - 6 PM',
    false,
    'Generate leads and build customer relationships for our B2B marketing services. Great opportunity to kickstart a career in tech sales.',
    'Generate and qualify leads through outbound outreach
Schedule demos and meetings for senior sales team
Maintain accurate records in CRM
Research prospects and industry trends
Meet monthly targets for qualified leads',
    '["Communication", "Sales", "CRM", "LinkedIn", "Cold Calling"]',
    3,
    'active',
    'standard',
    67
),
(
    'job-backend-dev-007',
    'company-techcorp-001',
    'Backend Developer',
    'backend-developer-techcorp',
    'full-time',
    true,
    50000,
    80000,
    'mid-level',
    'hybrid',
    'Bangalore',
    'Mon-Fri',
    '10 AM - 7 PM',
    true,
    'Build scalable backend systems using Node.js and cloud technologies. Work on microservices architecture serving millions of requests daily.',
    'Design and implement RESTful APIs
Build microservices using Node.js/Express
Work with PostgreSQL, MongoDB, and Redis
Deploy and manage AWS/GCP infrastructure
Write unit tests and integration tests',
    '["Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker", "REST APIs"]',
    2,
    'active',
    'featured',
    198
),
(
    'job-hr-intern-008',
    'company-dataflow-004',
    'HR Intern',
    'hr-intern-dataflow-analytics',
    'internship',
    true,
    8000,
    12000,
    'fresher',
    'onsite',
    'Hyderabad',
    'Mon-Fri',
    '9 AM - 5 PM',
    false,
    'Support HR operations including recruitment, onboarding, and employee engagement. Learn the fundamentals of HR in a growing tech company.',
    'Screen resumes and schedule interviews
Assist with employee onboarding
Maintain HR records and documentation
Support employee engagement activities
Help organize company events',
    '["Communication", "MS Office", "Organization", "English", "HR Basics"]',
    1,
    'active',
    'standard',
    56
);

-- ============ SAMPLE APPLICATIONS ============
-- These require actual candidate_id values from your profiles table
-- Uncomment and modify after you have real user IDs

-- INSERT INTO job_applications (job_post_id, company_id, candidate_id, full_name, email, phone, college_name, experience_summary, cv_url, status)
-- VALUES 
-- (
--     'job-frontend-intern-001',
--     'company-techcorp-001',
--     'actual-candidate-user-id',
--     'Ankit Kumar',
--     'ankit.kumar@email.com',
--     '+91 98765 12345',
--     'IIT Delhi',
--     'Final year B.Tech student with projects in React and Node.js. Built 3 web applications during internships.',
--     'https://example.com/cv/ankit-kumar.pdf',
--     'shortlisted'
-- );

SELECT 'Sample data inserted successfully!' as message;
SELECT 'Companies created: ' || COUNT(*) FROM companies;
SELECT 'Jobs created: ' || COUNT(*) FROM job_posts;

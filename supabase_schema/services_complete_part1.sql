-- ================================================
-- STOOTAP COMPLETE SERVICES SEED FILE
-- Run clear_services.sql first, then run this file
-- Contains 300+ services with FULL data
-- ================================================

-- ================== CATEGORIES ==================
INSERT INTO categories (id, slug, name, description, sort_order) VALUES
('cat-legal', 'legal-services', 'Legal & Compliance', 'Complete business registration, licensing, and legal documentation services to keep your business compliant with Indian regulations.', 1),
('cat-finance', 'finance-accounting', 'Finance & Accounting', 'Professional GST filing, tax compliance, bookkeeping, auditing, and financial planning services for businesses of all sizes.', 2),
('cat-branding', 'branding-design', 'Branding & Design', 'Creative logo design, brand identity development, marketing collateral, and visual design services to build your brand presence.', 3),
('cat-digital', 'digital-marketing', 'Digital Marketing', 'Comprehensive SEO, social media marketing, PPC advertising, and online growth strategies to expand your digital footprint.', 4),
('cat-web', 'web-development', 'Web Development', 'Professional website design and development, e-commerce solutions, web applications, and ongoing maintenance services.', 5),
('cat-app', 'app-development', 'App Development', 'Native and cross-platform mobile application development for iOS and Android with modern UI/UX design.', 6),
('cat-startup', 'startup-services', 'Startup Services', 'End-to-end startup support including DPIIT registration, funding assistance, pitch decks, and investor connections.', 7),
('cat-hr', 'hr-recruitment', 'HR & Recruitment', 'Complete HR solutions including recruitment, payroll processing, employee management, and compliance services.', 8),
('cat-content', 'content-writing', 'Content & Copywriting', 'Professional content creation including blog posts, website copy, marketing content, and SEO-optimized writing.', 9),
('cat-ecommerce', 'ecommerce', 'E-Commerce Solutions', 'Complete online selling solutions including marketplace setup, product listing optimization, and store management.', 10),
('cat-consulting', 'business-consulting', 'Business Consulting', 'Strategic business advisory, market research, growth planning, and operational optimization consulting.', 11),
('cat-training', 'training-workshops', 'Training & Workshops', 'Professional skill development programs, corporate training, and workshops to upskill your team.', 12)
ON CONFLICT (id) DO NOTHING;

-- ================== LEGAL & COMPLIANCE SERVICES ==================
INSERT INTO services (category_id, slug, name, summary, long_description, base_price_inr, eta_days, icon, active, problem, outcome, includes) VALUES

-- Private Limited Company Registration
('cat-legal', 'private-limited-registration', 'Private Limited Company Registration', 
'Complete Pvt Ltd company registration with ROC filing, DIN, DSC, and incorporation certificate.',
'A Private Limited Company is the most popular business structure for startups and growing businesses in India. It offers limited liability protection, credibility with investors and clients, and easy access to funding. Our comprehensive registration service handles everything from obtaining Director Identification Numbers (DIN) and Digital Signature Certificates (DSC) to filing with the Registrar of Companies (ROC) and obtaining your Certificate of Incorporation.

We guide you through selecting the right authorized capital, drafting the Memorandum and Articles of Association, and ensuring compliance with the Companies Act 2013. Our team of experienced professionals ensures a smooth, hassle-free registration process with regular updates at every stage.',
7999.00, 7, 'Building', true,
'Starting a business is exciting but the legal formalities can be overwhelming. Incorrect filings lead to rejections and delays.',
'You receive a legally registered Private Limited Company with all necessary documents, ready to open bank accounts, sign contracts, and raise funding.',
'Director Identification Number (DIN) for 2 directors, Digital Signature Certificates (DSC), Name approval and reservation, MOA and AOA drafting, ROC filing and incorporation, Certificate of Incorporation, PAN and TAN for company, Compliance calendar for first year'),

-- LLP Registration
('cat-legal', 'llp-registration', 'LLP Registration',
'Limited Liability Partnership registration with partner agreements and complete compliance setup.',
'A Limited Liability Partnership (LLP) combines the flexibility of a partnership with the limited liability of a company. It is ideal for professional services firms, consultancies, and small businesses that want liability protection without the compliance burden of a Private Limited Company.

Our LLP registration service includes DPIN for all designated partners, drafting of the LLP Agreement that defines profit sharing and responsibilities, and filing with the Ministry of Corporate Affairs. We ensure your LLP is registered correctly the first time with all necessary documents in place.',
5999.00, 7, 'Users', true,
'Partnerships expose you to unlimited personal liability. You need a structure that protects personal assets while maintaining operational flexibility.',
'A fully registered LLP with liability protection, clear partner agreements, and all compliance requirements in place.',
'DPIN for 2 designated partners, Digital Signature Certificates, LLP name approval, LLP Agreement drafting, Registration with ROC, Certificate of Incorporation, PAN and TAN for LLP'),

-- One Person Company
('cat-legal', 'opc-registration', 'One Person Company Registration',
'Single-owner company registration with full compliance and limited liability protection.',
'A One Person Company (OPC) is perfect for solo entrepreneurs who want the benefits of a company structure without needing multiple shareholders or directors. You get limited liability protection, separate legal entity status, and the ability to raise funding—all while maintaining complete control.

Our OPC registration service handles the unique requirements of this structure, including mandatory nominee director arrangements. We ensure your OPC is compliant with the Companies Act and ready for business operations.',
6999.00, 7, 'User', true,
'As a sole proprietor, your personal assets are at risk. You want company benefits but do not have co-founders or partners.',
'A registered One Person Company providing liability protection, credibility, and growth potential for solo entrepreneurs.',
'DIN for director and nominee, Digital Signature Certificate, Name approval, MOA and AOA drafting, ROC registration, Certificate of Incorporation, PAN and TAN, First year compliance guidance'),

-- Partnership Firm
('cat-legal', 'partnership-firm-registration', 'Partnership Firm Registration',
'Traditional partnership deed drafting and registration for collaborative businesses.',
'A Partnership Firm is the simplest structure for two or more people starting a business together. While it does not offer limited liability, it is easy to set up, has minimal compliance requirements, and provides flexibility in operations and profit sharing.

Our service includes drafting a comprehensive Partnership Deed that clearly defines each partner''s responsibilities, capital contribution, profit sharing ratio, and exit procedures. We also handle registration with the Registrar of Firms where applicable.',
2999.00, 5, 'Handshake', true,
'Starting a business with partners without clear agreements leads to disputes and complications down the line.',
'A legally documented partnership with clear terms, registered where required, and ready for business operations.',
'Partnership Deed drafting, Profit sharing agreement, Capital contribution documentation, Registration with Registrar of Firms, PAN for partnership firm, Bank account opening assistance'),

-- Sole Proprietorship
('cat-legal', 'sole-proprietorship', 'Sole Proprietorship Registration',
'Individual business registration with GST, shop license, and essential compliances.',
'A Sole Proprietorship is the easiest way for an individual to start a business in India. There is no separate legal entity—you are the business. While this means unlimited liability, it also means minimal compliance, complete control, and the simplest tax filing.

Our registration package gets you operationally ready with GST registration, Shop and Establishment license, and all documentation needed to open a business bank account and start invoicing clients.',
1499.00, 3, 'UserCheck', true,
'You want to start a small business quickly without complex registration procedures but need official documentation.',
'A legally recognized sole proprietorship with GST number, shop license, and bank account readiness.',
'GST registration, Shop and Establishment license, Trade name registration, Business address proof, Bank account documentation, Professional tax registration'),

-- NGO Registration
('cat-legal', 'ngo-registration', 'NGO/Trust/Society Registration',
'Non-profit organization registration with 80G and 12A tax exemption benefits setup.',
'Setting up a non-profit organization in India requires choosing between a Trust, Society, or Section 8 Company structure. Each has its own registration process, compliance requirements, and tax benefits.

Our comprehensive NGO registration service guides you through selecting the right structure, drafting the constitution/trust deed, registering with appropriate authorities, and most importantly—obtaining 80G and 12A registrations that provide tax benefits to your donors and tax exemption to your organization.',
14999.00, 21, 'Heart', true,
'You want to create a charitable organization but navigating the complex registration and tax exemption process is confusing.',
'A fully registered non-profit with 80G and 12A status, enabling tax-free donations and organizational tax exemptions.',
'Structure selection consultation, Trust Deed or Society bylaws drafting, Registration with appropriate authority, 80G registration for donor tax benefits, 12A registration for organization tax exemption, PAN for organization, FCRA basic guidance'),

-- Section 8 Company
('cat-legal', 'section-8-company', 'Section 8 Company Registration',
'Non-profit company registration under Companies Act with charitable objectives.',
'A Section 8 Company is a non-profit company under the Companies Act 2013, used for promoting arts, science, education, charity, or social welfare. Unlike Trusts and Societies, it offers better governance structures and credibility with large donors and government agencies.

Our service covers the entire registration process including obtaining the Section 8 license from the Regional Director, incorporation with ROC, and subsequent 80G/12A applications for tax benefits.',
19999.00, 30, 'HeartHandshake', true,
'You need a credible non-profit structure that can receive large donations, government grants, and CSR funds.',
'A registered Section 8 Company with professional governance structures and tax exemption capabilities.',
'Section 8 license application, MOA and AOA for non-profit, ROC incorporation, Certificate of Incorporation, 80G application filing, 12A application filing, First board meeting setup'),

-- DPIIT/Startup India
('cat-legal', 'startup-india-registration', 'Startup India Registration',
'DPIIT recognition and Startup India certificate with all associated benefits.',
'The Startup India initiative provides significant benefits to recognized startups including tax exemptions for 3 years, easier compliance, access to government tenders, and eligibility for various schemes and funding opportunities.

To qualify, your company must be less than 10 years old, have turnover below Rs 100 crores, and be working towards innovation or improvement of existing products/services. Our service handles the complete DPIIT recognition process including documentation, application filing, and follow-up until certificate issuance.',
4999.00, 10, 'Rocket', true,
'You are eligible for Startup India benefits but do not know how to apply or what documentation is needed.',
'Official DPIIT recognition as a startup with access to tax benefits, schemes, and government opportunities.',
'Eligibility assessment, Documentation preparation, DPIIT application filing, Recognition certificate, Tax exemption guidance, Scheme eligibility information, Self-certification assistance'),

-- MSME/Udyam Registration
('cat-legal', 'msme-registration', 'MSME/Udyam Registration',
'Micro, Small and Medium Enterprise registration for government benefits.',
'Udyam Registration (formerly MSME Registration) is a free government registration that provides significant benefits including priority lending from banks, lower interest rates, protection against delayed payments, preference in government tenders, and various subsidies.

The classification is based on investment in plant/machinery and annual turnover. Our service ensures accurate classification and complete registration on the Udyam portal with your unique Udyam Registration Number.',
999.00, 1, 'Award', true,
'You are missing out on government benefits and banking advantages available to registered MSMEs.',
'Udyam Registration certificate with access to MSME benefits, bank loans, and government scheme eligibility.',
'Enterprise classification assessment, Udyam portal registration, Udyam Registration Number, Registration certificate, Bank scheme eligibility letter, MSME benefit guidance'),

-- Import Export Code
('cat-legal', 'import-export-code', 'Import Export Code (IEC)',
'Import Export Code license for international trade operations.',
'An Import Export Code (IEC) is mandatory for any business involved in importing or exporting goods and services from India. It is a 10-digit code issued by the Directorate General of Foreign Trade (DGFT) and is valid for lifetime with no renewal required.

Our service handles the complete IEC application process including documentation, digital signature, and DGFT filing. We ensure your IEC is issued quickly so you can start international trade operations without delays.',
2999.00, 3, 'Globe', true,
'You want to import materials or export products but lack the mandatory IEC for international trade.',
'A valid Import Export Code enabling you to conduct international trade legally from India.',
'IEC application filing, DGFT documentation, Digital signature arrangement, IEC certificate, Bank linkage for foreign exchange, Export-import procedure guidance'),

-- Trademark Registration
('cat-legal', 'trademark-registration', 'Trademark Registration',
'Protect your brand name and logo with trademark registration under one class.',
'A registered trademark gives you exclusive rights to use your brand name, logo, or tagline in connection with your products or services. It protects against copycats, builds brand value, and can become a valuable business asset.

Our trademark service includes comprehensive search to check availability, preparing and filing the application with the Trade Marks Registry, responding to examination reports, and guiding you through the registration process that typically takes 6-12 months for uncontested applications.',
5999.00, 7, 'Shield', true,
'Your brand name and logo are unprotected. Competitors can copy your branding without legal consequences.',
'A filed trademark application with registration protection for 10 years, renewable indefinitely.',
'Trademark availability search, Class selection guidance, Application drafting and filing, Examination report response, Registration certificate, 10-year protection, Renewal reminders'),

-- Trademark Objection Reply
('cat-legal', 'trademark-objection-reply', 'Trademark Objection Reply',
'Professional legal response to trademark examination objections.',
'If the Trade Marks Registry raises objections to your trademark application, you need to file a detailed reply addressing each concern. Common objections include similarity with existing marks, descriptive nature, or lack of distinctiveness.

Our trademark attorneys analyze the examination report, research case precedents, and prepare a comprehensive reply that addresses all objections with legal arguments and supporting evidence to maximize your chances of acceptance.',
3999.00, 5, 'ShieldCheck', true,
'Your trademark application received objections and may be rejected without proper legal response.',
'A professionally drafted objection reply that addresses all concerns and improves acceptance chances.',
'Examination report analysis, Legal research and precedents, Objection reply drafting, Evidence compilation, Registry filing, Hearing representation if needed'),

-- Trademark Renewal
('cat-legal', 'trademark-renewal', 'Trademark Renewal',
'Renew your registered trademark for another 10 years of protection.',
'Trademark registrations are valid for 10 years and must be renewed to maintain protection. We track your trademark expiry dates and handle the renewal process well before the deadline to ensure continuous protection.

Late renewals incur additional fees and lapsed trademarks can be registered by others. Our service includes timely reminders, renewal filing, and updated registration certificate.',
4999.00, 7, 'RefreshCw', true,
'Your trademark is approaching expiry and may be lost if not renewed on time.',
'Renewed trademark registration with protection extended for another 10 years.',
'Expiry tracking and reminders, Renewal application filing, Updated registration certificate, Continuous protection assurance'),

-- Copyright Registration
('cat-legal', 'copyright-registration', 'Copyright Registration',
'Protect your creative works including software, content, art, and music.',
'Copyright protects original creative works including literary works, software code, artistic works, music, films, and more. While copyright exists automatically upon creation, registration provides legal proof of ownership and is essential for enforcement.

Our service covers all types of creative works with proper documentation, application filing with the Copyright Office, and obtaining the registration certificate.',
4999.00, 30, 'FileText', true,
'Your creative work is unprotected and can be copied or stolen without legal recourse.',
'Official copyright registration certificate proving your ownership and enabling enforcement.',
'Work categorization, Application preparation, Copyright Office filing, Registration certificate, Ownership documentation, Enforcement guidance'),

-- Patent Filing
('cat-legal', 'patent-filing', 'Patent Filing (Indian)',
'Provisional or complete patent application for your invention.',
'A patent grants you exclusive rights to make, use, or sell your invention for 20 years. The patent process in India involves filing an application with claims that define your invention, examination by the Patent Office, and grant upon acceptance.

Our service includes patentability assessment, drafting of patent specification with claims, filing as provisional or complete application, and guidance through the examination process.',
24999.00, 14, 'Lightbulb', true,
'Your innovation or invention is at risk of being copied by competitors without patent protection.',
'A filed patent application protecting your invention with potential 20-year exclusive rights.',
'Patentability assessment, Patent search, Specification drafting, Claims drafting, Application filing, Publication, Examination guidance'),

-- FSSAI License
('cat-legal', 'fssai-license', 'FSSAI Food License',
'Food safety license required for all food businesses in India.',
'All food businesses in India—manufacturers, processors, distributors, retailers, and food service operators—must have an FSSAI license. The type of license (Basic, State, or Central) depends on your business turnover and operations.

Our service assesses your license requirements, prepares all documentation, and handles the complete application process with the Food Safety Department. We ensure you receive the appropriate license for legal food business operations.',
2499.00, 7, 'UtensilsCrossed', true,
'Operating a food business without FSSAI license is illegal and can result in heavy penalties or closure.',
'Valid FSSAI license enabling legal food business operations with displayed license number.',
'License type assessment, Documentation preparation, FSSAI application filing, License certificate, Food safety guidelines, Display materials'),

-- Drug License
('cat-legal', 'drug-license', 'Drug License',
'License for pharmaceutical retail, wholesale, or manufacturing operations.',
'A Drug License is mandatory for selling, distributing, or manufacturing pharmaceutical products in India. Different licenses apply to retail (Form 20 & 21), wholesale (Form 20B & 21B), and manufacturing operations.

Our experienced team handles the complex drug license application process including premises inspection requirements, documentation, and coordination with the State Drug Controller. We ensure your application meets all regulatory requirements.',
9999.00, 21, 'Pill', true,
'You cannot legally sell or manufacture pharmaceutical products without the appropriate drug license.',
'Valid drug license enabling legal pharmaceutical operations under state drug control regulations.',
'License type determination, Premises compliance guidance, Documentation preparation, Application filing, Inspection coordination, License certificate'),

-- Shop Act License
('cat-legal', 'shop-act-license', 'Shop & Establishment License',
'Local shop and establishment registration for retail and service businesses.',
'The Shop and Establishment Act registration is mandatory for all commercial establishments including shops, offices, restaurants, hotels, and service businesses. It is issued by the local municipality and regulates working hours, employment conditions, and provides legal address proof.

Our service handles the complete registration process with your local municipal corporation, ensuring compliance with state-specific requirements.',
1499.00, 5, 'Store', true,
'Operating without shop license can result in penalties and is required for other registrations like GST.',
'Valid Shop and Establishment license providing legal business address proof and compliance.',
'Application preparation, Municipal filing, Premises verification, License certificate, Working hours compliance, Employment register setup'),

-- Company Director Change
('cat-legal', 'director-change', 'Director Addition/Removal',
'Add new directors or remove existing directors from your company.',
'Changes in company directorship require ROC filings and compliance with Companies Act procedures. Whether you are bringing in a new director with industry expertise or a co-founder is exiting, proper legal procedures must be followed.

Our service handles the complete process including board resolutions, DIN for new directors, Form DIR-12 filing, and updated documents reflecting the directorship changes.',
3999.00, 7, 'UserCog', true,
'You need to change company directors but are unsure about the legal procedure and compliance requirements.',
'Updated company records with new director appointments or removals properly filed with ROC.',
'Board resolution drafting, DIN for new director, Form DIR-12 preparation, ROC filing, Updated director list, Compliance documentation');

-- More services will be inserted in subsequent parts...
SELECT 'Part 1: Legal services inserted successfully!' as status;

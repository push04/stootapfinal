-- ================================================
-- STOOTAP COMPLETE SERVICES - PART 3
-- Branding, Design & Digital Marketing Services
-- ================================================

-- ================== BRANDING & DESIGN SERVICES ==================
INSERT INTO services (category_id, slug, name, summary, long_description, base_price_inr, eta_days, icon, active, problem, outcome, includes) VALUES

-- Logo Design Basic
('cat-branding', 'logo-design-basic', 'Logo Design - Basic',
'Professional logo design with 3 concepts and source files.',
'Your logo is the face of your brand—the first impression that customers remember. A professionally designed logo communicates your brand values, differentiates you from competitors, and builds recognition over time.

Our basic logo package delivers 3 unique concepts based on your brief, with 2 rounds of revisions on your chosen design. You receive the final logo in all formats needed for print and digital use, including vector source files for future modifications.',
2999.00, 3, 'Palette', true,
'A generic or amateur logo undermines your brand credibility and fails to stand out in the market.',
'A professional, unique logo that represents your brand identity and works across all applications.',
'Creative brief session, 3 unique concepts, 2 revision rounds, Final logo in PNG JPG SVG, Vector source files (AI/EPS), Color variations, Black and white version'),

-- Logo Design Premium
('cat-branding', 'logo-design-premium', 'Logo Design - Premium',
'Comprehensive logo design with brand guidelines document.',
'For businesses serious about their brand identity, our premium logo package goes beyond just a logo. We create a complete visual identity system with detailed guidelines on how to use your logo, colors, and typography consistently.

This package includes 5 unique concepts, unlimited revisions until you are completely satisfied, and a professional brand guidelines document that ensures your brand is applied consistently across all touchpoints.',
7999.00, 5, 'PenTool', true,
'Inconsistent brand usage across materials dilutes brand recognition and appears unprofessional.',
'Complete logo with brand guidelines ensuring consistent, professional brand application everywhere.',
'Detailed brief and research, 5 unique concepts, Unlimited revisions, All logo formats, Vector source files, Color palette with codes, Typography specifications, Brand guidelines PDF, Social media kit'),

-- Brand Identity Package
('cat-branding', 'brand-identity-package', 'Complete Brand Identity',
'Full brand identity including logo, colors, typography, and guidelines.',
'A complete brand identity is more than a logo—it is the entire visual language of your business. From the colors that evoke specific emotions to the typography that conveys your personality, every element works together to create a cohesive brand experience.

Our comprehensive package develops your complete visual identity from scratch, including logo design, color psychology-based palette selection, typography pairing, and detailed guidelines for consistent application across all materials.',
14999.00, 10, 'Layers', true,
'Disconnected visual elements across your materials create confusion and weaken brand perception.',
'Cohesive brand identity system that creates instant recognition and professional credibility.',
'Brand discovery workshop, Logo design with unlimited revisions, Primary and secondary color palette, Typography system, Brand patterns and textures, Comprehensive guidelines document, Stationery mockups, Digital asset package'),

-- Business Card Design
('cat-branding', 'business-card-design', 'Business Card Design',
'Professional visiting card design that makes lasting impressions.',
'Business cards remain essential networking tools. A well-designed card that reflects your brand leaves a lasting impression and makes it easy for contacts to remember and reach you.

Our business card design service creates cards that are extensions of your brand identity—whether you have existing branding or need designs from scratch. We provide print-ready files that work with any printer.',
999.00, 2, 'CreditCard', true,
'Generic or poorly designed business cards fail to make an impression and are often discarded.',
'Professional, memorable business cards that reinforce your brand and facilitate networking.',
'2 design concepts, Front and back design, Print-ready files (PDF CMYK), Digital version for sharing, Printer specifications, Optional premium finishes guidance'),

-- Presentation Design
('cat-branding', 'presentation-design', 'Presentation Design',
'Professional pitch deck or corporate presentation design.',
'Whether you are pitching to investors, presenting to clients, or speaking at conferences, a professionally designed presentation elevates your message and keeps audiences engaged.

Our presentation design service transforms your content into visually compelling slides with consistent branding, clear information hierarchy, and impactful data visualization. We work with PowerPoint, Google Slides, or Keynote based on your preference.',
4999.00, 5, 'Presentation', true,
'Text-heavy, template presentations fail to engage audiences and undermine your professional image.',
'Visually stunning presentation that enhances your message and keeps audiences engaged.',
'Content structuring consultation, Up to 20 slides, Custom design (not templates), Data visualization, Icon and imagery selection, Editable source file, PDF version, Presentation tips'),

-- UI/UX Design
('cat-branding', 'ui-ux-design', 'UI/UX Design',
'User interface and experience design for apps and websites.',
'Great design is not just about aesthetics—it is about creating intuitive experiences that users love. Our UI/UX design process combines user research, wireframing, and visual design to create interfaces that are both beautiful and functional.

We design interfaces that reduce user friction, increase engagement, and achieve your business goals—whether that is more sign-ups, purchases, or user satisfaction.',
19999.00, 14, 'Smartphone', true,
'Poor user experience leads to high bounce rates, low conversions, and frustrated users who never return.',
'Intuitive, beautiful interface design that delights users and achieves business objectives.',
'User research and personas, Information architecture, Wireframes, Visual design mockups, Interactive prototype, Design system/components, Developer handoff files, Usability recommendations');

-- ================== DIGITAL MARKETING SERVICES ==================
INSERT INTO services (category_id, slug, name, summary, long_description, base_price_inr, eta_days, icon, active, problem, outcome, includes) VALUES

-- SEO Basic Package
('cat-digital', 'seo-basic', 'SEO Basic Package',
'On-page SEO optimization for 10 target keywords with monthly reporting.',
'Search Engine Optimization is the foundation of sustainable online visibility. When potential customers search for your products or services, you want to appear on the first page of Google—where 95% of clicks happen.

Our basic SEO package focuses on on-page optimization—ensuring your website structure, content, and technical elements are optimized for your target keywords. We provide monthly reports showing your ranking improvements and traffic growth.',
7999.00, 30, 'Search', true,
'Your website is invisible in search results, missing out on free organic traffic from ready-to-buy customers.',
'Improved search rankings and organic traffic growth with clear monthly progress tracking.',
'10 keyword research and targeting, On-page optimization, Meta tags and descriptions, Content recommendations, Technical SEO audit, Google Search Console setup, Monthly ranking report, Traffic growth tracking'),

-- SEO Advanced Package
('cat-digital', 'seo-advanced', 'SEO Advanced Package',
'Complete SEO with content strategy, backlinks, and 25 keywords.',
'Ranking for competitive keywords requires more than on-page optimization. Our advanced package combines technical SEO, content marketing, and link building to build your website authority and achieve top rankings.

We develop a content strategy that targets keywords at every stage of the buyer journey, create high-quality content, and build authoritative backlinks that signal trust to search engines.',
14999.00, 30, 'TrendingUp', true,
'Competitors outrank you for important keywords because they have stronger content and backlink profiles.',
'Dominant search presence with traffic growth from comprehensive SEO and content strategy.',
'25 keyword targeting, Technical SEO optimization, 4 SEO blog articles/month, Backlink building (10/month), Competitor analysis, Content optimization, Local SEO if applicable, Detailed monthly reporting, Quarterly strategy review'),

-- Google Ads Setup
('cat-digital', 'google-ads-setup', 'Google Ads Setup',
'Complete Google Ads campaign setup with keyword research and optimization.',
'Google Ads puts your business in front of customers actively searching for what you offer. But poorly structured campaigns waste money on irrelevant clicks. Our setup ensures your campaigns are built for success from day one.

We research high-intent keywords, create compelling ad copy, set up conversion tracking, and structure campaigns to maximize quality scores and minimize cost per click.',
4999.00, 3, 'Target', true,
'You are missing immediate visibility for high-intent searchers or wasting money on poorly optimized campaigns.',
'Well-structured Google Ads campaigns ready to drive qualified traffic and leads.',
'Keyword research (100+ keywords), Campaign structure setup, Ad copy creation (5 ads), Negative keyword list, Conversion tracking setup, Landing page recommendations, Budget allocation strategy, Quality score optimization'),

-- Google Ads Management
('cat-digital', 'google-ads-management', 'Google Ads Management (Monthly)',
'Ongoing campaign optimization and performance improvement.',
'Running Google Ads is not set-and-forget. Continuous optimization—adjusting bids, testing ads, refining audiences, and eliminating waste—is essential to improve performance and reduce cost per acquisition over time.

Our monthly management service handles all aspects of your Google Ads, with regular optimizations and detailed reporting on what is working and what we are improving.',
7999.00, 30, 'LineChart', true,
'Unmanaged campaigns see declining performance and increasing costs without regular optimization.',
'Continuously improving campaigns with lower costs and better returns from expert management.',
'Weekly bid optimization, A/B testing of ads, Search term analysis, Negative keyword updates, Audience refinement, Monthly performance report, Strategy calls, Budget recommendations'),

-- Social Media Management
('cat-digital', 'social-media-management', 'Social Media Management',
'Complete social media management for 3 platforms with 20 posts/month.',
'Consistent, engaging social media presence builds brand awareness, customer relationships, and drives traffic to your business. But creating quality content and maintaining multiple platforms is time-consuming.

Our social media management takes the burden off your team. We handle content creation, posting, community management, and reporting across your key platforms—ensuring your brand stays active and engaging.',
9999.00, 30, 'Share2', true,
'Inconsistent posting and poor content quality hurt your brand perception and audience engagement.',
'Active, engaging social presence with growing followers and consistent brand messaging.',
'3 platform management, 20 posts per month, Custom graphics, Caption writing, Hashtag strategy, Community management, Monthly performance report, Content calendar'),

-- Email Marketing Setup
('cat-digital', 'email-marketing-setup', 'Email Marketing Setup',
'Complete email marketing system with automation and templates.',
'Email remains the highest ROI marketing channel. But effective email marketing requires the right tools, properly designed templates, and automated sequences that nurture leads into customers.

Our setup service gets your email marketing operational—from choosing and configuring the right platform to creating branded templates and automated welcome sequences.',
4999.00, 7, 'Mail', true,
'You are not capturing leads or nurturing them through email, leaving money on the table.',
'Fully functional email marketing system ready to capture leads and drive conversions.',
'Email platform setup (Mailchimp/Sendinblue), 3 email templates, Welcome sequence (5 emails), Opt-in form creation, List segmentation setup, Analytics configuration, Best practices guide'),

-- Lead Generation Campaign
('cat-digital', 'lead-generation', 'Lead Generation Campaign',
'Multi-channel lead generation setup and execution.',
'Generating quality leads consistently is essential for business growth. Our lead generation campaigns combine paid advertising, landing pages, and lead magnets to attract and capture your ideal customers.

We set up complete lead generation funnels—from targeted ads to optimized landing pages to email follow-up—that deliver qualified leads ready for your sales team.',
14999.00, 14, 'UserPlus', true,
'Inconsistent lead flow makes revenue unpredictable and growth difficult to plan.',
'Systematic lead generation producing consistent flow of qualified prospects.',
'Target audience research, Lead magnet creation, Landing page design, Paid ad campaigns, Lead capture forms, Email nurture sequence, CRM integration, Performance tracking, Optimization recommendations');

SELECT 'Part 3: Branding & Digital Marketing services inserted successfully!' as status;

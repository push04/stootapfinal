-- ================================================
-- STOOTAP COMPLETE SERVICES - PART 6 (FINAL)
-- Content, E-Commerce, Consulting & Training Services
-- ================================================

-- ================== CONTENT & COPYWRITING SERVICES ==================
INSERT INTO services (category_id, slug, name, summary, long_description, base_price_inr, eta_days, icon, active, problem, outcome, includes) VALUES

-- Website Content Writing
('cat-content', 'website-content', 'Website Content Writing',
'Professional content for 5 website pages that converts visitors.',
'Website content is not just about filling pages with words—it is about guiding visitors toward action. Our content balances engaging storytelling with strategic messaging that communicates your value proposition and drives conversions.

We research your audience, competitors, and industry to create content that speaks directly to your customers'' needs and positions your brand as the solution.',
4999.00, 5, 'FileText', true,
'Generic or poorly written website content fails to engage visitors or convey your unique value.',
'Professional website content that engages visitors, communicates value, and drives conversions.',
'5 pages of content, Audience research, Competitor analysis, SEO keyword integration, Brand voice development, Headlines and subheads, Calls to action, Meta descriptions, 2 revision rounds'),

-- Blog Post 1000 Words
('cat-content', 'blog-post-1000', 'Blog Post (1000 words)',
'SEO-optimized blog article that drives traffic and engagement.',
'Consistent blogging builds authority, drives organic traffic, and provides shareable content for social media. Our blog posts are thoroughly researched, engagingly written, and optimized for both readers and search engines.

Each article targets specific keywords, includes internal linking, and is structured for readability with clear headlines, bullet points, and compelling introductions.',
1799.00, 3, 'Edit3', true,
'Lack of fresh content means your website misses opportunities for organic traffic growth.',
'Professional, SEO-optimized blog post that attracts readers and improves search rankings.',
'Topic research, Keyword optimization, 1000 words, Engaging headline, Internal linking, Meta description, Royalty-free images, 1 revision round'),

-- SEO Content Package
('cat-content', 'seo-content-pack', 'SEO Content Package',
'Monthly package of 10 SEO-optimized articles for traffic growth.',
'Consistent content production compounds over time—each article is an asset that continues driving traffic for years. Our monthly package delivers 10 articles strategically targeting keywords in your niche.

We handle topic ideation, keyword research, writing, and optimization. You receive a content calendar and regular traffic reports showing the impact.',
14999.00, 14, 'Search', true,
'Sporadic content publishing fails to build momentum in organic search rankings.',
'Consistent content pipeline that systematically builds organic traffic over time.',
'Content strategy, Topic ideation, Keyword research, 10 articles (800-1200 words each), SEO optimization, Internal linking strategy, Monthly content calendar, Traffic reporting'),

-- Case Study Writing
('cat-content', 'case-study', 'Case Study Writing',
'Customer success story that builds credibility and wins sales.',
'Case studies are powerful sales tools—they show prospects that others like them have succeeded with your product or service. A well-crafted case study follows a narrative arc from challenge through solution to results.

We interview your customer, extract the compelling story, write a professional case study, and can design it for use in sales materials and on your website.',
4999.00, 5, 'FileCheck', true,
'You have success stories but no professional case studies to use in sales conversations.',
'Professional case study that showcases customer success and accelerates sales cycles.',
'Customer interview, Challenge-solution-results narrative, 800-1200 words, Key metrics highlighted, Customer quotes, Designed PDF version, Web page version, Social media snippets'),

-- Video Script Writing
('cat-content', 'video-script', 'Video Script Writing',
'Script for explainer, promotional, or YouTube videos.',
'Video content dominates attention, but great videos start with great scripts. Our video writers understand how to write for the screen—grabbing attention in the first seconds, maintaining pace, and delivering clear messages.

Whether it is a 60-second promotional video or a 10-minute explainer, we craft scripts that keep viewers engaged from start to finish.',
2999.00, 3, 'Video', true,
'Your video ideas fail to translate into engaging content without proper scripting.',
'Polished video script that engages viewers and clearly communicates your message.',
'Video strategy consultation, Script structure, Opening hook, Core messaging, Call to action, Shot suggestions, 1 revision round'),

-- Press Release Writing
('cat-content', 'press-release', 'Press Release Writing',
'Professional press release for announcements and media coverage.',
'A well-written press release can generate media coverage, build backlinks, and create awareness for your announcement. But journalists receive hundreds of releases daily—yours needs to stand out.

We write releases following journalistic standards, with newsworthy angles and proper structure that makes it easy for media to pick up your story. We also provide a targeted media list for distribution.',
2999.00, 3, 'Newspaper', true,
'Your company announcements fail to generate media attention without proper press releases.',
'Professional press release ready for media distribution with increased pickup chances.',
'Newsworthy angle development, Press release writing, Journalistic format, Headline and subhead, Company boilerplate, Contact information, Media list suggestion, Distribution guidance');

-- ================== E-COMMERCE SOLUTIONS ==================
INSERT INTO services (category_id, slug, name, summary, long_description, base_price_inr, eta_days, icon, active, problem, outcome, includes) VALUES

-- Amazon Seller Setup
('cat-ecommerce', 'amazon-seller-setup', 'Amazon Seller Account Setup',
'Complete Amazon marketplace seller account configuration.',
'Amazon is India''s largest e-commerce marketplace—but setting up correctly is crucial for success. Wrong category selection, poor listing quality, or compliance issues can hamper your performance from day one.

Our setup service handles everything—account registration, brand approval if eligible, category ungating for restricted products, and initial listing creation following Amazon best practices.',
4999.00, 5, 'ShoppingCart', true,
'You want to sell on Amazon but the setup process and compliance requirements are confusing.',
'Fully configured Amazon seller account ready to list products and start selling.',
'Seller account registration, Category selection, GTIN/brand approval, 5 initial product listings, Listing optimization, Shipping setup, Payment configuration, Seller Central training'),

-- Amazon Listing Optimization
('cat-ecommerce', 'amazon-listing-optimization', 'Amazon Listing Optimization',
'Optimize 10 product listings for better visibility and sales.',
'Your products might be great, but poor listings bury them in search results. Optimized listings with the right keywords, compelling copy, and enhanced content can dramatically increase visibility and conversion.

We optimize your listings following Amazon A9 algorithm best practices—incorporating relevant keywords, improving titles, bullets, and descriptions, and adding enhanced brand content where eligible.',
4999.00, 5, 'Search', true,
'Your Amazon listings are not ranking well and conversion rates are below category average.',
'Optimized listings with improved visibility, click-through rates, and conversions.',
'10 product listings, Keyword research, Title optimization, Bullet point enhancement, Description improvement, Backend search terms, A+ Content if brand registered, Image recommendations'),

-- Product Photography
('cat-ecommerce', 'product-photography', 'E-Commerce Product Photography',
'Professional photos for 20 products optimized for online selling.',
'Product images are the most critical element in e-commerce. Customers cannot touch or try your products—they rely entirely on images to make purchase decisions. Professional photography significantly increases conversion rates.

We photograph your products with professional lighting, white backgrounds, and multiple angles. Images are edited and optimized for all major e-commerce platforms.',
9999.00, 7, 'Camera', true,
'Poor product images hurt your credibility and reduce conversion rates.',
'Professional product images that showcase your products and increase buyer confidence.',
'20 products, White background shots, Multiple angles per product, Professional lighting, Image editing, Platform-specific sizing, Lifestyle images (select products), Delivery in all required formats'),

-- E-Commerce SEO
('cat-ecommerce', 'ecommerce-seo', 'E-Commerce SEO',
'Search optimization specifically for online stores.',
'E-commerce SEO has unique challenges—product pages, category pages, faceted navigation, and thin content. Our specialized e-commerce SEO service addresses these challenges to improve organic traffic that converts.

We optimize product and category pages, implement proper schema markup, fix technical issues common in e-commerce platforms, and build content strategies that drive organic traffic.',
9999.00, 30, 'TrendingUp', true,
'Your online store does not rank for product searches, losing sales to better-optimized competitors.',
'Improved organic visibility for product and category pages driving more sales.',
'Technical SEO audit, Product page optimization, Category page optimization, Schema markup, Site structure improvement, Page speed optimization, Content strategy, Monthly reporting');

-- ================== BUSINESS CONSULTING ==================
INSERT INTO services (category_id, slug, name, summary, long_description, base_price_inr, eta_days, icon, active, problem, outcome, includes) VALUES

-- Business Strategy Consultation
('cat-consulting', 'business-strategy', 'Business Strategy Consultation',
'Expert strategy session to address your key business challenges.',
'Sometimes you need an outside perspective to see opportunities and challenges clearly. Our strategy consultation brings experienced business thinking to your specific situation.

In a focused 4-hour session, we dig into your business model, competitive position, growth opportunities, and operational challenges. You leave with clear recommendations and an action plan.',
9999.00, 7, 'Target', true,
'Internal thinking is limited without outside perspective and strategic expertise.',
'Clear strategic direction with actionable recommendations addressing your key challenges.',
'Pre-session questionnaire, 4-hour strategy session, Business model analysis, Competitive assessment, Opportunity identification, Challenge prioritization, Action plan, Follow-up summary document'),

-- Market Research Report
('cat-consulting', 'market-research', 'Market Research Report',
'Comprehensive research on your target market and competition.',
'Entering new markets or launching products requires understanding market size, customer segments, competition, and trends. Our market research provides the insights you need for confident decision-making.

We combine desk research, data analysis, and competitive intelligence to deliver a comprehensive report with actionable recommendations.',
9999.00, 10, 'Search', true,
'Decisions made without proper market understanding risk expensive mistakes.',
'Comprehensive market insights enabling confident strategic decisions.',
'Market size estimation, Customer segment analysis, Competitive landscape, Key trend identification, Opportunity assessment, Risk factors, SWOT analysis, Recommendations'),

-- Go-to-Market Strategy
('cat-consulting', 'go-to-market', 'Go-to-Market Strategy',
'Complete launch strategy for new products or markets.',
'A great product without the right go-to-market strategy often fails. We develop comprehensive GTM plans covering positioning, pricing, channels, messaging, and launch execution.

Our GTM strategies are practical roadmaps that your team can execute—with clear priorities, timelines, and metrics to track success.',
14999.00, 14, 'Rocket', true,
'Product launches without proper GTM strategy waste resources and miss market opportunities.',
'Complete go-to-market roadmap ready for execution with clear priorities and metrics.',
'Market and customer analysis, Positioning framework, Pricing strategy, Channel selection, Marketing and sales alignment, Messaging guidelines, Launch timeline, Success metrics, Execution playbook'),

-- Digital Transformation Roadmap
('cat-consulting', 'digital-transformation', 'Digital Transformation Roadmap',
'Strategic plan for technology adoption and process digitization.',
'Digital transformation is not about technology—it is about using technology to improve how you serve customers and operate the business. Many transformation efforts fail because they lack clear strategy.

We assess your current state, identify high-impact opportunities, and create a phased roadmap that balances quick wins with longer-term initiatives. The result is a practical plan your organization can execute.',
24999.00, 21, 'Laptop', true,
'Ad-hoc technology adoption creates fragmented systems and fails to deliver business impact.',
'Clear digital transformation roadmap aligned with business goals and organizational capabilities.',
'Current state assessment, Opportunity identification, Technology recommendations, Process redesign, Change management considerations, Phased implementation roadmap, Quick wins identification, Investment requirements, Success metrics');

-- ================== TRAINING & WORKSHOPS ==================
INSERT INTO services (category_id, slug, name, summary, long_description, base_price_inr, eta_days, icon, active, problem, outcome, includes) VALUES

-- Digital Marketing Training
('cat-training', 'digital-marketing-training', 'Digital Marketing Training',
'Comprehensive 16-hour digital marketing course for your team.',
'Digital marketing is essential for every business, but many teams lack practical skills. Our training program covers the full digital spectrum—from strategy development to hands-on platform skills.

Participants learn through a combination of concepts, demonstrations, and practical exercises using real campaigns. The course is customized to your business context and skill levels.',
9999.00, 14, 'Monitor', true,
'Your team lacks digital marketing skills, limiting your online growth potential.',
'Trained team with practical digital marketing skills ready to apply immediately.',
'16 hours of training, SEO fundamentals, Google Ads, Social media marketing, Content marketing, Email marketing, Analytics and reporting, Practical exercises, Take-home resources, Certificates'),

-- Sales Training Workshop
('cat-training', 'sales-training', 'Sales Training Workshop',
'Full-day sales excellence program for your sales team.',
'Sales skills can be dramatically improved with proper training. Our workshop covers the complete sales process—from prospecting and discovery to objection handling and closing.

We emphasize consultative selling approaches that build relationships and solve customer problems. Training includes role-plays and real scenario practice.',
9999.00, 7, 'TrendingUp', true,
'Inconsistent sales approaches and poor conversion rates hurt revenue growth.',
'More confident, skilled sales team with improved conversion rates and customer relationships.',
'Full-day workshop, Buyer psychology, Prospecting techniques, Discovery skills, Presentation skills, Objection handling, Closing techniques, Role-play sessions, Sales playbook, Follow-up coaching call'),

-- Leadership Development
('cat-training', 'leadership-training', 'Leadership Development Program',
'Two-day intensive leadership workshop for managers.',
'Leadership skills do not come naturally to most people promoted into management roles. Our program develops essential leadership capabilities—communication, motivation, delegation, conflict resolution, and team development.

The two-day intensive combines frameworks, self-assessment, and practical application to create lasting behavior change.',
19999.00, 14, 'Crown', true,
'Managers promoted for technical skills lack leadership capabilities to develop their teams.',
'More effective leaders who can motivate teams, manage conflict, and drive performance.',
'Two-day intensive workshop, Leadership assessment, Communication skills, Team motivation, Delegation techniques, Conflict resolution, Performance management, Coaching skills, Action planning, 30-day follow-up session'),

-- Startup Bootcamp
('cat-training', 'startup-bootcamp', 'Startup Bootcamp',
'Intensive 2-day program for aspiring entrepreneurs.',
'Starting a business involves many unknowns. Our bootcamp accelerates your learning—covering idea validation, business models, customer discovery, funding basics, and essential legal and financial foundations.

Led by experienced entrepreneurs and investors, the program combines learning with practical exercises that apply directly to your startup idea.',
14999.00, 14, 'Rocket', true,
'Aspiring entrepreneurs waste time and money without proper foundations and guidance.',
'Clear understanding of startup fundamentals with validated business model and action plan.',
'Two-day intensive program, Idea validation methods, Business model canvas, Customer discovery techniques, MVP development, Funding landscape, Legal essentials, Financial basics, Pitch practice, Mentor connections, Startup India guidance');

SELECT 'Part 6: Content, E-Commerce, Consulting & Training services inserted successfully!' as status;
SELECT 'All 6 parts complete! Run clear_services.sql first, then parts 1-6 in order.' as final_status;

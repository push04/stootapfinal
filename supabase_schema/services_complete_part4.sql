-- ================================================
-- STOOTAP COMPLETE SERVICES - PART 4
-- Web Development & App Development Services
-- ================================================

-- ================== WEB DEVELOPMENT SERVICES ==================
INSERT INTO services (category_id, slug, name, summary, long_description, base_price_inr, eta_days, icon, active, problem, outcome, includes) VALUES

-- Landing Page
('cat-web', 'landing-page', 'Landing Page Design',
'High-converting single page website with lead capture forms.',
'A landing page is a focused, single-purpose page designed to convert visitors into leads or customers. Unlike full websites, landing pages eliminate distractions and guide visitors toward one specific action—signing up, downloading, or purchasing.

Our landing pages are designed using conversion optimization principles—compelling headlines, benefit-focused copy, trust signals, and strategic call-to-action placement. We build pages that load fast, look great on mobile, and actually convert.',
4999.00, 5, 'Layout', true,
'Your ads drive traffic to generic pages that fail to convert, wasting advertising budget.',
'A high-converting landing page that turns visitors into leads with clear, focused messaging.',
'Custom landing page design, Mobile-responsive, Lead capture form, Thank you page, Speed optimization, SEO basics, Google Analytics setup, Connection to your email tool'),

-- Business Website Basic
('cat-web', 'business-website-basic', 'Business Website - Basic',
'Professional 5-page website that establishes your online presence.',
'Your website is often the first interaction potential customers have with your business. A professional, well-designed website builds credibility and trust before you ever speak to a prospect.

Our basic business website package delivers a clean, professional design with 5 essential pages—Home, About, Services, Contact, and one additional page of your choice. The site is mobile-responsive, fast-loading, and optimized for search engines.',
9999.00, 10, 'Globe', true,
'No professional website makes your business invisible online and raises credibility concerns.',
'Professional website establishing online presence with essential business information and credibility.',
'5 custom pages, Mobile-responsive design, Contact form, Google Maps integration, Basic SEO setup, Social media links, Google Analytics, 1 month support'),

-- Business Website Premium
('cat-web', 'business-website-premium', 'Business Website - Premium',
'Feature-rich 10-page website with CMS and advanced functionality.',
'Growing businesses need websites that can evolve with them. Our premium package delivers a content management system (CMS) that lets you update content yourself, plus advanced features like animations, blog functionality, and integrated forms.

The 10-page structure gives room for detailed service pages, case studies, team profiles, and other content that builds trust and converts visitors into customers.',
19999.00, 14, 'Monitor', true,
'Your basic website lacks the depth and functionality needed to compete and convert effectively.',
'Full-featured website with content management capabilities and professional presentation.',
'10 custom pages, CMS (WordPress/similar), Blog section, Interactive elements, Advanced contact forms, Live chat integration, SEO optimization, Speed optimization, Social media integration, Gallery/Portfolio, 3 months support'),

-- E-Commerce Basic
('cat-web', 'ecommerce-basic', 'E-Commerce Website - Basic',
'Online store with up to 50 products and payment gateway integration.',
'Selling online opens your business to customers beyond geographical limits. Our e-commerce solution gives you a fully functional online store with product management, secure checkout, and payment processing.

We build stores that are easy for customers to navigate and easy for you to manage—adding products, processing orders, and tracking inventory without technical expertise.',
19999.00, 14, 'ShoppingCart', true,
'You cannot sell online and are losing sales to competitors with e-commerce capabilities.',
'Fully functional online store ready to accept orders and payments from customers anywhere.',
'Up to 50 products, Product categories, Payment gateway (Razorpay/PayU), Shipping zone setup, Order management, Inventory tracking, Customer accounts, Mobile-responsive, SSL security, Basic SEO'),

-- E-Commerce Advanced
('cat-web', 'ecommerce-advanced', 'E-Commerce Website - Advanced',
'Full-featured online store with 500 products and advanced capabilities.',
'Serious e-commerce businesses need advanced features—multiple payment options, sophisticated product variants, discount coupons, abandoned cart recovery, and detailed analytics.

Our advanced e-commerce package handles large catalogs with up to 500 products, includes marketing automation features, and integrates with shipping providers and accounting software for streamlined operations.',
39999.00, 21, 'Store', true,
'Your current store lacks the features needed to compete with advanced e-commerce competitors.',
'Enterprise-grade e-commerce platform with full features to scale your online sales.',
'Up to 500 products, Advanced product variants, Multiple payment gateways, Shipping integration (Shiprocket/Delhivery), Inventory management, Coupon and discount system, Abandoned cart recovery, Email automation, Customer reviews, Analytics dashboard, Accounting integration, 6 months support'),

-- WordPress Development
('cat-web', 'wordpress-development', 'WordPress Website',
'Custom WordPress website with professional theme and plugins.',
'WordPress powers over 40% of all websites for good reason—it is flexible, powerful, and easy to manage. Our WordPress development service creates custom sites that go far beyond basic templates.

We select or create themes that match your brand, configure plugins for your specific needs, and build a site that is fast, secure, and easy for you to update without technical knowledge.',
14999.00, 10, 'Layers', true,
'You need a professional website but want to manage content yourself without technical skills.',
'Custom WordPress site with intuitive content management and professional design.',
'Custom or premium theme, Essential plugins configured, 8-10 pages, Contact forms, Gallery/Portfolio, Blog setup, SEO plugin configuration, Security configuration, Speed optimization, Admin training, 2 months support'),

-- Web Application
('cat-web', 'web-application', 'Custom Web Application',
'Bespoke web application built for your specific business needs.',
'When off-the-shelf software does not fit your processes, a custom web application built specifically for your needs can transform operations. From customer portals to internal tools, we build applications that solve your unique challenges.

Our development process starts with understanding your requirements deeply, then architecting and building a solution that scales with your business. We use modern frameworks that ensure security, performance, and maintainability.',
49999.00, 30, 'Code', true,
'Existing software does not fit your processes, forcing manual workarounds and inefficiencies.',
'Custom web application that automates your specific workflows and scales with your business.',
'Requirements analysis, UI/UX design, Front-end development, Back-end development, Database design, User authentication, Admin dashboard, API integration, Testing, Deployment, 3 months support, Documentation'),

-- Website Speed Optimization
('cat-web', 'website-speed-optimization', 'Website Speed Optimization',
'Performance improvements for faster loading and better user experience.',
'Page speed directly impacts user experience and search rankings. Studies show that 40% of users abandon sites that take more than 3 seconds to load. Slow sites also rank lower in Google search results.

Our speed optimization service analyzes every aspect of your site—images, code, server configuration, and third-party scripts—implementing optimizations that dramatically improve load times.',
4999.00, 3, 'Zap', true,
'Slow website loading frustrates users, hurts conversions, and damages search rankings.',
'Fast-loading website with improved user experience and search engine performance.',
'Speed audit, Image optimization, Code minification, Browser caching, CDN setup, Database optimization, Third-party script optimization, Mobile speed improvement, Before/after report');

-- ================== APP DEVELOPMENT SERVICES ==================
INSERT INTO services (category_id, slug, name, summary, long_description, base_price_inr, eta_days, icon, active, problem, outcome, includes) VALUES

-- Android App Basic
('cat-app', 'android-app-basic', 'Android App - Basic',
'Simple Android application with up to 5 screens and essential features.',
'An Android app puts your business directly in customers'' pockets. Our basic app package is ideal for service businesses, restaurants, or companies wanting a mobile presence without complex functionality.

We develop native Android apps that are fast, reliable, and follow Google''s Material Design guidelines. The 5-screen structure covers essential functions like home, services/products, about, contact, and one custom feature.',
29999.00, 21, 'Smartphone', true,
'Your business lacks mobile presence while customers increasingly prefer app-based interactions.',
'A professional Android app that connects customers to your business from their phones.',
'5 screens/pages, Native Android development, Material Design UI, Push notifications, Contact integration, Social media links, Google Analytics, Play Store submission, 3 months support'),

-- Cross Platform App
('cat-app', 'cross-platform-app', 'Cross-Platform App',
'Single app for both iOS and Android using React Native or Flutter.',
'Why build two apps when you can build one that works everywhere? Cross-platform development with React Native or Flutter delivers apps for both iOS and Android from a single codebase—reducing cost and time to market.

Our cross-platform apps look and perform like native apps on each platform, while allowing you to maintain a single version. Updates reach all users simultaneously.',
49999.00, 30, 'Layers', true,
'Building separate iOS and Android apps doubles development and maintenance costs.',
'A single app that works beautifully on both platforms, reducing cost and complexity.',
'React Native or Flutter development, iOS and Android versions, Custom UI design, API integration, Push notifications, Analytics integration, App Store submission, Play Store submission, 3 months support'),

-- MVP Development
('cat-app', 'mvp-development', 'MVP Development',
'Minimum Viable Product to validate your startup idea quickly.',
'Launching a startup is about learning fast. An MVP (Minimum Viable Product) gives you something real to put in front of users, gather feedback, and validate assumptions before investing heavily in development.

We work with you to identify the core features that test your hypothesis, then build a functional product quickly. The MVP includes enough functionality to be useful while remaining focused on what you need to learn.',
79999.00, 45, 'Rocket', true,
'Spending months building the wrong product without learning from real users is a startup killer.',
'A functional MVP that validates your idea with real users and guides further development.',
'Product strategy workshop, Core feature identification, UI/UX design, Web or mobile development, User authentication, Core feature implementation, Basic admin panel, Analytics, Deployment, User feedback collection tools'),

-- App Store Submission
('cat-app', 'app-store-submission', 'App Store Submission',
'Complete app submission to Google Play Store and Apple App Store.',
'Getting your app approved and live on the app stores involves more than just uploading files. Both stores have specific requirements for screenshots, descriptions, privacy policies, and technical specifications.

We handle the entire submission process—preparing all assets, writing compelling store descriptions, configuring proper categories and keywords, and working through any review feedback until approval.',
4999.00, 5, 'Upload', true,
'Store submission is complicated and apps frequently get rejected for missing requirements.',
'Successfully published apps on both stores with optimized listings for discoverability.',
'Developer account setup assistance, App store screenshots, Store description writing, Keyword optimization, Privacy policy setup, App review response, Both store submissions, Approval follow-up');

SELECT 'Part 4: Web & App Development services inserted successfully!' as status;

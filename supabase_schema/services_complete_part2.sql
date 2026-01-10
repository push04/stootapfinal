-- ================================================
-- STOOTAP COMPLETE SERVICES - PART 2
-- Finance & Accounting Services
-- ================================================

-- ================== FINANCE & ACCOUNTING SERVICES ==================
INSERT INTO services (category_id, slug, name, summary, long_description, base_price_inr, eta_days, icon, active, problem, outcome, includes) VALUES

-- GST Registration
('cat-finance', 'gst-registration', 'GST Registration',
'Complete GST registration with GSTIN number for your business.',
'Goods and Services Tax (GST) registration is mandatory for businesses with annual turnover exceeding Rs 40 lakhs (Rs 20 lakhs for services in special category states). Even if below threshold, registration enables you to collect GST, claim input tax credit, and conduct interstate business.

Our comprehensive GST registration service handles the complete process including documentation verification, application filing on the GST portal, coordination with the GST officer for any queries, and obtaining your 15-digit GSTIN. We ensure accurate classification of your business activities and proper HSN/SAC code mapping.',
1499.00, 3, 'FileText', true,
'You cannot collect GST, claim input credit, or expand to other states without GST registration.',
'Active GSTIN enabling legal GST collection, input credit claims, and compliance with tax regulations.',
'GST application preparation, Document verification, Portal filing, ARN tracking, GSTIN certificate, GST compliance calendar, First return guidance'),

-- Monthly GST Return
('cat-finance', 'gst-return-monthly', 'Monthly GST Return Filing',
'GSTR-1 and GSTR-3B monthly compliance filing with reconciliation.',
'Regular GST registered businesses must file monthly returns—GSTR-1 for outward supplies by 11th and GSTR-3B for summary and tax payment by 20th. Late filing attracts penalties and interest, and can block your ability to file future returns.

Our monthly GST filing service includes collection and organization of your sales and purchase data, preparation of GSTR-1 and GSTR-3B, reconciliation with your books, filing on the GST portal, and payment challan generation. We ensure accurate filing to avoid notices and penalties.',
999.00, 2, 'Calendar', true,
'Missing GST deadlines results in penalties, interest charges, and complications in future filings.',
'Timely filed GST returns with proper reconciliation and maintained compliance record.',
'Sales and purchase data collection, GSTR-1 preparation and filing, GSTR-3B preparation and filing, Input credit reconciliation, Payment challan, Filing confirmation'),

-- GST Annual Return
('cat-finance', 'gst-annual-return', 'GST Annual Return (GSTR-9)',
'Annual GST return filing with complete reconciliation and audit.',
'GSTR-9 is the annual return summarizing all monthly/quarterly returns filed during the financial year. It requires reconciliation of turnover, tax paid, and input credit claimed with your audited financial statements.

Our annual return service includes comprehensive reconciliation of your GST returns with books of accounts, identification and resolution of mismatches, preparation of GSTR-9, and filing before the due date. For businesses above Rs 5 crore turnover, we also prepare GSTR-9C (reconciliation statement).',
4999.00, 7, 'CalendarCheck', true,
'Mismatches between monthly returns and annual reconciliation can trigger GST audits and notices.',
'Reconciled and filed annual GST return ensuring consistency across all filings and financial statements.',
'Return data compilation, Books reconciliation, GSTR-9 preparation, Mismatch identification, Filing and confirmation, GSTR-9C if applicable'),

-- Income Tax - Individual
('cat-finance', 'income-tax-filing-individual', 'Income Tax Return - Individual',
'ITR filing for salaried individuals with Form 16 and other income.',
'Filing income tax returns is mandatory if your income exceeds the basic exemption limit, or if you want to claim refunds on TDS deducted. Salaried individuals typically file ITR-1 or ITR-2 depending on their income sources.

Our individual ITR filing service includes review of Form 16, incorporation of other income sources (interest, rental, capital gains), claiming all eligible deductions under Section 80C, 80D, HRA, etc., computation of tax liability or refund, and e-filing with acknowledgment.',
999.00, 2, 'User', true,
'Missing ITR filing can result in penalties, notices, and issues with loans, visas, and large transactions.',
'Filed income tax return with maximum legitimate deductions claimed and refund tracking if applicable.',
'Form 16 review, Other income incorporation, Deduction optimization, ITR preparation, E-filing, Acknowledgment (ITR-V), Refund tracking'),

-- Income Tax - Business
('cat-finance', 'income-tax-filing-business', 'Income Tax Return - Business',
'ITR filing for businesses, professionals, and freelancers.',
'Businesses and professionals file ITR-3 or ITR-4 depending on their structure and whether they opt for presumptive taxation. These returns require detailed profit and loss computation, balance sheet preparation, and proper expense documentation.

Our business ITR service includes review of your business income and expenses, computation of profits under regular or presumptive scheme, depreciation calculations, tax liability computation with advance tax adjustments, and complete e-filing.',
2999.00, 5, 'Briefcase', true,
'Incorrect business ITR filing can lead to tax notices, assessments, and disallowance of claimed expenses.',
'Properly prepared and filed business ITR with accurate profit computation and tax optimization.',
'Income and expense review, Profit computation, Depreciation calculation, Balance sheet preparation, ITR-3 or ITR-4 filing, Advance tax adjustment, E-filing acknowledgment'),

-- Income Tax - Company
('cat-finance', 'income-tax-filing-company', 'Income Tax Return - Company',
'Corporate income tax return filing with complete compliance.',
'Private Limited Companies and LLPs file ITR-6 and ITR-5 respectively. These require audited financial statements, detailed schedules for assets and liabilities, related party transactions, and compliance with MAT (Minimum Alternate Tax) provisions.

Our corporate ITR service works alongside your statutory audit to ensure the filed return aligns with audited financials. We handle all schedules, compute book profit for MAT, account for brought forward losses, and ensure complete compliance with corporate tax provisions.',
9999.00, 14, 'Building', true,
'Corporate tax non-compliance leads to significant penalties, director liability, and compliance complications.',
'Filed corporate ITR aligned with audited financials and compliant with all corporate tax requirements.',
'Financial statement review, Schedule preparation, MAT computation, Loss carry-forward, ITR-6/5 preparation, E-filing, Acknowledgment and compliance record'),

-- TDS Return Filing
('cat-finance', 'tds-return-filing', 'TDS Return Filing',
'Quarterly TDS return filing with Form 24Q, 26Q, and 27Q.',
'Businesses that deduct TDS must file quarterly TDS returns—Form 24Q for salary TDS, Form 26Q for non-salary payments (contractors, rent, professional fees), and Form 27Q for payments to non-residents.

Our TDS return service ensures accurate filing with proper PAN validation, correct TDS rate application, and timely submission to avoid penalties. We also handle correction returns for rectifying errors in previously filed statements.',
1999.00, 3, 'FileSpreadsheet', true,
'Late or incorrect TDS returns result in fees, penalties, and issues for your payees claiming TDS credit.',
'Timely filed TDS returns with proper deductee details ensuring smooth credit to all parties.',
'TDS data compilation, PAN verification, Form 24Q/26Q/27Q preparation, TRACES filing, Provisional receipt, Correction statements if needed'),

-- Tax Audit
('cat-finance', 'tax-audit', 'Tax Audit (44AB)',
'Statutory tax audit for businesses exceeding turnover thresholds.',
'Tax audit under Section 44AB is mandatory for businesses with turnover exceeding Rs 1 crore (Rs 10 crore if 95% digital transactions) and professionals with receipts exceeding Rs 50 lakhs. The audit is conducted by a Chartered Accountant who verifies books and provides Form 3CA/3CD.

Our tax audit service includes complete verification of books of accounts, review of compliance with tax provisions, preparation of audit report in Form 3CA/3CD, identification of potential tax issues, and e-filing of audit report before the due date.',
14999.00, 14, 'FileSearch', true,
'Not conducting mandatory tax audit results in heavy penalties and disqualification from certain tax benefits.',
'Completed tax audit with signed Form 3CA/3CD filed on TRACES ensuring full statutory compliance.',
'Books of accounts review, Compliance verification, Tax provision review, Form 3CA-3CD preparation, Issue identification and resolution, E-filing on portal, Audit report copy'),

-- Statutory Audit
('cat-finance', 'statutory-audit', 'Statutory Audit',
'Company annual audit and financial statement certification.',
'Private Limited Companies must have their financial statements audited annually by a Chartered Accountant. The auditor examines books, verifies assets and liabilities, and provides an audit report accompanying the financial statements filed with ROC.

Our statutory audit service includes complete financial statement audit under applicable accounting standards, internal control review, management representation letter, auditor''s report, and coordination for AGM and ROC filing.',
19999.00, 21, 'ClipboardCheck', true,
'Companies cannot file annual returns with ROC or hold AGM without audited financial statements.',
'Audited financial statements with auditor''s report ready for AGM, ROC filing, and stakeholder distribution.',
'Financial statement audit, Accounting standards compliance, Internal control review, Management letter, Auditor''s report, AGM coordination, ROC filing support'),

-- Bookkeeping Monthly
('cat-finance', 'bookkeeping-monthly', 'Monthly Bookkeeping',
'Regular accounting, ledger maintenance, and financial tracking.',
'Proper books of accounts are essential for tax compliance, business decisions, and investor relations. However, most small businesses lack the expertise or time to maintain accurate records consistently.

Our monthly bookkeeping service includes recording all your business transactions, maintaining ledgers, bank reconciliation, expense categorization, and providing monthly financial summaries. We use modern accounting software to ensure your books are always up-to-date and accessible.',
3999.00, 30, 'BookOpen', true,
'Unorganized financial records lead to tax issues, poor decisions, and problems during audits or due diligence.',
'Well-maintained books of accounts with monthly reports providing clear financial visibility.',
'Transaction recording, Ledger maintenance, Bank reconciliation, Expense categorization, Monthly P&L summary, Balance sheet, Cloud access to books'),

-- Payroll Processing
('cat-finance', 'payroll-processing', 'Payroll Processing',
'Monthly salary processing, slip generation, and compliance.',
'Managing employee salaries involves complex calculations including basic pay, allowances, deductions, PF, ESI, professional tax, and TDS. Errors can lead to employee dissatisfaction and compliance issues.

Our payroll service handles end-to-end salary processing including attendance integration, earnings and deductions calculation, pay slip generation, bank payment file preparation, and statutory compliance. We ensure accurate and timely salary disbursement every month.',
2999.00, 3, 'Wallet', true,
'Manual payroll processing is error-prone and risks compliance violations and employee dissatisfaction.',
'Accurate monthly payroll with professional pay slips and all statutory compliances handled.',
'Salary calculation, Pay slip generation, Bank payment file, PF contribution challan, ESI contribution if applicable, TDS computation, Professional tax'),

-- PF Registration
('cat-finance', 'pf-registration', 'PF Registration',
'Employees Provident Fund registration for employers.',
'EPF registration is mandatory for establishments with 20 or more employees. It provides retirement benefits to employees and is administered by the Employees'' Provident Fund Organisation (EPFO).

Our PF registration service handles the complete process including employer registration on the EPFO unified portal, obtaining the PF establishment code, KYC verification, and guidance on contribution rates and compliance requirements.',
2999.00, 7, 'Shield', true,
'Operating without mandatory PF registration attracts penalties and legal action from labor authorities.',
'Active PF establishment code enabling legal employee enrollment and contribution deposits.',
'Employer registration, Establishment code, KYC completion, Employee enrollment guidance, Contribution rate briefing, Compliance calendar'),

-- ROC Annual Filing
('cat-finance', 'roc-annual-filing', 'ROC Annual Filing',
'Annual return and financial statement filing with Registrar of Companies.',
'Every company must file annual returns (Form MGT-7/MGT-7A) and financial statements (Form AOC-4) with ROC within specified timelines. Non-filing results in penalties calculated per day of delay and can lead to company strike-off.

Our ROC filing service includes preparation of annual return, verification of financial statements for filing, e-form preparation and filing, fee calculation and payment, and filing acknowledgment. We track your deadlines to ensure timely compliance.',
4999.00, 7, 'FileStack', true,
'Delayed ROC filings attract daily penalties and can result in director disqualification and company strike-off.',
'Timely filed annual returns and financial statements maintaining clean compliance history with ROC.',
'Form MGT-7/7A preparation, Form AOC-4 preparation, Document verification, E-filing on MCA portal, Fee payment, Filing acknowledgment, Compliance record update'),

-- Virtual CFO Services
('cat-finance', 'cfo-services', 'Virtual CFO Services',
'Part-time CFO expertise for startups and growing businesses.',
'Startups and SMEs need strategic financial guidance but cannot afford a full-time CFO. Our Virtual CFO service provides C-level financial expertise on a part-time basis—helping with financial planning, investor relations, cash flow management, and strategic decisions.

Our experienced CFOs work with your team to build financial discipline, prepare for fundraising, optimize working capital, and provide the financial leadership your business needs to scale sustainably.',
14999.00, 30, 'UserCog', true,
'Lack of financial strategy expertise hampers growth, fundraising, and operational efficiency.',
'Strategic financial leadership with improved financial health, investor readiness, and growth planning.',
'Monthly CFO consultation, Financial planning and analysis, Cash flow management, Investor deck review, MIS reporting, Strategic financial advice, Board presentation support');

SELECT 'Part 2: Finance & Accounting services inserted successfully!' as status;

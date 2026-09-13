# Invoice Generator SaaS - Complete Page Structure

## PHASE 1: MVP LAUNCH (Week 1-4)

### PUBLIC PAGES (No Login Required)

---

#### 1. **Landing Page** `/`
**Purpose:** Convert visitors to users
**Must-have sections:**
- Hero section with value proposition
  - H1: "Create Professional Invoices in 30 Seconds"
  - Subheading: "No signup required. No credit card. Just invoices."
  - CTA: "Create Your First Invoice" (goes to `/create`)
  - Animated demo GIF/video
  
- Problem section
  - Show pain points (slow, complicated, expensive)
  - Visual comparison vs competitors
  
- Solution section (How it works)
  - Step 1: Enter details
  - Step 2: See live preview
  - Step 3: Download PDF
  - "Try it now" CTA
  
- Features grid (4-6 features)
  - No signup needed
  - Real-time preview
  - Beautiful templates
  - Instant PDF
  - Email delivery
  - Payment tracking
  
- Social proof (if you have it)
  - User count: "Join 1,000+ freelancers"
  - Testimonials (add later)
  
- Pricing teaser
  - "Free forever. Premium features coming soon."
  
- Footer
  - Links to other pages
  - Social media
  - Copyright

**Priority:** CRITICAL - This is your first impression
**Time to build:** 2-3 days

---

#### 2. **Invoice Creator** `/create`
**Purpose:** Core product - create invoices
**Layout:**
- Split screen design
  - Left: Form inputs
  - Right: Live preview
  
**Form sections:**
- Your business info
  - Company name *
  - Email *
  - Address
  - Phone
  - Tax ID
  - Logo upload
  
- Client info
  - Client name *
  - Email *
  - Address
  - Phone
  - Tax ID
  
- Invoice details
  - Invoice number (auto-generated)
  - Invoice date (default: today)
  - Due date
  - Payment terms (Net 30, etc.)
  
- Line items
  - Description *
  - Quantity *
  - Rate *
  - Amount (auto-calculated)
  - [Add item] button
  - [Remove item] button
  
- Calculations
  - Subtotal (auto)
  - Discount (% or fixed)
  - Tax (% or fixed)
  - Total (auto, bold)
  
- Notes/Terms
  - Additional notes
  - Payment terms
  - Thank you message
  
**Actions:**
- [Download PDF] button (primary)
- [Save to account] button (if logged in)
- [Email invoice] button (premium)
- [Clear form] button
- Template selector dropdown

**Features:**
- Auto-save to localStorage every 5 seconds
- Recovery prompt if page reloads
- Keyboard shortcuts (Ctrl+S = download)
- Real-time validation
- Currency selector

**Priority:** CRITICAL - This IS your product
**Time to build:** 5-7 days

---

#### 3. **About Page** `/about`
**Purpose:** Build trust, tell your story
**Sections:**
- Your story
  - Why you built this
  - Problem you're solving
  - Your mission
  
- How it works
  - Technical overview (simple)
  - Privacy & security
  - Data storage explanation
  
- Team (optional)
  - Your photo + bio
  - Or "Solo founder" story
  
- Contact info
  - Email
  - Social links
  - Support options

**Priority:** MEDIUM - Builds trust
**Time to build:** 2-3 hours

---

#### 4. **Pricing Page** `/pricing`
**Purpose:** Show plans, convert to paid
**Layout:**
- Header
  - "Simple, transparent pricing"
  - "No hidden fees. Cancel anytime."
  
- Pricing cards (3 columns)
  - Free tier
  - Pro tier ($9/mo)
  - Business tier ($29/mo)
  
- Each card shows:
  - Price
  - Features list (checkmarks)
  - CTA button
  - Most popular badge (on Pro)
  
- FAQ section below
  - Common pricing questions
  - Payment methods
  - Refund policy
  
- Comparison table
  - Feature comparison across tiers
  
**Features:**
- Toggle: Monthly / Annual (show savings)
- Currency selector (USD / BDT)
- Highlight differences clearly

**Priority:** HIGH - After MVP testing
**Time to build:** 1 day

**Note:** For initial launch, show:
```
"Pricing Coming Soon
Currently in beta - free for all users.
Enter your email to get notified when pricing launches."
```

---

#### 5. **Features Page** `/features`
**Purpose:** SEO, detailed feature explanations
**Sections:**
- Hero: "Everything you need to invoice faster"
- Feature grid (6-12 features)
  - Each feature:
    - Icon
    - Title
    - Description
    - Screenshot/demo
    
**Features to highlight:**
- No signup required
- Real-time preview
- Beautiful templates
- One-click PDF
- Email delivery (coming soon)
- Payment tracking (coming soon)
- Multi-currency
- Custom branding
- Cloud storage (premium)
- Recurring invoices (premium)

**Priority:** MEDIUM - Good for SEO
**Time to build:** 4-6 hours

---

#### 6. **Contact Page** `/contact`
**Purpose:** User support, feedback
**Content:**
- Contact form
  - Name
  - Email
  - Subject
  - Message
  - [Send] button
  
- Alternative contact methods
  - Email: support@yourapp.com
  - Twitter: @yourapp
  - Response time: "Within 24 hours"
  
- FAQ link
  - "Check our FAQ first"

**Priority:** MEDIUM
**Time to build:** 2-3 hours

---

#### 7. **Privacy Policy** `/privacy`
**Purpose:** Legal compliance, GDPR
**Sections:**
- What data we collect
- How we use it
- How we store it
- Your rights
- Contact for privacy concerns

**Priority:** HIGH - Legal requirement
**Time to build:** 2 hours (use generator)

**Tools:**
- https://www.privacypolicygenerator.info/
- https://termly.io/

---

#### 8. **Terms of Service** `/terms`
**Purpose:** Legal protection
**Sections:**
- Service description
- User responsibilities
- Payment terms
- Refund policy
- Limitation of liability
- Dispute resolution

**Priority:** HIGH - Legal requirement
**Time to build:** 2 hours (use generator)

---

#### 9. **FAQ Page** `/faq`
**Purpose:** Answer common questions
**Questions:**
- Do I need to sign up?
- Is it really free?
- How do I save my invoices?
- What payment methods do you accept?
- Can I customize templates?
- Do you store my data?
- How do I delete my data?
- Can I export to QuickBooks?
- Do you support my country?
- What if I need a refund?

**Priority:** MEDIUM - Reduces support burden
**Time to build:** 3-4 hours

---

#### 10. **Blog** `/blog` (Optional)
**Purpose:** SEO, content marketing
**Content ideas:**
- "How to create an invoice in 30 seconds"
- "Invoice best practices for freelancers"
- "What to include in a professional invoice"
- "How to get clients to pay faster"
- "Invoice templates for [industry]"

**Priority:** LOW - Not for MVP
**Time to build:** Ongoing

---

### AUTHENTICATION PAGES (Phase 2)

---

#### 11. **Sign Up** `/signup`
**Purpose:** User registration
**Form fields:**
- Name
- Email
- Password
- Confirm password
- [Sign up] button
- "Already have account? [Log in]"

**Features:**
- Email verification
- Password strength indicator
- Social login (Google, optional)
- Terms acceptance checkbox

**Priority:** PHASE 2 - After MVP validation
**Time to build:** 1 day

---

#### 12. **Login** `/login`
**Purpose:** User authentication
**Form fields:**
- Email
- Password
- Remember me checkbox
- [Log in] button
- "Forgot password?" link
- "Don't have account? [Sign up]"

**Features:**
- Social login (Google, optional)
- Session management
- Redirect to dashboard after login

**Priority:** PHASE 2
**Time to build:** 3-4 hours

---

#### 13. **Forgot Password** `/forgot-password`
**Purpose:** Password recovery
**Flow:**
- Enter email
- Receive reset link
- Reset password
- Redirect to login

**Priority:** PHASE 2
**Time to build:** 2-3 hours

---

#### 14. **Email Verification** `/verify-email`
**Purpose:** Confirm email address
**Flow:**
- User clicks link from email
- Token verified
- Success message
- Redirect to dashboard

**Priority:** PHASE 2
**Time to build:** 2-3 hours

---

### DASHBOARD PAGES (Logged-in Users Only)

---

#### 15. **Dashboard** `/dashboard`
**Purpose:** User home, overview
**Sections:**
- Welcome message
  - "Welcome back, [Name]"
  
- Quick stats (cards)
  - Total invoices created
  - Total amount invoiced
  - Paid vs unpaid
  - This month's revenue
  
- Quick actions
  - [Create new invoice] button (primary)
  - [View all invoices] button
  - [Manage clients] button
  
- Recent invoices (table)
  - Invoice #
  - Client
  - Amount
  - Status (paid/unpaid/overdue)
  - Date
  - Actions (view, edit, delete)
  
- Usage stats (for free users)
  - "8 / 10 invoices used this month"
  - Progress bar
  - "Upgrade to Pro for unlimited" CTA

**Priority:** PHASE 2
**Time to build:** 2 days

---

#### 16. **Invoices List** `/dashboard/invoices`
**Purpose:** View all invoices
**Layout:**
- Header
  - [Create new invoice] button
  - Search bar
  - Filter dropdown (All, Paid, Unpaid, Overdue)
  - Sort dropdown (Date, Amount, Client)
  
- Table view
  - Columns:
    - Invoice # (clickable)
    - Client name
    - Amount
    - Status badge
    - Date issued
    - Due date
    - Actions (view, edit, duplicate, delete, download, email)
  
- Pagination
  - 20 per page
  - Load more button
  
- Empty state
  - "No invoices yet"
  - "Create your first invoice" CTA

**Priority:** PHASE 2
**Time to build:** 1 day

---

#### 17. **Invoice Detail** `/dashboard/invoices/[id]`
**Purpose:** View single invoice
**Layout:**
- Invoice preview (large)
- Action buttons
  - [Download PDF]
  - [Send via email]
  - [Edit]
  - [Duplicate]
  - [Delete]
  - [Mark as paid/unpaid]
  
- Payment history (if any)
  - Date paid
  - Amount
  - Payment method
  
- Activity log
  - Created on [date]
  - Sent to [email] on [date]
  - Viewed by client on [date]
  - Paid on [date]

**Priority:** PHASE 2
**Time to build:** 4-6 hours

---

#### 18. **Edit Invoice** `/dashboard/invoices/[id]/edit`
**Purpose:** Modify existing invoice
**Layout:**
- Same as `/create` but:
  - Pre-filled with existing data
  - "Update invoice" instead of "Create invoice"
  - Warning if invoice already sent/paid
  
**Features:**
- Auto-save changes
- Version history (optional)
- Disallow editing certain fields if paid

**Priority:** PHASE 2
**Time to build:** 3-4 hours (reuse create page)

---

#### 19. **Clients List** `/dashboard/clients`
**Purpose:** Manage clients
**Layout:**
- Header
  - [Add new client] button
  - Search bar
  
- Table view
  - Client name
  - Email
  - Phone
  - Total invoiced
  - Outstanding balance
  - Actions (view, edit, delete)
  
- Empty state
  - "No clients yet"
  - Clients auto-added when you create invoices

**Priority:** PHASE 2
**Time to build:** 1 day

---

#### 20. **Client Detail** `/dashboard/clients/[id]`
**Purpose:** View client info + invoices
**Sections:**
- Client info card
  - Name, email, phone, address
  - [Edit] button
  
- Stats
  - Total invoiced
  - Total paid
  - Outstanding balance
  
- Invoice history
  - All invoices for this client
  - Same table as invoices page

**Priority:** PHASE 2
**Time to build:** 3-4 hours

---

#### 21. **Settings** `/dashboard/settings`
**Purpose:** User preferences
**Tabs:**

**Profile tab:**
- Name
- Email
- Password change
- Avatar upload

**Business tab:**
- Company name
- Logo
- Address
- Phone
- Tax ID
- Website

**Billing tab:**
- Current plan
- Usage stats
- [Upgrade] button
- Payment method
- Billing history
- [Cancel subscription] button

**Preferences tab:**
- Default currency
- Date format
- Number format
- Default payment terms
- Email notifications toggle

**Account tab:**
- [Delete account] button
- Export data
- Account created date

**Priority:** PHASE 2
**Time to build:** 1 day

---

#### 22. **Templates** `/dashboard/templates`
**Purpose:** Manage invoice templates
**Layout:**
- Template gallery
  - Thumbnail previews
  - Template name
  - "Active" badge
  - [Preview] [Select] [Customize] buttons
  
- Customization panel (if premium)
  - Colors
  - Fonts
  - Logo position
  - Layout options

**Priority:** PHASE 3 (after launch)
**Time to build:** 2-3 days

---

### SUBSCRIPTION PAGES (Phase 3)

---

#### 23. **Upgrade Page** `/upgrade`
**Purpose:** Convert free to paid
**Layout:**
- Pricing comparison
- Feature comparison table
- FAQ
- Testimonials
- [Choose plan] buttons
- Money-back guarantee badge

**Priority:** PHASE 3
**Time to build:** 4-6 hours

---

#### 24. **Checkout Success** `/subscription/success`
**Purpose:** Post-payment confirmation
**Content:**
- Success message
- Receipt details
- Next steps
- [Go to dashboard] button

**Priority:** PHASE 3
**Time to build:** 1 hour

---

#### 25. **Subscription Cancelled** `/subscription/cancelled`
**Purpose:** User cancelled
**Content:**
- "You're still on [plan] until [date]"
- Feedback form (why did you cancel?)
- [Reactivate] button

**Priority:** PHASE 3
**Time to build:** 1 hour

---

### ERROR PAGES

---

#### 26. **404 Not Found** `/404`
**Content:**
- "Page not found"
- Search bar
- [Go home] button
- Helpful links

**Priority:** MEDIUM
**Time to build:** 30 minutes

---

#### 27. **500 Server Error** `/500`
**Content:**
- "Something went wrong"
- "We've been notified"
- [Try again] button
- [Go home] button

**Priority:** MEDIUM
**Time to build:** 30 minutes

---

#### 28. **403 Forbidden** `/403`
**Content:**
- "You don't have access"
- Explanation
- [Upgrade] button (if feature locked)
- [Go back] button

**Priority:** MEDIUM
**Time to build:** 30 minutes

---

## LAUNCH PHASES - WHAT TO BUILD WHEN

### PHASE 1: MVP LAUNCH (Week 1-4)

**Must-have pages:**
1. Landing page `/`
2. Invoice creator `/create`
3. About `/about`
4. Privacy policy `/privacy`
5. Terms of service `/terms`
6. Contact `/contact`
7. 404 page `/404`

**Total: 7 pages**
**Time: 2-3 weeks**

**Deploy this and launch.**

---

### PHASE 2: ADD ACCOUNTS (Week 5-8)

**Add pages:**
8. Sign up `/signup`
9. Login `/login`
10. Forgot password `/forgot-password`
11. Dashboard `/dashboard`
12. Invoices list `/dashboard/invoices`
13. Invoice detail `/dashboard/invoices/[id]`
14. Edit invoice `/dashboard/invoices/[id]/edit`
15. Settings `/dashboard/settings`

**Total: 15 pages**
**Time: 2-3 weeks**

---

### PHASE 3: ADD PREMIUM (Week 9-12)

**Add pages:**
16. Pricing `/pricing`
17. Features `/features`
18. Upgrade `/upgrade`
19. Clients list `/dashboard/clients`
20. Client detail `/dashboard/clients/[id]`
21. Templates `/dashboard/templates`
22. Checkout success `/subscription/success`
23. FAQ `/faq`

**Total: 23 pages**
**Time: 3-4 weeks**

---

### PHASE 4: OPTIMIZATION (Month 4+)

**Add pages:**
24. Blog `/blog`
25. Blog post `/blog/[slug]`
26. Help center `/help`
27. Changelog `/changelog`
28. API docs `/docs`

**These are NOT essential for launch.**

---

## MOBILE PAGES (Responsive)

**All pages must work on mobile, but consider mobile-specific versions:**
- `/m/create` - Simplified mobile invoice creator
- Progressive Web App (PWA) support
- Native apps (Phase 5, far future)

---

## PAGE PRIORITY MATRIX

### CRITICAL (Build first):
- `/` - Landing
- `/create` - Invoice creator
- `/privacy` - Legal
- `/terms` - Legal

### HIGH (Build second):
- `/about` - Trust
- `/contact` - Support
- `/signup` - Growth
- `/login` - Access
- `/dashboard` - User home

### MEDIUM (Build third):
- `/pricing` - Monetization
- `/features` - Marketing
- `/dashboard/invoices` - Management
- `/dashboard/settings` - Preferences

### LOW (Build later):
- `/blog` - SEO
- `/faq` - Support
- `/help` - Documentation

---

## NAVIGATION STRUCTURE

### Public Header (Not logged in):
```
Logo | Features | Pricing | About | Contact | [Log in] [Sign up]
```

### Public Header (MVP launch):
```
Logo | Features | About | Contact | [Create Invoice]
```

### Dashboard Header (Logged in):
```
Logo | Dashboard | Invoices | Clients | Settings | [User menu]
```

### Footer (All pages):
```
Product: Features, Pricing, About
Legal: Privacy, Terms, Contact
Social: Twitter, LinkedIn, GitHub
```

---

## TECHNICAL NOTES

### Routing Structure (Next.js):
```
/app
  /(marketing)
    /page.tsx                    # Landing
    /about/page.tsx              # About
    /features/page.tsx           # Features
    /pricing/page.tsx            # Pricing
    /contact/page.tsx            # Contact
    /privacy/page.tsx            # Privacy
    /terms/page.tsx              # Terms
    /faq/page.tsx                # FAQ
    
  /create/page.tsx               # Invoice creator (no auth)
  
  /(auth)
    /login/page.tsx              # Login
    /signup/page.tsx             # Signup
    /forgot-password/page.tsx    # Password reset
    
  /dashboard
    /page.tsx                    # Dashboard home
    /invoices/page.tsx           # List
    /invoices/[id]/page.tsx      # Detail
    /invoices/[id]/edit/page.tsx # Edit
    /clients/page.tsx            # Clients list
    /clients/[id]/page.tsx       # Client detail
    /settings/page.tsx           # Settings
    /templates/page.tsx          # Templates
    
  /subscription
    /success/page.tsx            # Success
    /cancelled/page.tsx          # Cancelled
    
  /not-found.tsx                 # 404
  /error.tsx                     # 500
```

---

## MVP SITEMAP (Week 1-4)

```
Home (/)
├── Create Invoice (/create) ← MAIN PRODUCT
├── About (/about)
├── Contact (/contact)
├── Privacy (/privacy)
└── Terms (/terms)
```

**That's it. 5 pages. Ship this first.**

---

## QUESTIONS TO ASK YOURSELF

Before building each page:

1. **Do users need this to use the product?** (Critical vs nice-to-have)
2. **Can I build this in 1 day?** (If no, simplify)
3. **Will users notice if this is missing?** (If no, skip for MVP)
4. **Does this help conversion?** (Yes = prioritize)
5. **Is this legally required?** (Yes = must have)

---

## YOUR ACTION PLAN

**This Week:**
1. Build landing page
2. Build invoice creator
3. Add privacy/terms (use generator)

**Next Week:**
4. Polish invoice creator
5. Test with 10 people
6. Deploy to Vercel

**Week 3:**
7. Launch on Product Hunt
8. Get first 100 users
9. Gather feedback

**Week 4+:**
10. Build based on user requests
11. Don't build features nobody asks for

---

**Start with the landing page and invoice creator. Nothing else matters until those work perfectly.**

**Which page are you building first?**
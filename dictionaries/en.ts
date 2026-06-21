// English copy dictionary. English-only for now, but structured so a Hebrew/RTL
// dictionary can be added later (mirrors the desktop app's src/locales approach).
// To add a language: create dictionaries/<code>.ts with the same shape and wire a
// locale switch.

export const en = {
  brand: {
    name: "Orenew",
    tagline: "Batch photo framing for event photographers",
  },
  nav: {
    features: "Features",
    pricing: "Pricing",
    download: "Download",
    faq: "FAQ",
    signIn: "Sign in",
    account: "My account",
    greeting: "Hello, {name}",
  },
  hero: {
    eyebrow: "Desktop app for event photographers",
    title: "Frame a whole event in one click.",
    subtitle:
      "Drag in an SD-card dump, pick a decorative frame, and export print-ready magnets and prints in seconds. Your source photos are never touched.",
    ctaPrimary: "Download free",
    ctaSecondary: "See pricing",
    note: "Free forever with watermarked output. No credit card required.",
  },
  features: {
    title: "What you won't find in the other tools",
    subtitle:
      "Most batch framers stop at \"apply a border.\" Orenew is built for the live print table — the parts that actually slow you down at the event are the parts we automated.",
    items: [
      {
        title: "Automatic orientation detection",
        icon: "orientation",
        body: "Every photo is sorted into landscape or portrait for you, so the right frame is applied without sorting by hand — and a one-click override is there for the shots you want to flip.",
      },
      {
        title: "Copies, not duplicate files",
        icon: "copies",
        body: "Set how many prints each photo needs as a number on the photo — no cluttering your disk with copy-1, copy-2 files. Orenew even suggests a copy count from the number of faces it sees.",
      },
      {
        title: "Remembers what you exported",
        icon: "remembered",
        body: "Orenew tracks how many copies of each photo you've already exported, so re-running a batch never doubles up a print or leaves a guest short.",
      },
      {
        title: "Many batches at once",
        icon: "batches",
        body: "Open and process several events side by side. No closing one job to start the next — keep every print table moving in parallel.",
      },
      {
        title: "Insanely fast exports",
        icon: "fast",
        body: "A native crop/resize pipeline on a bounded thread pool turns a full card into print-ready sheets in seconds, without choking your laptop.",
      },
      {
        title: "Real-time folder watching",
        icon: "watch",
        body: "New photos dropped into the folder appear instantly — even while you're previewing a photo in the lightbox — so the line never waits on a re-import.",
      },
    ],
  },
  showcase: {
    title: "From card dump to finished sheet",
    subtitle:
      "A gallery you can fly through, a lightbox to check every frame, and a one-dialog export.",
    gallery: "Gallery",
    lightbox: "Lightbox preview",
    export: "Export dialog",
  },
  beforeAfter: {
    title: "Before & after",
    subtitle: "Same photo, one click apart.",
    before: "Source photo",
    after: "Framed for print",
  },
  pricing: {
    title: "Simple, honest pricing",
    subtitle:
      "Start free. Upgrade when you're ready to drop the watermark. Cancel anytime — access lasts until the end of your billing period.",
    monthly: "Monthly",
    yearly: "Yearly",
    yearlyBadge: "Save 17%",
    perMonth: "/mo",
    perYear: "/yr",
    billedYearly: "billed yearly",
    mostPopular: "Most popular",
    yourPlan: "Your plan",
    seatsOne: "1 device seat",
    seatsOther: "{count} device seats",
    seatsUncapped: "Unlimited devices",
    current: "Current plan",
    tiers: {
      free: {
        name: "Free",
        tagline: "For trying Orenew on a real event.",
        cta: "Download",
        features: [
          "Full batch framing & export",
          "All canvas & frame presets",
          "Unlimited devices",
          "Watermarked output",
        ],
      },
      pro: {
        name: "Pro",
        tagline: "For the solo event photographer.",
        cta: "Get Pro",
        features: [
          "Everything in Free",
          "No watermark",
          "1 device seat",
          "14-day offline grace",
        ],
      },
      studio: {
        name: "Studio",
        tagline: "For multi-operator print tables.",
        cta: "Get Studio",
        features: [
          "Everything in Pro",
          "5 device seats",
          "Priority email support",
        ],
      },
    },
  },
  download: {
    title: "Download Orenew",
    subtitle: "Free to use, watermarked until you upgrade. Works offline.",
    detected: "We detected {os} — here's your build:",
    detectFailed: "Pick your platform:",
    primaryFor: "Download for {os}",
    allReleases: "All releases & changelog",
    requirementsTitle: "System requirements",
    requirements: [
      "Windows 10/11 (64-bit), macOS 12+, or a modern Linux desktop",
      "~4 GB RAM free for large batches (memory-bounded to ~500 MB)",
      "Internet connection for sign-in; runs offline with a 14-day grace window",
    ],
    os: {
      windows: "Windows",
      macos: "macOS",
      linux: "Linux",
      unknown: "your platform",
    },
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "What does the Free tier actually include?",
        a: "Everything — full batch framing, all canvas and frame presets, and unlimited devices. The only limit is a watermark composited onto exported and printed output. Upgrade to Pro or Studio to remove it.",
      },
      {
        q: "What is a device seat?",
        a: "Each machine that signs in occupies one seat on your subscription. Pro includes 1 seat and Studio includes 5. You can disconnect a device from your account at any time to free a seat for another machine.",
      },
      {
        q: "Does Orenew work offline?",
        a: "Yes. After signing in once, your tier is cached as a signed, device-bound token with a 14-day offline grace window. As long as you reconnect within 14 days, you can keep working without internet.",
      },
      {
        q: "How do refunds and cancellations work?",
        a: "Billing is handled by Lemon Squeezy, our merchant of record. You can cancel anytime from the billing portal; your tier stays active until the end of the current period, then drops to Free. For refunds, contact support through the billing portal.",
      },
      {
        q: "Will buying online unlock my desktop app automatically?",
        a: "Yes. Purchases are tied to your account, so the next time the desktop app refreshes it picks up your new tier — no license keys to copy or paste.",
      },
      {
        q: "Are my original photos safe?",
        a: "Always. Orenew treats your source folder as strictly read-only; all edits, crops, and counts live in Orenew's own internal store.",
      },
    ],
  },
  legal: {
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: June 2026",
      intro:
        "This Privacy Policy explains how Orenew (\"we\", \"us\") handles personal information across the Orenew website and the Orenew desktop application. It is written to meet the EU/UK GDPR, the California Consumer Privacy Act (CCPA/CPRA), and the Israeli Privacy Protection Law.",
      sections: [
        {
          heading: "Who we are",
          body: "Orenew provides a desktop application that batch-applies decorative frames to event photos, together with this website for marketing, downloads, and subscription management. For questions about this policy or your data, contact us at support@orenew.app.",
        },
        {
          heading: "Information we collect",
          body: [
            "Account information: when you create an account we collect your email address and authentication details (including data from Google or Facebook if you choose social sign-in).",
            "Billing information: subscriptions are processed by Lemon Squeezy, our merchant of record. We receive your subscription status, plan, and billing period — we do not receive or store your full card number.",
            "Device and licensing data: to enforce seat limits we record which devices are connected to your account.",
            "Website usage: basic technical data such as IP address, browser type, and pages visited, used to operate and secure the site.",
            "Your photos stay on your computer. The desktop app treats your source folders as read-only and processes images locally; your photos are not uploaded to us.",
          ],
        },
        {
          heading: "How we use information",
          body: [
            "To create and manage your account and provide the app and website.",
            "To process subscriptions, enforce device seats, and deliver your plan to the desktop app.",
            "To respond to support requests and send service-related messages.",
            "To secure our services and comply with legal obligations.",
          ],
        },
        {
          heading: "Legal bases (GDPR)",
          body: "Where the GDPR applies, we process personal data to perform our contract with you (providing the service), to pursue our legitimate interests (securing and improving the service), to comply with legal obligations, and on the basis of your consent where required (for example, non-essential third-party scripts).",
        },
        {
          heading: "How we share information",
          body: [
            "Supabase — authentication and database hosting for your account and entitlements.",
            "Lemon Squeezy — payment processing and subscription management as merchant of record.",
            "UserWay — the third-party accessibility widget, which loads a script from its servers and may receive your IP address when the widget runs.",
            "Hosting and infrastructure providers that run the website.",
            "We do not sell your personal information. We may disclose information if required by law or to protect our rights.",
          ],
        },
        {
          heading: "International transfers",
          body: "Our providers may process data outside your country, including in the United States. Where required, such transfers rely on appropriate safeguards such as the European Commission's Standard Contractual Clauses.",
        },
        {
          heading: "Data retention",
          body: "We keep account and subscription data for as long as your account is active and as needed to comply with legal, tax, and accounting obligations. You can ask us to delete your account at any time.",
        },
        {
          heading: "Your rights (EU/UK GDPR)",
          body: "You have the right to access, correct, delete, and port your data, to restrict or object to processing, and to withdraw consent. You may also lodge a complaint with your local data protection authority.",
        },
        {
          heading: "Your rights (California — CCPA/CPRA)",
          body: "California residents have the right to know what personal information we collect, to access and delete it, to correct inaccuracies, and to opt out of the sale or sharing of personal information. We do not sell or share personal information, and we will not discriminate against you for exercising your rights.",
        },
        {
          heading: "Your rights (Israel)",
          body: "Under the Israeli Privacy Protection Law you have the right to review the information we hold about you and to request that inaccurate, incomplete, or outdated information be corrected or deleted. To exercise these rights, contact support@orenew.app.",
        },
        {
          heading: "Cookies and tracking",
          body: "The website uses essential cookies required for sign-in and session management. The accessibility widget is provided by a third party and may set its own cookies or storage when enabled.",
        },
        {
          heading: "Security",
          body: "We use industry-standard measures to protect your data, including encryption in transit. No method of transmission or storage is perfectly secure, but we work to protect your information against unauthorized access.",
        },
        {
          heading: "Children",
          body: "Orenew is intended for business and professional use and is not directed to children under 16. We do not knowingly collect personal information from children.",
        },
        {
          heading: "Changes to this policy",
          body: "We may update this policy from time to time. Material changes will be reflected by updating the date at the top of this page.",
        },
        {
          heading: "Contact us",
          body: "For any privacy question or to exercise your rights, email support@orenew.app.",
        },
      ],
    },
    terms: {
      title: "Terms of Use",
      lastUpdated: "Last updated: June 2026",
      intro:
        "These Terms of Use govern your use of the Orenew website and the Orenew desktop application. By creating an account, downloading, or using Orenew, you agree to these terms.",
      sections: [
        {
          heading: "The service",
          body: "Orenew is a desktop application that batch-applies decorative frames to event photos and exports print-ready output, together with this website for marketing, downloads, and subscription management.",
        },
        {
          heading: "Accounts",
          body: "You must provide accurate information when creating an account and are responsible for activity under your account and for keeping your credentials secure. You must be at least 16 years old, or the age of majority in your jurisdiction, to use Orenew.",
        },
        {
          heading: "License to use the app",
          body: "Subject to these terms, we grant you a personal, non-exclusive, non-transferable, revocable license to install and use Orenew on the number of devices permitted by your plan. You may not resell, sublicense, reverse engineer, or attempt to circumvent the app's licensing or device-seat limits, except where such restriction is prohibited by law.",
        },
        {
          heading: "Your photos and content",
          body: "You retain all rights to the photos and content you process with Orenew. The desktop app processes your images locally and treats your source folders as read-only. You are solely responsible for having the rights and any necessary consents to photograph and process the images and the people depicted in them.",
        },
        {
          heading: "Subscriptions and billing",
          body: "Paid plans are sold and billed through Lemon Squeezy, our merchant of record. Plans include a set number of device seats (Pro 1, Studio 5). Subscriptions renew automatically each billing period until cancelled. Prices are shown at checkout and may exclude taxes, which are applied as required.",
        },
        {
          heading: "Cancellation and refunds",
          body: "You can cancel anytime from the billing portal. Your paid tier remains active until the end of the current billing period and then drops to the Free tier. Refunds, where applicable, are handled by Lemon Squeezy through the billing portal.",
        },
        {
          heading: "Free tier",
          body: "The Free tier is available at no cost and applies a watermark to exported and printed output. Free tier access is provided as-is and may change over time.",
        },
        {
          heading: "Acceptable use",
          body: "You agree not to use Orenew for any unlawful purpose, to infringe others' rights, to distribute malware, or to interfere with the operation or security of the service.",
        },
        {
          heading: "Intellectual property",
          body: "Orenew, including the software, website, and brand marks, is owned by us and protected by intellectual property laws. These terms do not transfer any ownership of the software to you.",
        },
        {
          heading: "Disclaimers",
          body: "Orenew is provided \"as is\" and \"as available\" without warranties of any kind, whether express or implied, including fitness for a particular purpose, to the maximum extent permitted by law.",
        },
        {
          heading: "Limitation of liability",
          body: "To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages, or for loss of data or profits, arising from your use of Orenew. Our total liability is limited to the amount you paid us in the twelve months before the claim.",
        },
        {
          heading: "Termination",
          body: "We may suspend or terminate your access if you breach these terms. You may stop using Orenew and delete your account at any time.",
        },
        {
          heading: "Governing law",
          body: "These terms are governed by the laws of the State of Israel, and the competent courts of Israel will have jurisdiction over any dispute, without regard to conflict-of-law rules.",
        },
        {
          heading: "Changes to these terms",
          body: "We may update these terms from time to time. Material changes will be reflected by updating the date at the top of this page; continued use after changes means you accept the updated terms.",
        },
        {
          heading: "Contact us",
          body: "Questions about these terms? Email support@orenew.app.",
        },
      ],
    },
  },
  footer: {
    product: "Product",
    company: "Company",
    legal: "Legal",
    rights: "All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
    blurb: "Batch photo framing for event photographers.",
  },
  auth: {
    signInTitle: "Sign in to Orenew",
    signInSubtitle: "Manage your subscription, devices, and billing.",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    signUp: "Create account",
    or: "or",
    google: "Continue with Google",
    facebook: "Continue with Facebook",
    toggleToSignUp: "New here? Create an account",
    toggleToSignIn: "Already have an account? Sign in",
    working: "Working…",
    checkEmail: "Check your email to confirm your account.",
  },
  account: {
    title: "Account",
    signOut: "Sign out",
    currentPlan: "Current plan",
    renews: "Renews on {date}",
    cancelsOn: "Access until {date}, then Free",
    noSub: "You're on the Free plan.",
    seatsUsed: "{used} of {total} seats in use",
    seatsUsedUncapped: "{used} devices connected",
    manageBilling: "Manage billing & invoices",
    changePlan: "Change plan",
    upgrade: "Upgrade",
    downgrade: "Switch",
    manageDevices: "Manage devices",
    devicesTitle: "Devices",
    devicesSubtitle: "Each device occupies one seat. Disconnect a device to free its seat.",
    lastSeen: "Last seen {date}",
    disconnect: "Disconnect",
    disconnecting: "Disconnecting…",
    noDevices: "No devices are connected yet.",
    back: "Back to account",
    thisCannotBeUndone:
      "That device will drop to Free on its next check-in (within its remaining offline grace it keeps working).",
  },
  admin: {
    title: "Customers",
    subtitle: "Read-only overview of Orenew subscribers.",
    notAuthorized: "You don't have access to this page.",
    colEmail: "Email",
    colTier: "Tier",
    colStatus: "Status",
    colSeats: "Seats",
    colRenewal: "Renewal",
    noCustomers: "No customers yet.",
    totalCustomers: "{count} customers",
  },
  common: {
    loading: "Loading…",
    error: "Something went wrong.",
    retry: "Retry",
  },
} as const;

export type Dictionary = typeof en;
export const dictionary = en;

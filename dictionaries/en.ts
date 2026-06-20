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
    title: "Built for the print table, not the darkroom",
    subtitle:
      "Orenew does one job extremely well: turn a card full of photos into finished, framed output while the line is still moving.",
    items: [
      {
        title: "Batch framing",
        body: "Apply per-event landscape and portrait frame PNGs to an entire batch at once, with centered, aspect-correct crops — never stretched.",
      },
      {
        title: "Print & magnet canvases",
        body: "Tile framed photos onto your own canvas presets — 2-up prints, magnet sheets, custom DPI — and export print-ready JPEGs at 300 DPI.",
      },
      {
        title: "Read-only source",
        body: "Your photographer's folder is never modified. All state lives in Orenew's own store, so a re-import always resumes where you left off.",
      },
      {
        title: "Fast by design",
        body: "Rust + SIMD crop/resize on a bounded thread pool. 100 photos in seconds, with a memory ceiling that won't choke your laptop.",
      },
      {
        title: "Live folder watching",
        body: "Drop new photos mid-event and they appear automatically. Edit a frame PNG and previews refresh instantly.",
      },
      {
        title: "Per-photo control",
        body: "Override orientation, set copies, and review every frame in a full-screen lightbox before you commit a single print.",
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
    videoTitle: "Watch a 90-second walkthrough",
    videoBody: "See a real event go from SD card to print sheet.",
    videoCta: "Play demo",
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

import { Geist, Geist_Mono } from "next/font/google";
import { Orbitron } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Load fonts with custom variables
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

// ✅ Use Next.js Metadata API
export const metadata = {
  title: "Ceylon EduX",
  description: "English learning platform for all grades",
  metadataBase: new URL("https://www.ceylonedux.com"),

  // ✅ Add all favicon variations
  icons: {
    icon: [
      { url: "/new.ico", sizes: "any" },
      { url: "/32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },

  

  // ✅ Google site verification
  verification: {
    google: "aJDS6mEd3OAQJWKgsP35iYzS32lQwFz7J6FrIbDRs78",
  },

  openGraph: {
    type: "website",
    url: "https://www.ceylonedux.com",
    title: "Ceylon EduX",
    description: "English learning platform for all grades",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Ceylon EduX Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ceylon EduX",
    description: "English learning platform for all grades",
    images: ["/logo.jpg"], // same image as OG
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full scroll-smooth bg-background text-foreground"
    >
       <head>
        {/* Favicon links */}
        <link rel="icon" href="/new.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="google-site-verification" content="aJDS6mEd3OAQJWKgsP35iYzS32lQwFz7J6FrIbDRs78" />
      </head>
      

      <body
        className={`h-full w-full bg-background text-foreground ${geistSans.variable} ${orbitron.variable} ${geistMono.variable} antialiased transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col min-h-screen w-full">{children}</div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

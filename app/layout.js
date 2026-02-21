import { Geist, Geist_Mono } from "next/font/google";
import { Orbitron } from "next/font/google";
import "./globals.css";


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


export const metadata = {
  title: "Diyana Bottled Drinking Water Company",
  description: "15 mile post, Raja Mawatha, Buttala",
  //metadataBase: new URL("https://www.diyanawater.com"),


  icons: {
    icon: [
      { url: "/images/new.ico", sizes: "any" },
      { url: "/images/32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/images/16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/images/apple-touch-icon.png",
  },

  
  openGraph: {
    type: "website",
    //url: "https://www.diyanawater.com",
    title: "Diyana Bottled Drinking Water Company",
    description: "15 mile post, Raja Mawatha, Buttala",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Diyana Bottled Drinking Water Company Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diyana Bottled Drinking Water Company",
    description: "15 mile post, Raja Mawatha, Buttala",
    images: ["/images/logo.png"], // same image as OG
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
        <link rel="icon" type="image/png" sizes="32x32" href="/images/32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images//16x16.png" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
  
      </head>
      

      <body
        className={`h-full w-full bg-background text-foreground ${geistSans.variable} ${orbitron.variable} ${geistMono.variable} antialiased transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col min-h-screen w-full">{children}</div>
     
      </body>
    </html>
  );
}

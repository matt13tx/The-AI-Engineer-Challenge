import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matthew's First LLM Application",
  description: "Chat with a supportive mental coach powered by OpenAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

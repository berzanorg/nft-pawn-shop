import { Html, Head, Main, NextScript } from 'next/document'
import { Onest } from 'next/font/google'



export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body className="font-['Onest',sans-serif]">
        <Main />
        <NextScript />
      </body>
    </Html >
  )
}

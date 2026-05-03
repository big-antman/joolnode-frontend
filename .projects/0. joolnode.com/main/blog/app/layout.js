import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
  title: '공부하기 - 줄노드',
  description: '시니어를 위한 앱 개발, 다양한 기술 자료와 학습 콘텐츠를 함께 나눕니다.',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/logo.svg" />
        <link rel="shortcut icon" href="/logo.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body>
        <Header />
        
        <main style={{ minHeight: 'calc(100vh - 240px)' }}>
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}

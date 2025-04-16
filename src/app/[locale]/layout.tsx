
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '../context/AuthContext'; 
import { ReactNode } from 'react'; 

type Props = {
  children: ReactNode; 
  
  params: { locale: string };
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params; 
  

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  let messages: Record<string, string>;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch {
    
    notFound();
  }

  return (
    
    <AuthProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        
        <Header />
        <main className="main-content">{children}</main>
        <Footer />
      </NextIntlClientProvider>
    </AuthProvider>
  );
}

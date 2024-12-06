import { Suspense } from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/src/public/styles/globals.css';
import { DataProvider, FilterProvider } from '../context';

const geistSans = localFont({
  src: '../public/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: '../public/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const tangerineRegular = localFont({
  src: '../public/fonts/Tangerine-Regular.ttf',
  variable: '--font-tangerine-regular',
});

const tangerineBold = localFont({
  src: '../public/fonts/Tangerine-Bold.ttf',
  variable: '--font-tangerine-bold',
});

const publicSans = localFont({
  src: '../public/fonts/PublicSans-VariableFont_wght.ttf',
  variable: '--font-public-sans',
  weight: '100 400 900',
});

const publicSansItalic = localFont({
  src: '../public/fonts/PublicSans-Italic-VariableFont_wght.ttf',
  variable: '--font-public-sans-italic',
  weight: '100 400 900',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <DataProvider>
      <Suspense>
        <FilterProvider>
          <html lang="en">
            <body
              className={`
                ${geistSans.variable}
                ${geistMono.variable}
                ${tangerineRegular.variable}
                ${tangerineBold.variable}
                ${publicSans.variable}
                ${publicSansItalic.variable}
                antialiased
                bg-primary
              `}
            > 
              <div className="h-screen w-screen flex justify-center items-center">
                <div className="bg-white h-[550px] w-[350px] md:w-[450px] md:h-[623px] rounded-[30px] min-w-[367px]">
                  <div className="w-5/6 mx-auto">
                    {children}
                  </div>
                </div>
              </div>
            </body>
          </html>
        </FilterProvider>
      </Suspense>
    </DataProvider>
  );
};

export default RootLayout;

'use client'; 

import Link from 'next/link';
import UserAuthForm from '@/components/forms/user-auth-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation'; 
import { useState , useContext} from 'react';
import { useDataContext } from '@/lib/DataProvider';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_BASE_URL;

export default function AuthenticationPage() {
    const t = useTranslations();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const { setAuthData } = useDataContext();


    const handleLogin = async (email: string, password: string) => {
      try {
        const response = await fetch(
          `${SERVER_API_BASE_URL}/api/pos/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          }
        );
        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.responseMessage || t('loginFailed'));
          return;
        }

        // Check if the user has admin role
        if (data.user.role !== 'admin') {
          setErrorMessage(t('adminOnly'));
          return;
        }

        setAuthData(data.user, data.token);
        console.log("token:",data.token, "user:", data.user)

        // If everything is fine, store token and redirect
        localStorage.setItem('data', JSON.stringify(data));
        router.push('/dashboard'); // Redirect to the dashboard
      } catch (error) {
        setErrorMessage(t('errorOccurred')); // Handle network or server errors
      }
    };

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Login
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Logo
        </div>
        {/* <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div> */}
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
            {t('Login')}
             </h1>
            <p className="text-sm text-muted-foreground">
            {t('loginPrompt')}</p>
          </div>
          <UserAuthForm onSubmit={handleLogin} errorMessage={errorMessage} />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import GithubSignInButton from '../github-auth-button';
import { useTranslations } from 'next-intl';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_BASE_URL;

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});


type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, setLoading] = useState(false);
  const t = useTranslations(); 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [errorMessage, setErrorMessage] = useState('');



  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (e: React.FormEvent) => {
   
    if (!email || !password) {
      setError('Please fill in all fields')
    } else {
      setError('')
      console.log('Login attempted with:', { email, password })
    }
    try {
        const response = await fetch(`${SERVER_API_BASE_URL}/api/pos/login`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.responseMessage || 'Login failed');
        } else {
            console.log('Token:', data.token ,'role:', data.user.role);
            if (data.user.role !== 'admin') {
               
                  return;
              } 
          
          // You can store the token in localStorage or sessionStorage and redirect to another page
          localStorage.setItem('authToken', data.token);
        }
      } catch (error) {
        setErrorMessage('An error occurred. Please try again later.');
      }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Email')}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t('EnterEmail')}
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            {/* שדה סיסמה */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Password')}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t('EnterPassword')}
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <Button disabled={loading} className="ml-auto w-full" type="submit">
            {t('Login')}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
    </>
  );
}

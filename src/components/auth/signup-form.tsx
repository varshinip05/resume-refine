'use client';

import { useFormStatus } from 'react-dom';
import { signup, type AuthState } from '@/app/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useEffect, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

function SignupButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending} suppressHydrationWarning>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Create Account
    </Button>
  );
}

export function SignUpForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(signup, null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state?.message) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: state.message,
      });
    }
    if (state?.success && state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
      router.push('/dashboard');
    }
  }, [state, toast, router]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="John Doe" required suppressHydrationWarning />
        {state?.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john.doe@example.com"
          required
          suppressHydrationWarning
        />
        {state?.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="********"
          required
          suppressHydrationWarning
        />
        {state?.errors?.password && <p className="text-sm font-medium text-destructive">{state.errors.password}</p>}
      </div>
      <SignupButton />
    </form>
  );
}

'use client';

import { useFormStatus } from 'react-dom';
import { login } from '@/app/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Info } from 'lucide-react';
import { useActionState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending} suppressHydrationWarning>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Log In
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(login, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="test@example.com"
          required
          suppressHydrationWarning
        />
        {state?.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
            id="password" 
            name="password" 
            type="password" 
            placeholder="password123" 
            required 
            suppressHydrationWarning
        />
        {state?.errors?.password && <p className="text-sm font-medium text-destructive">{state.errors.password[0]}</p>}
      </div>
      
      {state?.message && <p className="text-sm font-medium text-destructive">{state.message}</p>}

      <LoginButton />

      <Alert className="mt-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Demo Login</AlertTitle>
        <AlertDescription>
          Use email <code className="font-semibold">test@example.com</code> and password <code className="font-semibold">password123</code>.
        </AlertDescription>
      </Alert>
    </form>
  );
}

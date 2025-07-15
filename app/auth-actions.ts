'use server';

import { z } from 'zod';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export type AuthState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
  user?: {
    name: string;
    email: string;
  };
  success?: boolean;
} | null;

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
});

export async function signup(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validatedFields = signupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const client = await clientPromise;
    const db = client.db();

    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return {
        errors: {
          email: ['An account with this email already exists.'],
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
    });

    return {
      success: true,
      user: { name, email },
    };
  } catch (error) {
    console.error(error);
    let errorMessage = 'An unexpected database error occurred.';
    if (error instanceof Error) {
      if (
        error.message.includes('connect ECONNREFUSED') ||
        error.message.includes('querySrv ETIMEOUT')
      ) {
        errorMessage =
          'Could not connect to the database. Please ensure your IP address is whitelisted in MongoDB Atlas and try again.';
      } else if (error.message.includes('Authentication failed')) {
        errorMessage =
          'Database authentication failed. Please check your MONGODB_URI credentials.';
      }
    }
    return {
      message: errorMessage,
    };
  }
}

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export async function login(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return { message: 'Invalid email or password.' };
    }

    const passwordsMatch = await bcrypt.compare(
      password,
      user.password as string
    );

    if (!passwordsMatch) {
      return { message: 'Invalid email or password.' };
    }

    return {
      success: true,
      user: {
        name: user.name as string,
        email: user.email as string,
      },
    };
  } catch (error) {
    console.error(error);
    let errorMessage = 'An unexpected database error occurred.';
    if (error instanceof Error) {
      if (
        error.message.includes('connect ECONNREFUSED') ||
        error.message.includes('querySrv ETIMEOUT')
      ) {
        errorMessage =
          'Could not connect to the database. Please ensure your IP address is whitelisted in MongoDB Atlas and try again.';
      } else if (error.message.includes('Authentication failed')) {
        errorMessage =
          'Database authentication failed. Please check your MONGODB_URI credentials.';
      }
    }
    return {
      message: errorMessage,
    };
  }
}

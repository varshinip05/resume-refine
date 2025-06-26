'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { redirect } from 'next/navigation';

const signupSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' }),
  });

export async function signup(prevState: any, formData: FormData) {
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
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return {
        message: 'User with this email already exists.',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });
  } catch (e) {
    console.error(e);
    let detailedMessage = 'An unknown error occurred';
    if (e instanceof Error) {
      detailedMessage = e.message;
      if (e.message.includes('querySrv ENOTFOUND')) {
        detailedMessage +=
          '\n\nHint: The database hostname seems incorrect. Please double-check your MONGODB_URI in the .env file.';
      } else if (e.message.includes('Authentication failed')) {
        detailedMessage +=
          '\n\nHint: The database username or password in your MONGODB_URI is likely incorrect.';
      } else if (e.message.toLowerCase().includes('timeout')) {
        detailedMessage +=
          '\n\nHint: The connection timed out. This is often caused by an IP address not being whitelisted in MongoDB Atlas Network Access settings. Please ensure your current IP is added.';
      }
    }
    return {
      message: `Database error: ${detailedMessage}. Please check your connection string and IP whitelist.`,
    };
  }

  redirect('/dashboard');
}

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export async function login(prevState: any, formData: FormData) {
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
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return { message: 'Invalid email or password.' };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return { message: 'Invalid email or password.' };
    }

  } catch (e) {
    console.error(e);
    let detailedMessage = 'An unknown error occurred';
    if (e instanceof Error) {
      detailedMessage = e.message;
      if (e.message.includes('querySrv ENOTFOUND')) {
        detailedMessage +=
          '\n\nHint: The database hostname seems incorrect. Please double-check your MONGODB_URI in the .env file.';
      } else if (e.message.includes('Authentication failed')) {
        detailedMessage +=
          '\n\nHint: The database username or password in your MONGODB_URI is likely incorrect.';
      } else if (e.message.toLowerCase().includes('timeout')) {
        detailedMessage +=
          '\n\nHint: The connection timed out. This is often caused by an IP address not being whitelisted in MongoDB Atlas Network Access settings. Please ensure your current IP is added.';
      }
    }
    return {
      message: `Database error: ${detailedMessage}. Please check your connection string and IP whitelist.`,
    };
  }
  
  redirect('/dashboard');
}

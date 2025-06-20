import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { User } from '../../global';
import { cookies } from 'next/headers';

async function fetchUser(username: string, password: string) {
  const fetchedUsers = await axios.get<User[]>("http://localhost:5000/user");
  return fetchedUsers.data.find(user => user.username === username && user.password === password);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  const authUser = await fetchUser(username, password);

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not defined in env');
  }

  if (authUser) {
    const token = jwt.sign({ id: authUser.id }, process.env.JWT_SECRET, { expiresIn: 3600 });

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
      secure: process.env.NODE_ENV === 'production',
    });

    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false }, { status: 401 });
}

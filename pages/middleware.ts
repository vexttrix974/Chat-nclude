import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as dotenv from 'dotenv';

dotenv.config();

const jwt = require('jsonwebtoken');

export default function middleware(request: NextRequest) {
  const Authetificator = sessionStorage.getItem('token');
  if (request.nextUrl.pathname.startsWith('/api/messages') && Authetificator !== undefined) {
    console.log(Authetificator);  
    try {
      const decoded = jwt.verify(Authetificator, process.env.JWT_SIGN_SECRET);
      console.log(decoded);
      console.log('Connexion réussi'); // VALID TOKEN
    } catch (err) {
      // res.sendStatus(403); // BAD TOKEN
    }

    return NextResponse.rewrite(new URL('/api/messages', request.url));
  }
  if (request.nextUrl.pathname.startsWith('/api/messages') && bool === false) {
    return NextResponse.rewrite((new URL('/error', request.url)));
  }
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/dashboard/user', request.url));
  }
}

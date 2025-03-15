import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private jwtService: JwtService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  async signup(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password: hashedPassword,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return { message: 'Signup successful. Please verify your email!' };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ email });
    return { access_token: token };
  }
}

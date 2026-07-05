import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// URL이 정상적인 형태(http로 시작)인지 확인
const isValidUrl = supabaseUrl.startsWith('http');

export const supabase = isValidUrl ? createClient(supabaseUrl, supabaseAnonKey) : null;

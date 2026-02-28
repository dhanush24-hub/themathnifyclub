import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      full_name,
      roll_number,
      department,
      year,
      phone,
      why_join,
      preferred_department,
    } = body;

    if (!full_name || !roll_number || !department || !year || !phone || !why_join || !preferred_department) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('join_applications').insert({
      full_name,
      roll_number,
      department,
      year,
      phone,
      why_join,
      preferred_department,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

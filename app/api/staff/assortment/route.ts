import { NextResponse } from 'next/server';
import { saveEnabledItemKeys } from '@/lib/catalog-store';
import { isStaffAuthenticated } from '@/lib/staff-auth';

export async function PUT(request: Request) {
  if (!(await isStaffAuthenticated())) {
    return NextResponse.json({ error: 'A munkamenet lejárt.' }, { status: 401 });
  }
  const body = await request.json().catch(() => null) as { enabledKeys?: unknown } | null;
  if (!Array.isArray(body?.enabledKeys) || !body.enabledKeys.every((key) => typeof key === 'string')) {
    return NextResponse.json({ error: 'Érvénytelen portékalista.' }, { status: 400 });
  }
  try {
    const enabledKeys = await saveEnabledItemKeys(body.enabledKeys as string[]);
    return NextResponse.json({ ok: true, enabledKeys });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'A portékalista mentése nem sikerült.' }, { status: 500 });
  }
}


import { allCatalogItems, itemKey } from '@/app/catalog-data';
import { getEnabledItemKeys } from '@/lib/catalog-store';
import { isStaffAuthenticated } from '@/lib/staff-auth';
import StaffLogin from './StaffLogin';
import StaffPanel from './StaffPanel';
import './staff.css';

export const dynamic = 'force-dynamic';

export default async function StaffPage() {
  if (!(await isStaffAuthenticated())) return <StaffLogin />;
  const enabledKeys = await getEnabledItemKeys();
  const entries = allCatalogItems.map((item) => ({
    key: itemKey(item.name),
    name: item.name,
    category: item.category,
    price: item.price,
  }));
  return <StaffPanel entries={entries} initialEnabledKeys={enabledKeys} />;
}


//src/app/page/tsx
import { redirect } from 'next/navigation';

export default function Page(): never {
  redirect('/dashboard');
}

import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { cn } from '@/lib/utils';
import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky inset-x-0 top-0 w-full">
      <nav className="flex items-center justify-between px-4 py-2 md:justify-end">
        <div className={cn('block lg:!hidden')}>
          <MobileSidebar />
        </div>
        <div className="flex items-center gap-2">
          <UserNav />
          <div className="justify-self" >
          <Image src="/shopanda_logo.png" alt="Logo" width={120} height={120} />
          </div>
          {/*<ThemeToggle />*/}
        </div>
      </nav>
    </header>
  );
}

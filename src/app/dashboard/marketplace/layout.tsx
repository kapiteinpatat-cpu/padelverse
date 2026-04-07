import type { ReactNode } from 'react';

export default function MarketplaceLayout({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

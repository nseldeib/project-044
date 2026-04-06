'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Settings, Plane, Bike, Train, Activity } from 'lucide-react';
import { useClock } from '@/app/hooks/useClock';
import { useAlertCount } from '@/app/hooks/useAlertCount';

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navLinks: NavLink[] = [
  { label: 'Dashboard', href: '/', icon: <Activity size={14} /> },
  { label: 'Air Traffic', href: '/air', icon: <Plane size={14} /> },
  { label: 'City Bikes', href: '/bikes', icon: <Bike size={14} /> },
  { label: 'Subway', href: '/transit', icon: <Train size={14} /> },
  { label: 'Watchlist', href: '/watchlist', icon: <Bell size={14} /> },
];

export function Navbar() {
  const pathname = usePathname();
  const clock = useClock();
  const { unreadCount } = useAlertCount();

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '56px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: 'var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--spacing-6)',
        gap: 'var(--spacing-8)',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-weight-bold)',
            letterSpacing: 'var(--tracking-widest)',
            color: 'var(--accent-amber)',
            lineHeight: 1,
          }}
        >
          VECTOR
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-2xs)',
            fontWeight: 'var(--font-weight-normal)',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--text-muted)',
            lineHeight: 1,
          }}
        >
          MOVEMENT INTELLIGENCE
        </span>
      </Link>

      {/* Nav Links */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-1)',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {navLinks.map((link) => {
          const isActive =
            pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                color: isActive ? 'var(--accent-amber)' : 'var(--text-secondary)',
                borderBottom: isActive ? '2px solid var(--accent-amber)' : '2px solid transparent',
                transition: 'color var(--transition-fast)',
              }}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--accent-green)',
              display: 'block',
              boxShadow: '0 0 6px var(--accent-green)',
              animation: 'pulse 2s infinite',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-2xs)',
              color: 'var(--accent-green)',
              letterSpacing: 'var(--tracking-wider)',
            }}
          >
            LIVE DATA
          </span>
        </div>

        {/* Clock */}
        {clock && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              letterSpacing: 'var(--tracking-wide)',
              minWidth: '80px',
              textAlign: 'right',
            }}
          >
            {clock}
          </span>
        )}

        {/* Alert Badge */}
        <Link
          href="/watchlist"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            padding: 'var(--spacing-2)',
            borderRadius: 'var(--radius-md)',
            transition: 'color var(--transition-fast)',
          }}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                minWidth: '16px',
                height: '16px',
                backgroundColor: 'var(--accent-amber)',
                color: 'var(--text-inverse)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-2xs)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 'var(--font-weight-bold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 3px',
                lineHeight: 1,
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>

        {/* Settings */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 'var(--spacing-2)',
            borderRadius: 'var(--radius-md)',
            transition: 'color var(--transition-fast)',
          }}
        >
          <Settings size={18} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

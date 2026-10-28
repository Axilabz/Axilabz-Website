'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { CalendarCheck, X } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { track } from '@/lib/analytics';

const subscribeScroll = (cb: () => void) => {
  window.addEventListener('scroll', cb, { passive: true });
  return () => window.removeEventListener('scroll', cb);
};

/**
 * Mobile-only floating action button. It appears once the visitor starts scrolling, shows just an icon,
 * and opens the enquiry form in a modal dialog on the same page. Hidden on /contact (the form is already there).
 */
export function FloatingConsult() {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 240, () => false);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => dialogRef.current?.close(), []);

  function openForm() {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
    dialogRef.current?.showModal();
    document.body.style.overflow = 'hidden';
    track('cta_click', { location: 'floating-button', label: 'book-consultation' });
  }

  // `close` fires for the Close button, Escape and backdrop clicks alike.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => {
      setOpen(false);
      document.body.style.overflow = '';
      returnFocus.current?.focus();
    };
    d.addEventListener('close', onClose);
    return () => d.removeEventListener('close', onClose);
  }, []);

  // Leaving the page (or unmounting) must never leave scrolling locked.
  useEffect(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
    return () => { document.body.style.overflow = ''; };
  }, [pathname]);

  if (pathname === '/contact') return null;

  return (
    <>
      <button
        type="button"
        className={`fab${scrolled ? ' is-visible' : ''}`}
        aria-label="Book a Free Strategy Call"
        aria-haspopup="dialog"
        tabIndex={scrolled ? 0 : -1}
        onClick={openForm}
      >
        <CalendarCheck aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        className="fab-dialog"
        aria-labelledby="fab-dialog-title"
        onClick={(e) => { if (e.target === dialogRef.current) close(); }}
      >
        <div className="fab-dialog-head">
          <h2 id="fab-dialog-title">Book a Free Strategy Call</h2>
          <button type="button" className="fab-close" aria-label="Close form" onClick={close}><X aria-hidden="true" /></button>
        </div>
        <p className="fab-dialog-intro">Tell us what you are working on. We will reply with practical next steps.</p>
        {open && <ContactForm initialInterest="general" />}
      </dialog>
    </>
  );
}

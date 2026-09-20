"use client";

import { useEffect, useState } from "react";

const whatsappUrl = "https://wa.me/255761575951?text=Hello%21%20I%27m%20interested%20in%20booking%20a%20safari.%20Can%20you%20help%20me%3F";

export function WhatsAppChatWidget() {
  const [messageMounted, setMessageMounted] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);

  useEffect(() => {
    const revealTimer = window.setTimeout(() => {
      setMessageMounted(true);
      window.requestAnimationFrame(() => setMessageVisible(true));
    }, 800);
    const hideTimer = window.setTimeout(() => setMessageVisible(false), 7800);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      {messageMounted ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className={`rounded-full bg-black px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 ${messageVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"}`}
        >
          💬 Chat with us
        </a>
      ) : null}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Golden Trips Tanzania on WhatsApp"
        className="grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_8px_24px_rgba(37,211,102,.38)] transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25d366] md:size-[60px] animate-[whatsapp-button-pulse_2.6s_ease-out_infinite]"
      >
        <span aria-hidden="true">
          <svg viewBox="0 0 32 32" className="size-8 md:size-9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M16 3a13 13 0 0 0-11.1 19.78L3 29l6.4-1.68A13 13 0 1 0 16 3Zm0 23.65a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.8 1 1.02-3.7-.25-.4A10.65 10.65 0 1 1 16 26.65Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.3-.11-.52-.16-.74.16-.22.33-.85 1.04-1.04 1.25-.2.22-.4.24-.73.08a8.7 8.7 0 0 1-2.56-1.58 9.64 9.64 0 0 1-1.78-2.22c-.19-.32-.02-.5.14-.66.15-.15.33-.4.49-.6.16-.19.22-.32.33-.54.1-.21.05-.4-.03-.56-.08-.16-.74-1.78-1.01-2.44-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.4-.3.33-1.14 1.12-1.14 2.73s1.17 3.17 1.33 3.39c.16.21 2.3 3.5 5.56 4.91.78.34 1.38.54 1.86.69.78.25 1.5.21 2.06.13.63-.1 1.9-.78 2.17-1.53.27-.76.27-1.4.19-1.53-.08-.14-.3-.22-.62-.38Z" />
          </svg>
        </span>
      </a>
    </div>
  );
}

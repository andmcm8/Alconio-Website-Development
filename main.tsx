import React from 'react';
import { createRoot } from 'react-dom/client';
import { StarButton } from '@/components/ui/star-button';

function mountComponent(id: string, children: React.ReactNode) {
  const container = document.getElementById(id);
  if (container) {
    const root = createRoot(container);
    root.render(children);
  }
}

mountComponent('star-button-root', (
  <a href="get-started.html">
    <StarButton className="px-10 py-5 h-auto text-lg rounded-xl">
      Book Consultation
    </StarButton>
  </a>
));

mountComponent('about-cta-root', (
    <a href="get-started.html">
        <StarButton className="px-10 py-5 h-auto text-lg rounded-xl">
            Book Consultation
        </StarButton>
    </a>
));

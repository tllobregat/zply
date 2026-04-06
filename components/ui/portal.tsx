'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  containerId?: string;
}

export function Portal({ children, containerId = 'portal-root' }: PortalProps): React.ReactNode {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    let targetContainer: HTMLElement | null = document.getElementById(containerId);
    
    if (!targetContainer) {
      targetContainer = document.createElement('div');
      targetContainer.id = containerId;
      document.body.appendChild(targetContainer);
    }
    
    setContainer(targetContainer);
  }, [containerId]);

  if (!container) {
    return null;
  }

  return createPortal(children, container);
}

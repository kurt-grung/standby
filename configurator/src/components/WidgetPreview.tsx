import { X } from 'lucide-react';
import { useState } from 'react';

import { StandByPreview } from '../preview/StandByPreview';
import { nightMode } from '../lib/standByWidgetShape';
import { GlassIconButton } from './GlassIconButton';
import './WidgetPreview.css';

export function WidgetPreview() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="preview-trigger" onClick={() => setOpen(true)}>
        Preview
      </button>

      {open ? (
        <div className="preview-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="preview-modal"
            role="dialog"
            aria-modal="true"
            aria-label="StandBy preview"
            style={{ backgroundColor: nightMode.bg }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="preview-modal__close-wrap">
              <GlassIconButton
                icon={X}
                accessibilityLabel="Close StandBy preview"
                onPress={() => setOpen(false)}
              />
            </div>

            <StandByPreview />
          </div>
        </div>
      ) : null}
    </>
  );
}

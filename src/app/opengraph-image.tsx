import { ImageResponse } from 'next/og';

import { site } from '@/config/site';

/**
 * The card every shared link shows.
 *
 * Generated rather than kept as a static PNG, because the copy on it is the
 * copy in `config/site.ts` — a hand-made image would be one more place the
 * tagline has to be kept in step, and the one place nobody would look.
 *
 * **No orbs here, and that is not a style choice.** Satori is not a browser: it
 * does not interpolate a radial gradient's alpha, so every attempt at the app's
 * orb field — inside its box, then sized past the canvas — came out as a flat
 * disc with a hard rim. Linear gradients it renders perfectly. So the brand
 * palette arrives on this card the way it arrives on a button in the app: as
 * `AmbientGradient`, run in a line. Restating the same five stops rather than
 * approximating the backdrop is the closer likeness anyway.
 */
export const alt = `${site.name}: build a daily Christian routine of Bible reading, prayer and reflection.`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          /*
           * The splash colour, tinted diagonally toward the orb palette so the
           * card is not a flat panel. Indigo at the top-left where the wordmark
           * sits, through the splash colour behind the headline, to a trace of
           * jade in the far corner.
           */
          background:
            'linear-gradient(135deg, #23264F 0%, #2A1B3D 26%, #151222 52%, #121019 74%, #12241D 100%)',
          padding: 80,
          position: 'relative'
        }}
      >
        {/* The five brand stops as a hairline along the top edge — the whole
            palette present, at a size where it reads as a signature rather than
            as decoration. */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 6,
            background:
              'linear-gradient(90deg, #5B72EF 0%, #E36FD2 22%, #7BD44B 55%, #3FBF7F 76%, #F0A05A 100%)'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* The five brand stops, worn as a bar — the one place on the card
              where all of them belong at once. */}
          <div
            style={{
              width: 20,
              height: 72,
              borderRadius: 999,
              background: 'linear-gradient(180deg, #5B72EF, #E36FD2 40%, #7BD44B 70%, #F0A05A)'
            }}
          />
          <div style={{ fontSize: 40, fontWeight: 700, color: '#ffffff', letterSpacing: -1 }}>{site.name}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 940
            }}
          >
            A daily rhythm of study, reflection and prayer.
          </div>
          {/* Two lines, because the card was doing only half its job.
              The headline says what the app feels like; nothing on it said what
              it was *for*. A stranger meeting this card in a timeline had to
              infer the category from the word "prayer" in a sentence. The first
              line now names it outright, and the second keeps the claim that
              actually separates this from the rest of the category. */}
          <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 32, color: '#ffffff', letterSpacing: -0.5 }}>
              Build a daily Christian routine
            </div>
            <div style={{ marginTop: 12, fontSize: 26, color: '#B0B4BA', letterSpacing: -0.3 }}>
              No advertising · No tracking · No feed
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}

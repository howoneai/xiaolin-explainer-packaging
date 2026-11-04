// Visual theme for backgrounds, title cards, foreground bokeh and panels.
// Select in project.json:  "theme": "finance" | "tech" | "plain"
//   or  "theme": {"name": "tech", "pal": {"coral": "#e5533d"}, "dark": "<css background>"}
import D from './data/shots.json';

const PAL_TECH = {teal: '#2f7f7a', steel: '#3b5b8c', coral: '#c8574d', lime: '#d9e47e', slate: '#252c3b', cream: '#f2e6b8', gray: '#9aa4b4'};
const PANEL_PURPLE = 'linear-gradient(170deg,#57397f 0%,#432c69 45%,#33224f 100%)';
const DARK_WARM = 'radial-gradient(ellipse at 50% 45%, #29272f 0%, #1b1a20 60%, #141318 100%)';

const PRESETS: Record<string, any> = {
  // her finance episodes: muted geometric blocks, ¥ banknotes, coins, hand-drawn sun / hourglass / old man
  finance: {dark: DARK_WARM, deco: 'finance', fg: 'finance', title: 'finance', grid: false, glyph: '¥', panel: PANEL_PURPLE},
  // AI / software / internet topics. Rendered 3D plates (frosted glass keycaps, glass bubbles, cables,
  // shallow depth of field) + drifting light + dust. Plates ship in public/plates/; a project can add its own
  // title plate with bg.plate='plates/<file>.jpg'.
  tech: {
    dark: '#06070a', deco: 'none', fg: 'none', title: 'tech', grid: false, glyph: '>', card: 'glass',
    panel: 'linear-gradient(170deg,rgba(54,66,108,.88) 0%,rgba(36,46,82,.9) 50%,rgba(22,28,54,.92) 100%)',
    plates: ['plates/tech_dark_a.jpg', 'plates/tech_dark_b.jpg', 'plates/tech_dark_c.jpg', 'plates/tech_dark_d.jpg'],
    titlePlate: 'plates/tech_title.jpg', paperPlate: 'plates/tech_paper.jpg', endPlate: 'plates/tech_title.jpg', end: 'dark',
  },
  // the first tech attempt: flat vector terminal windows / bubbles / keycaps on a dot grid (reads as clip-art; kept as a fallback)
  'tech-flat': {
    dark: 'radial-gradient(ellipse at 50% 42%, #242834 0%, #171a22 58%, #0f1116 100%)',
    deco: 'tech', fg: 'tech', title: 'tech', grid: true, glyph: '>',
    panel: 'linear-gradient(170deg,#34436a 0%,#283556 45%,#1d2742 100%)',
  },
  // any topic: no props at all, only gradient + grain
  plain: {dark: DARK_WARM, deco: 'none', fg: 'none', title: 'plain', grid: false, glyph: '·', panel: PANEL_PURPLE},
};

const RAW: any = (D as any).theme ?? 'finance';
const NAME: string = typeof RAW === 'string' ? RAW : RAW.name ?? 'finance';
const OPTS: any = typeof RAW === 'string' ? {} : RAW;
const BASE = PRESETS[NAME] ?? PRESETS.finance;
export const TH: any = {...BASE, ...OPTS, name: NAME, pal: {...PAL_TECH, ...(OPTS.pal ?? {})}};

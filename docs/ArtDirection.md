# ART DIRECTION & SOUND DESIGN SPECIFICATION
## LIFE LINES – THE 24-HOUR PUZZLE

---

### 1. Visual Philosophy: Modern Intellectual Noir
*LIFE LINES* adopts a refined, cinematic aesthetic tailored for an adult audience. The visual direction balances the clean structure of an executive dashboard with the dramatic warmth and tension of a psychological mystery.

- **No Childish Cartoons**: No exaggerated bobbleheads, cartoon coins, or bright candy colors.
- **Understated Elegance**: Deep oceanic navies, muted charcoal slates, brushed warm golds, and crisp typography.
- **Glassmorphism & Layering**: Panels feature subtle alpha-blended fills with delicate border highlights, creating a tactile sense of depth.

---

### 2. Color Palette Specification

| Token | Hex Value | Decimal Value | Functional Role |
| :--- | :--- | :--- | :--- |
| `bgDarkest` | `#070a12` | `0x070a12` | Deep void background |
| `bgDark` | `#0d1322` | `0x0d1322` | Canvas secondary background |
| `bgCard` | `#141c2e` | `0x141c2e` | Interactive card and panel fill |
| `bgElevated` | `#273550` | `0x273550` | Elevated hover states |
| `gold` | `#c9a84c` | `0xc9a84c` | Brand accent, primary badges, triumph |
| `goldDim` | `#8a7232` | `0x8a7232` | Subtle framing and inactive borders |
| `time` | `#38bdf8` | `0x38bdf8` | Chronological / time tracking elements |
| `energy` | `#10b981` | `0x10b981` | Vitality, health, recovery |
| `money` | `#eab308` | `0xeab308` | Financial capital, currency figures |
| `stress` | `#ef4444` | `0xef4444` | Psychological strain, critical alerts |
| `relationships` | `#ec4899` | `0xec4899` | Social trust, empathy, rapport |

---

### 3. Typography Hierarchy
Typography is delivered via Google Fonts:
- **Display & Headings**: `Crimson Pro` (Classic, serif, dignified literature feel).
- **Interface & Body**: `Inter` (Clean, highly legible, modern sans-serif).
- **Data & Timestamps**: `JetBrains Mono` (Technical precision, forensic feel).

---

### 4. Procedural Audio Architecture (Web Audio API)
To ensure complete independence from copyrighted audio assets and zero external latency, *LIFE LINES* features a custom Web Audio procedural sound synthesizer:

1. **Ambient Soundscapes**:
   - Continuous harmonic drones synthesized using layered sine and triangle wave oscillators.
   - Low-frequency modulation (LFOs) at 0.1–0.2 Hz generates subtle, shifting organic movement.
   - Distinct atmospheric moods: *Investigation* (deep 55 Hz A1 root), *Tension* (65.4 Hz C2), and *Melancholy* (73.4 Hz D2).

2. **Tactile Interaction SFX**:
   - `playClick()`: Fast frequency drop (1200 Hz to 400 Hz in 40 ms) simulating a mechanical switch.
   - `playCardSnap()`: Triangle wave thump simulating a firm document placement.
   - `playClueFound()`: Four-tone ascending crystalline arpeggio in C Major ($C_5, E_5, G_5, C_6$).
   - `playDecisionImpact()`: Sub-bass resonance (90 Hz down to 45 Hz) coupled with a rich minor chord.
   - `playError()`: Dissonant dual-sawtooth pulses indicating scheduling friction or illegal placement.

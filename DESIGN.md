---
name: Technical Support System
colors:
  surface: '#fbf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fbf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f4'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e3'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45474c'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#1e1200'
  on-tertiary: '#ffffff'
  tertiary-container: '#35260c'
  on-tertiary-container: '#a38c6a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#fadfb8'
  tertiary-fixed-dim: '#ddc39d'
  on-tertiary-fixed: '#271902'
  on-tertiary-fixed-variant: '#564427'
  background: '#fbf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e3'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  badge:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 12px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  container-padding: 24px
  gutter: 16px
  sidebar-width: 260px
  card-gap: 20px
---

## Brand & Style

This design system is engineered for high-efficiency technical environments where clarity and rapid information processing are paramount. The aesthetic follows a **Corporate / Modern** style, emphasizing reliability, precision, and a "low cognitive load" interface. 

The target audience consists of support engineers and system administrators who require a stable, predictable environment to manage complex ticket flows. The UI evokes a sense of calm authority through a structured grid, ample whitespace, and a sophisticated monochromatic base punctuated by high-contrast semantic alerts. The language of the interface is Portuguese (Brazil), ensuring localized accessibility for technical teams in the region.

## Colors

The palette is anchored by **Deep Navy Blue (#1E293B)**, used for primary navigation and high-level headers to establish hierarchy and professional tone. The background utilizes **Slate Grays (#F8FAFC)** to reduce eye strain during long shifts, with **#E2E8F0** serving as the standard for subtle borders and structural divisions.

Semantic colors are strictly reserved for status indicators and urgency levels:
- **Crítico (Red):** Immediate action required.
- **Alta (Amber):** High priority, needs attention soon.
- **Informação (Blue):** General updates or low-priority tasks.
- **Concluído (Green):** Successfully resolved states.

## Typography

The design system utilizes **Inter** for its exceptional legibility on digital displays and its neutral, systematic character. The typographic scale is optimized for data density without sacrificing readability.

- **Headlines:** Used for page titles and card sections to provide a clear entry point for the eye.
- **Body:** Standardized at 14px and 16px for ticket descriptions and logs to ensure high information density.
- **Labels:** Small, uppercase labels are used for metadata headers (e.g., "DATA DE CRIAÇÃO", "ATRIBUÍDO A") to distinguish them from user-generated content.
- **Localized Nuance:** Ensure that text containers account for the slightly longer average word length in Portuguese compared to English.

## Layout & Spacing

The layout employs a **Fixed Grid** philosophy for the sidebar and a **Fluid Grid** for the main content area. This ensures the dashboard feels grounded while maximizing the workspace for data tables and ticket views.

- **Sidebar:** A fixed 260px column on the left containing the primary navigation and workspace filters.
- **Grid:** A 12-column system for the main stage. Cards typically span 3 columns for metrics, 6 columns for secondary lists, and 12 columns for primary data tables.
- **Rhythm:** An 8px base grid governs all padding and margins. 24px is the standard margin for main containers, while 16px (gutter) separates internal card elements.
- **Responsiveness:** On tablet devices, the sidebar collapses into a hamburger menu, and 12-column cards stack vertically to maintain legibility.

## Elevation & Depth

To maintain a clean, professional aesthetic, this design system avoids heavy shadows, instead utilizing **Tonal Layers** and **Low-Contrast Outlines**.

- **Level 0 (Background):** The canvas color (#F8FAFC).
- **Level 1 (Cards/Sidebar):** Pure white (#FFFFFF) surfaces with a 1px solid border in Slate-200 (#E2E8F0). No shadow.
- **Level 2 (Dropdowns/Modals):** Pure white with a subtle, highly diffused ambient shadow (0px 4px 12px rgba(30, 41, 59, 0.08)) and a border.

This approach creates a "flat-plus" look where depth is suggested by the contrast between the off-white background and the stark white surfaces of active components.

## Shapes

The shape language is **Soft (Level 1)**. This subtle rounding of corners (4px for standard elements, 8px for cards) softens the technical nature of the dashboard without appearing overly consumer-oriented or "bubbly."

- **Standard Buttons & Inputs:** 4px radius.
- **Cards & Large Containers:** 8px radius.
- **Status Badges:** 12px (fully rounded/pill) to distinguish them from structural elements and interactive buttons.

## Components

### Buttons
- **Primary:** Deep Navy (#1E293B) background with white text.
- **Secondary:** Transparent background with a Slate-200 border and Navy text.
- **Ghost:** No border or background, used for secondary actions like "Cancelar".

### Status Badges (Crachás)
- Pill-shaped with a light background tint (10% opacity) of the semantic color and a dark text version of the same color for high legibility (e.g., "Crítico" has a light red background and dark red text).

### Cards (Cartões)
- The fundamental unit of the dashboard. Every card must have a 1px border (#E2E8F0), no shadow, and a consistent 20px internal padding. Headers within cards should have a subtle bottom border.

### Input Fields
- Use a white background, Slate-200 border, and a 2px Navy Blue focus ring. Placeholders should be Slate-400.

### Sidebar Navigation
- Icons should be line-art style (20px) with a 12px gap between the icon and the label. The active state is indicated by a background tint of Slate-100 and a 4px Navy Blue vertical bar on the left edge.

### Data Tables (Tabelas de Dados)
- Clean, no vertical lines. Use horizontal Slate-100 dividers. Header cells use the `label-caps` typography style.
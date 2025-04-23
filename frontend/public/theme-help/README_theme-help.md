# Theme Help Tooltip Assets

This folder contains preview images or GIFs used as tooltips in the Theme Editor UI.

Each asset corresponds to a theme key and visually illustrates the part of the application affected by that variable. These previews are referenced in the editor under `/theme-help/{key}.(png|gif)`.

## Required Assets

| Theme Key       | Description                              | Filename(s)            | Status   |
|----------------|------------------------------------------|------------------------|----------|
| `background`    | Main app/chat background                 | `background.png/gif`   | Missing  |
| `text`          | Default text (chat/messages/etc.)        | `text.png/gif`         | Missing  |
| `sidebar_bg`    | Sidebar background                       | `sidebar_bg.png/gif`   | Missing  |
| `sidebar_text`  | Sidebar links and channel names          | `sidebar_text.png/gif` | Missing  |
| `accent`        | Accent elements like buttons/links       | `accent.png/gif`       | Missing  |

## Optional/Future Additions

| Theme Key         | Description                                | Filename(s)                | Status   |
|------------------|--------------------------------------------|----------------------------|----------|
| `mention`         | Highlight for @mentions                    | `mention.png/gif`          | Missing  |
| `header_bg`       | Header background                         | `header_bg.png/gif`        | Missing  |
| `header_text`     | Header text color                         | `header_text.png/gif`      | Missing  |
| `button_primary`  | Primary button background                 | `button_primary.png/gif`   | Missing  |
| `button_text`     | Button text color                         | `button_text.png/gif`      | Missing  |
| `input_bg`        | Input field background                    | `input_bg.png/gif`         | Missing  |
| `input_border`    | Input field border color                  | `input_border.png/gif`     | Missing  |

## Format Guidelines
- Use **PNG** for static previews.
- Use **GIF** for animated examples (e.g. dynamic color transitions, interactive elements).
- Max width: **140px**
- Transparent or neutral backgrounds preferred
- Naming must match the theme key exactly (e.g. `accent.png`, `accent.gif`)

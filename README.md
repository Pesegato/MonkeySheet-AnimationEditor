# 🎬 MonkeySheet Animation Editor

A WYSIWYG animation editor for creating sprite sheet animations compatible with [MonkeySheet](https://github.com/Pesegato/MonkeySheet) spritesheet library for jMonkeyEngine.

## Features

✨ **Easy Frame Management**
- Drag-and-drop image upload
- Frame duration control (in milliseconds)
- Visual frame list with thumbnails
- Quick frame removal

🎥 **Live Animation Preview**
- Real-time animation playback with frame-accurate preview
- Play/Pause/Step frame controls
- FPS and duration statistics

⚙️ **Animation Configuration**
- Set animation ID and name
- Define center point (`centerX`, `centerY`)
- View frame sequence and durations

📤 **JSON Export**
- Download as `.json` file or copy to clipboard
- Output structured for MonkeySheet use cases

## Quick Start

### Prerequisites
- Node.js 16+
- npm

### Installation

```bash
git clone https://github.com/Pesegato/MonkeySheet-AnimationEditor.git
cd MonkeySheet-AnimationEditor
npm install
```

### Run the app

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```bash
http://localhost:5173
```

## Usage Guide

### 1. Load Frames

1. Drag images into the upload area or click to select files.
2. Add one or more PNG/JPG images.
3. They will appear in the left panel as frames.

### 2. Configure Frame Timing

For each frame:
- Set the duration in milliseconds.
- Click a frame to select it.
- Use the remove button to delete it.

### 3. Preview Animation

In the center panel:
- Press Play to loop the animation.
- Use Prev/Next to manually step through frames.
- The preview shows the current frame and total timing.

### 4. Set Animation Properties

In the right panel:
- `Animation ID`: identifier like `idle`, `walk`, `jump`
- `Animation Name`: a human-friendly name
- `Center X` / `Center Y`: pivot point used by MonkeySheet-style sprite positioning

### 5. Export JSON

Click **Download JSON** or **Copy JSON**.

The editor exports a structure like this:

```json
{
  "containerName": "MyCharacter",
  "containerSize": 4,
  "animations": [
    {
      "id": "idle",
      "name": "Idle",
      "frames": [100, 100, 100, 100],
      "centerX": 16,
      "centerY": 24
    }
  ]
}
```

## MonkeySheet Compatibility

The repository used as a reference is:

https://github.com/Pesegato/MonkeySheet/tree/master

The editor is designed around the animation concept used by that library:
- container metadata (`containerName`, `containerSize`)
- animation `id`
- sequence of `frames`
- `centerX` / `centerY` values

This lets you generate animation data in a structure that is easy to consume from a MonkeySheet-based project.

## Project Structure

```text
src/
  components/
    FrameLoader.tsx
    FrameList.tsx
    AnimationPreview.tsx
    AnimationConfig.tsx
    ExportPanel.tsx
  App.tsx
  App.css
  types.ts
  main.tsx
```

## Development Commands

```bash
npm run dev
npm run build
npm run preview
```

## Notes

This project is intentionally a lightweight editor focused on authoring animation metadata and previewing frame sequences. It is designed to help create animation definitions that are easy to integrate into a jMonkeyEngine + MonkeySheet workflow.

## Related Links

- MonkeySheet: https://github.com/Pesegato/MonkeySheet
- MonkeySheet workflow docs: https://pesegato.gitbook.io/monkeysheet-workflow/

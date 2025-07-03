# WebGL and Terminal System Documentation

## Overview

This portfolio project features a sophisticated 3D WebGL scene with an integrated terminal interface that simulates a retro computer experience. The system consists of two main components:

1. **WebGL System** - A Three.js-based 3D scene featuring a vintage computer with a functional screen
2. **Terminal System** - A bash-like terminal interface with file system navigation and command execution

## Architecture Flow

```
App.tsx
    ↓
WebGL() [index.ts]
    ↓
loadAssists() [loader.ts] → Assets Loading
    ↓
Screen() [screen/index.ts]
    ├── ScreenRenderEngine() [screen/renderEngine.ts]
    ├── ScreenTextEngine() [screen/textEngine.ts]
    └── Terminal() [terminal/index.ts]
        └── Bash() [terminal/bash.ts]
            └── Applications() [terminal/applications/]
```

---

## WebGL System (`src/webgl/`)

### Main WebGL Controller (`index.ts`)

**Purpose**: Main WebGL scene orchestrator that manages the 3D environment, camera controls, and animation loop.

**Key Features**:
- **Scroll-based Camera Animation**: Camera moves based on page scroll position
- **Mouse/Touch Parallax**: Interactive camera movement following mouse/touch input
- **Responsive Design**: Adapts to different screen sizes and orientations
- **Performance Monitoring**: Integrated Stats.js for debugging (accessible via `#debug` hash)

**Key Functions**:
- `valMap()`: Utility function for mapping values between ranges
- `WebGL()`: Main initialization function that sets up the entire 3D scene

**Animation Loop**:
```typescript
const tick = () => {
  // Update delta time and elapsed time
  // Apply scroll-based transformations
  // Update camera position with parallax
  // Render screen content
  // Continue animation loop
}
```

### Asset Loader (`loader.ts`)

**Purpose**: Asynchronous loading of all 3D assets, textures, and fonts with progress tracking.

**Assets Loaded**:
- **3D Models**: Commodore computer model (`.glb` format)
- **Textures**: Baked lighting textures for computer and floor
- **Fonts**: Public Pixel and Chill fonts for terminal text
- **Environment Map**: Cube texture for reflections

**Loading Process**:
1. Create LoadingManager with progress callbacks
2. Load fonts, textures, and 3D models in parallel
3. Update loading UI with progress
4. Execute callback when all assets are loaded

### Screen System (`screen/`)

#### Screen Controller (`screen/index.ts`)
**Purpose**: Coordinates the screen's rendering engine and text engine.

**Components**:
- Creates render-to-texture scene
- Initializes text engine for terminal display
- Initializes render engine for post-processing effects
- Connects terminal system to text engine

#### Render Engine (`screen/renderEngine.ts`)
**Purpose**: Handles the screen's visual effects and post-processing pipeline.

**Key Features**:
- **Render-to-Texture**: Renders terminal content to texture
- **Post-Processing Pipeline**:
  - Unreal Bloom Pass for glow effects
  - Lag effect for CRT-like persistence
  - Noise and scanline effects
- **CRT Simulation**: Vintage monitor visual effects

**Post-Processing Chain**:
```
Terminal Content → Render Pass → Bloom Pass → Lag Effect → Noise/Scanlines → Final Output
```

#### Text Engine (`screen/textEngine.ts`)
**Purpose**: Manages all text rendering, input handling, and terminal display.

**Key Features**:
- **Multiple Font Support**: Different fonts for headers, paragraphs, and monospace text
- **Markdown Rendering**: Converts markdown to 3D text geometry
- **Input Handling**: Processes user input and cursor positioning
- **Scrolling**: Vertical scrolling with smooth animations
- **Image Support**: Displays images within terminal output

**Font Types**:
- `h1Font`: Large pixel font for headers
- `h2Font`: Medium font for subheaders
- `h3Font`: Small font for body text
- `paragraphFont`: Regular paragraph text
- `breakFont`: Monospace font for code/terminal

### Shader System (`shaders/`)

#### Vertex Shader (`vertex.vert`)
**Purpose**: Standard vertex shader for screen quad rendering.

#### Noise Fragment Shader (`noise.frag`)
**Purpose**: Adds CRT-like effects including:
- **Scanlines**: Horizontal lines mimicking CRT displays
- **Noise**: Random pixel noise for authentic vintage look
- **Progress Effect**: Animated scanning effect

#### Lag Fragment Shader (`lag.frag`)
**Purpose**: Creates persistence effect by blending current frame with previous frame.

### Utility Classes

#### ShaderToScreen (`screen/shaderToScreen.ts`)
**Purpose**: Utility class for rendering shaders to render targets.

#### Lag (`screen/lag.ts`)
**Purpose**: Implements frame persistence for CRT-like visual effects.

---

## Terminal System (`src/terminal/`)

### Terminal Controller (`index.ts`)

**Purpose**: Main terminal interface that handles user input and integrates with the WebGL text engine.

**Key Features**:
- **Input Handling**: Processes keyboard input and text editing
- **Selection Management**: Handles cursor positioning and text selection
- **Scroll Control**: Arrow key navigation through terminal history
- **Focus Management**: Switches between mouse and keyboard input

**Input Processing**:
- Captures textarea input events
- Calculates string edit distances for efficient updates
- Sends changes to WebGL text engine
- Executes commands on Enter key press

### Bash Shell (`bash.ts`)

**Purpose**: Command-line interface that parses and executes commands.

**Key Features**:
- **Command Parsing**: Splits commands into executable parts
- **Argument Processing**: Separates flags from arguments
- **Path Management**: Maintains current directory context
- **Command Routing**: Dispatches commands to appropriate applications

**Command Processing Flow**:
1. Parse command string into command name and arguments
2. Separate flags (starting with `-`) from regular arguments
3. Look up command in application registry
4. Execute command with parsed arguments
5. Display prompt for next command

### File System (`fileSystemBash.ts`)

**Purpose**: Virtual file system that simulates Unix-like directory structure.

**Key Features**:
- **Virtual Directory Tree**: Hierarchical folder structure
- **File System Navigation**: Support for relative and absolute paths
- **Dynamic Generation**: Automatically generates virtual FS from actual markdown files
- **Path Resolution**: Handles `.`, `..`, `~`, and absolute paths

**File System Structure**:
```
/ (root)
├── bin/
├── dev/
├── lib64/
├── media/
└── home/
    └── user/
        ├── about/
        ├── contact/
        ├── projects/
        └── title/
```

### Applications (`applications/`)

**Purpose**: Collection of command-line utilities that provide terminal functionality.

#### Available Commands:

1. **`ls`** - List directory contents
2. **`cd`** - Change directory
3. **`pwd`** - Print working directory
4. **`show`** - Display markdown files with rendering
5. **`echo`** - Print text to terminal
6. **`mkdir`** - Create directories
7. **`touch`** - Create files
8. **`hello`** - Welcome message
9. **`help`** - Display available commands

#### Command Structure:
Each command follows a consistent pattern:
- **Documentation**: Name, short description, and help text
- **Argument Processing**: Handles flags and arguments
- **Execution**: Performs the command's functionality
- **Output**: Sends results to terminal display

---

## Data Flow

### Initialization Flow:
1. **WebGL Scene Setup**: Camera, lighting, and basic scene elements
2. **Asset Loading**: 3D models, textures, and fonts loaded asynchronously
3. **Screen Initialization**: Text engine and render engine setup
4. **Terminal Connection**: Terminal system connects to text engine
5. **Animation Start**: Main render loop begins

### User Interaction Flow:
1. **Input Capture**: User types in hidden textarea
2. **Change Detection**: System calculates text differences
3. **Visual Update**: Changes sent to WebGL text engine
4. **Command Execution**: Enter key triggers command processing
5. **Output Rendering**: Results displayed in 3D terminal

### Rendering Pipeline:
1. **Text Geometry**: Convert text to 3D geometry
2. **Scene Rendering**: Render terminal content to texture
3. **Post-Processing**: Apply CRT effects and visual enhancements
4. **Final Composition**: Combine with 3D scene and display

---

## Key Technologies

- **Three.js**: 3D graphics rendering and scene management
- **WebGL**: Hardware-accelerated graphics
- **GLSL Shaders**: Custom visual effects for CRT simulation
- **TypeScript**: Type-safe development
- **Vite**: Build system and asset processing
- **Stats.js**: Performance monitoring

---

## Performance Considerations

- **Render-to-Texture**: Efficient screen content rendering
- **Geometry Merging**: Optimized text rendering using merged geometries
- **Delta Time**: Frame-rate independent animations
- **Lazy Loading**: Assets loaded on demand
- **Responsive Design**: Adapts to different screen sizes and orientations

---

## Debug Features

Access debug mode by adding `#debug` to the URL:
- Performance statistics overlay
- Increased textarea visibility
- Console logging for development

---

## File Organization

```
src/
├── webgl/
│   ├── index.ts              # Main WebGL controller
│   ├── loader.ts             # Asset loading system
│   ├── screen/
│   │   ├── index.ts          # Screen coordinator
│   │   ├── renderEngine.ts   # Post-processing pipeline
│   │   ├── textEngine.ts     # Text rendering system
│   │   ├── shaderToScreen.ts # Shader utility
│   │   └── lag.ts           # CRT persistence effect
│   └── shaders/
│       ├── vertex.vert      # Vertex shader
│       ├── noise.frag       # Noise/scanline effects
│       └── lag.frag         # Frame persistence
└── terminal/
    ├── index.ts             # Terminal interface
    ├── bash.ts              # Command processor
    ├── fileSystemBash.ts    # Virtual file system
    └── applications/        # Command implementations
        ├── index.ts
        ├── applications.ts
        └── [command files]
```

This system creates an immersive retro computing experience that combines modern web technologies with vintage aesthetics, providing both visual appeal and functional interactivity.

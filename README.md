# Personal Portfolio

My interactive portfolio website showcasing my projects and skills, built with modern web technologies including React, TypeScript, and Three.js.

**Live Website**: [lethien.dev](https://lethien.dev)
**Portfolio Section**: [lethien.dev/portfolio](https://lethien.dev/portfolio)

## Features

- **Interactive 3D Environment**: Built with Three.js featuring custom shaders and 3D models
- **Terminal Emulator**: Custom bash emulator with file system simulation and interactive commands
- **Smooth Animations**: GSAP-powered transitions and scroll-triggered animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean design with particle wave backgrounds and smooth preloader
- **Project Showcase**: Gallery of my work with detailed project information

## Tech Stack

- React 19 with TypeScript
- Three.js for 3D graphics and WebGL
- GSAP for animations
- SCSS/Sass for styling
- Vite build tool

## Project Structure

```
src/
├── components/          # React components
│   ├── MainPortfolio/  # Main portfolio sections (About, Works, Certificates)
│   ├── Welcome/        # Animated welcome screen
│   └── Preloader/      # Loading animation
├── terminal/           # Terminal emulator implementation
├── webgl/              # Three.js setup and utilities
├── hooks/              # Custom React hooks
└── styles/             # Global styles and SCSS variables
```

## Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/thienel/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev

```

The development server will be available at `http://localhost:5173`.

## Key Features

### Terminal Emulator
- Custom implementation of a bash-like terminal
- File system navigation with commands like `ls`, `cd`, `cat`
- Interactive help system and command history
- Simulated file structure with project information

### 3D Environment
- WebGL-powered graphics using Three.js
- Custom vertex and fragment shaders
- Interactive camera controls and lighting
- Optimized for performance across devices

### Portfolio Sections
- **About**: Personal information, skills, and background
- **Selected Works**: Project showcase with screenshots and descriptions
- **Certificates**: Educational achievements and certifications
- **Contact**: Professional contact information

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

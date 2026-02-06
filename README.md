# Toto Assistant

A Next.js application built with TypeScript and Tailwind CSS.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework**: Next.js 15.1.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (with Radix UI primitives)
- **Icons**: Lucide React

## Project Structure

```
toto-assistant/
├── app/              # Next.js app directory
│   ├── layout.tsx   # Root layout
│   ├── page.tsx     # Home page
│   ├── globals.css  # Global styles
│   └── fonts.css    # Font imports
├── components/       # React components
├── lib/             # Utility functions
└── public/          # Static assets
```

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

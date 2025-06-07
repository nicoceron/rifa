# RafflesForGood 

A modern, transparent fundraising platform that allows users to create and participate in raffles for good causes.

## Features

- **Transparent Raffles**: Create fair and transparent raffles for fundraising
- **Multiple Categories**: Support for Medical, Pets, Emergency, and Education causes
- **Modern UI**: Beautiful, responsive design with Tailwind CSS and shadcn/ui components
- **Form Validation**: Robust form handling with React Hook Form and Zod validation
- **Toast Notifications**: User feedback with Sonner toast notifications
- **Mobile Responsive**: Optimized for all device sizes

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Font**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd rifa
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── start-raffle/      # Create raffle page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── not-found.tsx      # 404 page
│   └── globals.css        # Global styles
├── components/
│   └── ui/                # shadcn/ui components
├── hooks/
│   └── use-toast.ts       # Toast notification hook
└── lib/
    └── utils.ts           # Utility functions
```

## Key Pages

### Homepage (`/`)

- Hero section with call-to-action
- Featured active raffles
- How it works section
- Category browsing
- Trust indicators

### Start Raffle (`/start-raffle`)

- Comprehensive form for creating new raffles
- Category selection
- Financial details input
- Organizer information
- Form validation and submission

### 404 Page

- Custom not found page with navigation options

## Components

The project uses shadcn/ui components for a consistent, accessible design system:

- **Form Components**: Input, Textarea, Select, Checkbox
- **Layout Components**: Card, Badge, Button, Progress
- **Feedback Components**: Toast notifications via Sonner
- **Navigation**: Custom navigation with responsive design

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Design System**: Green and blue gradient theme
- **Responsive Design**: Mobile-first approach
- **Glassmorphism Effects**: Backdrop blur and transparency effects

## Form Validation

Forms use Zod schemas for type-safe validation:

- Required field validation
- Email format validation
- Minimum length requirements
- Number range validation

## Deployment

The project is ready for deployment on platforms like:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

### Build for Production

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Original Project

This is a Next.js recreation of the original Vite-based RafflesForGood project, maintaining the same functionality and design while leveraging Next.js features for better performance and SEO.

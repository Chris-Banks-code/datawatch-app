# DataWatch - Mobile Data Usage Monitor

## Overview

DataWatch is a mobile-first progressive web application (PWA) designed to help users monitor their mobile data usage with real-time insights and alerts. The application provides comprehensive data tracking, app usage analytics, and customizable notifications to help users stay within their data limits.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Session Management**: Express sessions with PostgreSQL session store

### Mobile-First Design
- **Responsive Layout**: Mobile-first approach with max-width container
- **Bottom Navigation**: Native mobile app-like navigation
- **PWA Features**: Service worker, manifest, and offline capabilities
- **Touch Optimized**: Designed for mobile touch interactions

## Key Components

### Data Storage Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Strongly typed database schema with Zod validation
- **Storage Interface**: Abstracted storage layer supporting both memory and database implementations
- **Tables**: data_usage, app_usage, realtime_data, user_settings, daily_usage_history

### API Endpoints
- `GET /api/usage/current` - Current data usage statistics
- `GET /api/apps/top` - Top apps by data usage
- `GET /api/realtime` - Real-time data usage points
- `POST /api/realtime` - Add new real-time data point
- `GET /api/settings` - User settings and preferences
- `PATCH /api/settings` - Update user settings
- `GET /api/predictions` - Usage predictions and anomaly detection
- `GET /api/usage/history` - Daily usage history (last 30 days)

### Core Features
- **Usage Overview**: Circular progress indicator showing current data usage
- **App Usage Tracking**: List of apps with data consumption and categories
- **Real-time Charts**: Live data usage visualization
- **Alert System**: Configurable usage alerts and notifications
- **Settings Management**: Data limits, alert thresholds, and preferences
- **Usage Predictions**: Forecast when data will run out based on usage patterns
- **Pace Guidance**: Shows if you're on-track, over-pace, or under-pace
- **Anomaly Detection**: Alerts for unusual usage spikes (>150% above average)

## Data Flow

1. **Data Collection**: Real-time data points are collected and stored in the database
2. **API Layer**: Express.js server provides RESTful endpoints for data access
3. **Client State**: React Query manages server state with automatic caching and synchronization
4. **UI Updates**: Components automatically re-render when data changes
5. **Real-time Updates**: Background intervals simulate real-time data generation

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL for production data storage
- **Connection**: Uses `@neondatabase/serverless` for optimized connections
- **Local Development**: Memory storage implementation for development

### UI Components
- **Radix UI**: Headless UI components for accessibility and functionality
- **Lucide React**: Icon library for consistent iconography
- **Embla Carousel**: Carousel component for enhanced UX

### Development Tools
- **Vite**: Fast build tool with HMR and optimized production builds
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast JavaScript bundler for server-side code

## Deployment Strategy

### Production Build
- **Client**: Vite builds optimized React application to `dist/public`
- **Server**: ESBuild bundles Node.js server code to `dist/index.js`
- **Static Assets**: Served directly by Express in production

### Development Environment
- **Hot Module Replacement**: Vite middleware provides instant updates
- **TypeScript Checking**: Continuous type checking during development
- **Database Migrations**: Drizzle Kit handles schema migrations

### Progressive Web App
- **Service Worker**: Caches resources and enables offline functionality
- **Manifest**: Provides native app-like installation experience
- **Responsive Design**: Works seamlessly across all device sizes

### Environment Configuration
- **Database URL**: PostgreSQL connection string via environment variables
- **Development Mode**: Automatic setup of development tools and middleware
- **Production Mode**: Optimized static file serving and error handling

The architecture prioritizes mobile user experience while maintaining scalability and maintainability. The abstracted storage layer allows for easy testing and development, while the production setup leverages serverless PostgreSQL for optimal performance and cost efficiency.
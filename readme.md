# 🍿 PopcornHub - Modern Movie & TV Show Discovery PlatformA beautiful, responsive React application for discovering movies and TV shows, built from scratch with modern design principles and best practices.## ✨ Features### 🎬 Content Discovery- **Popular Movies & TV Shows**: Browse trending and popular content- **Advanced Search**: Search across movies, TV shows, and people- **Detailed Information**: Comprehensive details including cast, crew, trailers, and reviews- **Responsive Design**: Perfect experience on desktop, tablet, and mobile devices### 🎨 Modern UI/UX

- **Dark Theme**: Beautiful dark mode design with gradient accents
- **Smooth Animations**: Fluid transitions and hover effects
- **Mobile-First**: Responsive design that works on all devices
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

### 🚀 Performance

- **Fast Loading**: Optimized images and lazy loading
- **Smooth Navigation**: Client-side routing with React Router
- **Error Handling**: Graceful error states with fallbacks
- **SEO Optimized**: Proper meta tags and semantic HTML

## 🛠️ Tech Stack

### Frontend

- **React 18** - Latest React with hooks and context
- **React Router 6** - Client-side routing
- **CSS3** - Modern CSS with custom properties and flexbox/grid
- **Vite** - Lightning-fast build tool

### Backend Integration

- **TMDB API** - The Movie Database API for content data
- **Axios** - HTTP client for API requests

### Development Tools

- **ESLint** - Code linting and formatting
- **Modern JavaScript** - ES6+ features
- **Component Architecture** - Reusable and maintainable components

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TMDB API key (optional - demo key included)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/popcorn-hub.git
   cd popcorn-hub
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   - Copy the environment template:

     ```bash
     cp .env.example .env
     ```

   - Get your free API key from [TMDB](https://www.themoviedb.org/settings/api)
   - Open `.env` and replace `your_tmdb_api_key_here` with your actual API key

   ```env
   VITE_TMDB_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Enjoy exploring movies and TV shows! 🎉

## 🔐 Environment Variables

For security and deployment flexibility, API keys are stored in environment variables:

- `VITE_TMDB_API_KEY` - Your TMDB API key
- `VITE_TMDB_BASE_URL` - TMDB API base URL (default provided)
- `VITE_TMDB_IMAGE_BASE_URL` - TMDB images base URL (default provided)

See [ENV_SETUP.md](ENV_SETUP.md) for detailed setup instructions and deployment guide.

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Mobile Devices** (320px - 768px)
- **Tablets** (768px - 1024px)
- **Desktop** (1024px+)

## 🎨 Key Design Features

### Navigation

- **Fixed Header**: Always accessible navigation
- **Mobile Menu**: Hamburger menu for smaller screens
- **Search Integration**: Global search functionality
- **Active States**: Visual feedback for current page

### Content Cards

- **Hover Effects**: Smooth animations on interaction
- **Rating Display**: Visual rating system
- **Lazy Loading**: Optimized image loading
- **Skeleton States**: Loading placeholders

### Modal Experience

- **Detailed View**: Rich content details in overlay
- **Responsive Layout**: Adapts to screen size
- **Keyboard Navigation**: ESC key and focus management
- **Video Integration**: Embedded trailers

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar/         # Navigation component
│   ├── ContentCard/    # Movie/TV card component
│   ├── ContentGrid/    # Grid layout component
│   └── Modal/          # Detail modal component
├── pages/              # Page components
│   ├── HomePage/       # Landing page
│   └── SearchPage/     # Search results page
├── context/            # React context for state
├── services/           # API services
├── hooks/              # Custom React hooks
└── styles/             # Global styles and variables
```

## 🎯 Component Architecture

### Reusable Components

- **ContentCard**: Flexible card for movies/TV shows
- **ContentGrid**: Responsive grid with loading states
- **Modal**: Accessible modal with rich content
- **Navbar**: Responsive navigation with search

### Custom Hooks

- **useContentDetails**: Fetch and format content details
- **useAppContext**: Global state management

### Context Management

- Centralized state with React Context
- Actions for API calls and state updates
- Error handling and loading states

## 📈 Performance Optimizations

### Image Optimization

- **Multiple Sizes**: Responsive image sources
- **Lazy Loading**: Images load as needed
- **Placeholder Images**: Fallbacks for missing images
- **WebP Support**: Modern image formats

### Code Splitting

- **Route-based Splitting**: Lazy load pages
- **Component Optimization**: Memoization where needed
- **Bundle Analysis**: Optimized build output

### Caching Strategy

- **API Response Caching**: Reduced API calls
- **Browser Caching**: Optimized cache headers
- **Static Asset Caching**: Long-term caching

## 🌐 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Accessibility**: NVDA, JAWS, VoiceOver compatible

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

### Theming

- CSS custom properties for easy theming
- Consistent color palette throughout
- Easy to modify spacing and typography

### Configuration

- API endpoints easily configurable
- Environment-based settings
- Flexible component props

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TMDB** for providing the excellent movie database API
- **React Team** for the amazing framework
- **Vite** for the lightning-fast build tool
- **The Open Source Community** for inspiration and tools

## 📧 Contact

- **Email**: your.email@example.com
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)
- **Portfolio**: [Your Portfolio Website](https://yourportfolio.com)

---

<div align="center">
  <p>Made with ❤️ and lots of ☕</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>

# Eshtarena Landing Page

A modern, responsive landing page for Eshtarena built with Next.js and Tailwind CSS.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Getting Started

Follow these steps to get the project running on your local machine:

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd new Landing-Page
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env.local` file in the root directory
   - Add the following variables:
     ```env
     NEXT_PUBLIC_API_URL=your_api_url_here
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The site will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates an optimized production build
- `npm start` - Runs the production server
- `npm run lint` - Runs the linter to check code quality

## Project Structure

```
new Landing-Page/
├── components/         # Reusable UI components
├── pages/             # Next.js pages and API routes
├── public/            # Static assets
│   ├── banners/       # Banner images
│   ├── locales/       # Translation files
│   └── ...
├── sections/          # Page sections components
├── styles/           # Global styles and CSS modules
└── utils/            # Utility functions and constants
```

## Features

- 🌐 Multilingual support (English and Arabic)
- 📱 Fully responsive design
- 🎨 Modern UI with smooth animations
- 🔄 Dynamic content loading
- 📝 Contact form integration
- 🖼️ Image optimization with Next.js Image component

## Internationalization

The project uses `next-i18next` for translations:
- Translation files are located in `public/locales/`
- Supported languages: English (en) and Arabic (ar)
- Language can be switched using the language switcher in the navbar

## Browser Support

The landing page is optimized for:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## Build and Deployment

To deploy the project:

1. Create a production build:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Support

For any issues or questions, please contact:
- Email: [support email]
- Website: [support website]

## License

[Add your license information here] 
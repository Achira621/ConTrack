# ConTrack Frontend 🚀

**Intelligent Contract Management Platform** - Built with React, Vite, and TailwindCSS

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/contrack-frontend)

## 🌟 Features

- **Multi-Role Dashboards**: Client, Vendor, and Investor portals
- **Payment Tracking System**: Milestone-based payment management
- **Real-time Progress**: Live payment status updates
- **Interactive Demos**: Explore the platform before signing up
- **Modern UI/UX**: Premium design with smooth animations

## 🎨 Screenshots

**Landing Page** → **Client Dashboard** → **Payment Tracker** → **Milestone Timeline**

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 6
- **Styling**: TailwindCSS (via CDN)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/contrack-frontend.git
cd contrack-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## 🚀 Deploy to Vercel

### Quick Deploy (Recommended)

1. Push this repo to GitHub
2. Visit [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Click **Deploy** (settings are pre-configured!)

### Via Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📁 Project Structure

```
contrack/
├── components/          # React components
│   ├── ClientDashboard.tsx
│   ├── VendorDashboard.tsx
│   ├── InvestorDashboard.tsx
│   ├── PaymentTracker.tsx
│   ├── PaymentScheduleView.tsx
│   └── ...
├── App.tsx             # Main app component
├── types.ts            # TypeScript type definitions
├── index.css           # Base styles
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
└── vercel.json         # Vercel deployment config
```

## 🎯 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file (optional):

```bash
GEMINI_API_KEY=your_api_key_here
```

For Vercel deployment, add this in **Settings → Environment Variables**.

## 🌐 Features Breakdown

### Landing Page
- Hero section with CTAs
- Feature showcase
- Platform overview
- Testimonials

### Client Dashboard
- Contract creation
- Payment schedule management
- Milestone tracking
- Payment history

### Vendor Dashboard
- Contract overview
- Payment status monitoring
- Milestone completion tracking

### Investor Dashboard
- Investment pool analytics
- Portfolio tracking
- Performance metrics

### Payment System
- **Tracker**: Real-time payment progress with visual indicators
- **Schedule**: Timeline view of payment milestones
- **History**: Complete transaction records

## 📝 Usage

### Login Flow

1. Click **"Get Started"** on the landing page
2. Select your role: Client, Vendor, or Investor
3. Enter email and login

### Demo Flow

1. Click **"Watch Demo"** on the landing page
2. Explore the interactive payment system
3. Test "Mark Paid" functionality
4. View real-time progress updates

## 🎨 Theming

The platform uses a premium white theme with green accents:
- **Primary**: Green (#4e877d, #3b6c64)
- **Background**: White (#ffffff, #fafaf9)
- **Text**: Dark gray (#1c1917)

## 🐛 Troubleshooting

### Build fails on Vercel
- Ensure `vercel.json` exists with proper configuration
- Check that all dependencies are in `package.json`

### Styles not loading
- Verify `index.css` exists
- Check Tailwind CDN is loaded in `index.html`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for more troubleshooting tips.

## 📄 License

MIT License - feel free to use this project for your needs!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ for the hackathon

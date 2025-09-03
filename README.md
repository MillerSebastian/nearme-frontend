# NearMe - Local Store Discovery Platform

## 📋 Description

NearMe is a comprehensive web platform that enables users to discover nearby stores and their products. Merchants can register their stores, manage inventories, and upload products in bulk using Excel files. The platform features advanced geolocation technology, real-time search capabilities, and an intuitive user interface for both consumers and business owners.

## 🚀 Features

- **Store Discovery**: Find stores by name, type, and location with advanced geolocation
- **Product Management**: Add, edit, and remove products from your inventory
- **Bulk Import**: Import products from Excel files with intelligent mapping
- **Interactive Dashboard**: Comprehensive statistics and store management tools
- **Authentication System**: Secure registration and login for merchants
- **Responsive Design**: Mobile-first interface optimized for all devices
- **Real-time Search**: Instant product and store search with filtering
- **Contact Integration**: Direct WhatsApp and email communication with stores
- **Advanced Analytics**: Store performance metrics and customer insights

## 🛠️ Technologies & Libraries

### **Frontend Core**

- **JavaScript**: ES6+ (ES2020+) with modern syntax and features
- **Build Tool**: Vite 5.4.2 - Lightning fast build tool and dev server
- **Module System**: ES Modules (ESM) for modern JavaScript development

### **Styling & UI**

- **Tailwind CSS 3.4.1**: Utility-first CSS framework for rapid UI development
- **Bootstrap 5.3.2**: Component library for responsive design
- **FontAwesome 6.4.0**: Comprehensive icon library
- **Google Fonts**: Inter font family for modern typography
- **Custom CSS**: Extensive custom styling with animations and responsive design

### **Maps & Geolocation**

- **Leaflet 1.9.4**: Open-source JavaScript library for interactive maps
- **Leaflet Routing Machine 3.2.12**: Advanced routing and navigation features

### **Development Tools**

- **TypeScript 5.5.3**: Static type checking and enhanced development experience
- **ESLint 9.9.1**: Code quality and consistency tool
- **PostCSS 8.4.35**: CSS processing and transformation
- **Autoprefixer 10.4.18**: Automatic vendor prefixing

### **Architecture & Patterns**

- **SPA Architecture**: Single Page Application with hash-based routing
- **Component-Based Design**: Modular component architecture
- **Event-Driven Architecture**: Responsive user interactions
- **Responsive Design**: Mobile-first approach with breakpoint optimization

### **Performance & Optimization**

- **Lazy Loading**: Dynamic imports for route-based code splitting
- **Asset Optimization**: Efficient CSS and JavaScript bundling
- **Modern JavaScript**: Latest ECMAScript features for optimal performance

## 📦 Installation

### Prerequisites

- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nearme-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - The application will automatically open in your default browser

## 📁 Project Structure

```
nearme-frontend/
├── src/
│   ├── auth/
│   │   └── AuthManager.js          # Authentication and session management
│   ├── components/
│   │   ├── ExcelUpload.js          # Excel file upload and processing
│   │   ├── Header.js               # Navigation header component
│   │   ├── Map.js                  # Interactive map component
│   │   ├── SearchBar.js            # Product and store search
│   │   └── StoreList.js            # Store listing and display
│   ├── pages/
│   │   ├── landing.js              # Landing page with modern design
│   │   ├── home.js                 # Main application home page
│   │   ├── login.js                # User authentication
│   │   ├── register.js             # Store registration
│   │   ├── dashboard.js            # Merchant dashboard
│   │   └── upload-products.js      # Product management
│   ├── router/
│   │   └── Router.js               # SPA routing system
│   ├── utils/
│   │   ├── animations.js           # Custom animation utilities
│   │   ├── main.js                 # Core utility functions
│   │   └── modals.js               # Modal and dialog components
│   ├── config/
│   │   └── api.js                  # API configuration
│   ├── index.css                   # Global styles and Tailwind imports
│   └── main.js                     # Application entry point
├── public/
│   ├── cssLanding/                 # Landing page custom styles
│   │   ├── main.css                # Main landing page styles
│   │   ├── components.css          # Component-specific styles
│   │   ├── responsive.css          # Responsive design rules
│   │   ├── animations.css          # CSS animations and transitions
│   │   ├── accessibility.css       # Accessibility enhancements
│   │   ├── enhancements.css        # UI enhancements
│   │   ├── feature-cards-fix.css   # Feature card styling
│   │   ├── final-fixes.css         # Final styling adjustments
│   │   └── emergency-fix.css       # Critical styling fixes
│   └── img/                        # Image assets
├── index.html                      # Main HTML file
├── package.json                    # Dependencies and scripts
├── vite.config.ts                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
└── tsconfig.json                   # TypeScript configuration
```

## 🔌 API Integration

### Authentication Endpoints

- `POST /api/auth/register` - Store registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - Session termination

### Store Management

- `GET /api/stores` - Retrieve all stores
- `GET /api/stores/:nit` - Get store by NIT
- `POST /api/stores` - Create new store
- `PUT /api/stores/:nit` - Update store information
- `DELETE /api/stores/:nit` - Remove store

### Product Management

- `GET /api/products` - Retrieve all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `PATCH /api/products/:id/status` - Update product availability
- `DELETE /api/products/:id` - Remove product

### Analytics & Insights

- `POST /api/store-views` - Record store inquiries
- `GET /api/store-views/stats/:store_id` - Store performance metrics
- `GET /api/store-views/store/:store_id` - Store inquiry history
- `GET /api/store-views/global-stats` - Platform-wide statistics

## 📊 Excel Import System

### Required Fields

- **Product Name** (text): Product identifier
- **Price** (number): Price without currency symbols (e.g., 15000)
- **Category** (text): Product classification

### Supported Categories

- Hardware & Tools
- Paint & Coatings
- Electrical & Electronics
- Plumbing & Pipes
- Construction Materials
- Gardening & Landscaping
- Fresh Produce
- Technology & Gadgets

### Import Process

1. **File Upload**: Drag & drop or select Excel file (.xlsx, .xls)
2. **Data Validation**: Automatic field mapping and validation
3. **Duplicate Handling**: Choose to update existing or skip duplicates
4. **Bulk Processing**: Efficient import with progress tracking
5. **Error Reporting**: Detailed feedback for failed imports

## 🔐 Authentication Flow

1. **Registration**: Merchants register with store information
2. **Verification**: Email verification and account activation
3. **Login**: Secure authentication with JWT tokens
4. **Session Management**: Persistent sessions with automatic renewal
5. **Access Control**: Role-based permissions and route guards

## 🔄 Data Flow Architecture

### Product Creation Pipeline

1. Excel file upload and parsing
2. Data validation and sanitization
3. Duplicate detection and handling
4. Database insertion with store association
5. Real-time inventory updates

### Search & Discovery Engine

1. User input processing and query optimization
2. Multi-criteria filtering (location, category, price)
3. Relevance scoring and result ranking
4. Dynamic result updates and pagination

### Contact & Communication System

1. Product selection and store identification
2. Contact method selection (WhatsApp/Email)
3. Personalized message generation
4. Communication tracking and analytics

## 🎨 UI/UX Features

### Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Breakpoint System**: Adaptive layouts for all screen sizes
- **Touch-Friendly**: Optimized touch interactions

### Accessibility

- **WCAG 2.1 Compliance**: Level AA accessibility standards
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Optimized color schemes

### Performance

- **Lazy Loading**: Route-based code splitting
- **Asset Optimization**: Compressed CSS and JavaScript
- **Caching Strategy**: Efficient resource management
- **Progressive Enhancement**: Core functionality without JavaScript

## 🚀 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint for code quality
```

## 🐛 Troubleshooting

### Common Issues

**Navigation Problems**

- Clear browser cache and localStorage
- Check console for JavaScript errors
- Verify route configuration in Router.js

**Excel Import Issues**

- Ensure file format is .xlsx or .xls
- Verify required columns are present
- Check file size (max 10MB)

**Authentication Errors**

- Clear browser storage
- Check network connectivity
- Verify API endpoint availability

### Debug Mode

Enable detailed logging by setting `localStorage.debug = 'true'` in browser console.

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Use meaningful commit messages
- Test on multiple devices and browsers
- Maintain accessibility standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Development Team

### **DevTitan** - Development Team

**Lead Developer:**

- **Sebastián Rodelo Clan Cienaga Riwi**
- **CC: 1043637240**
- **Role**: Full Stack Developer & Project Lead

**Frontend Developer:**

- **Jonathan Lopez Clan Cienaga Riwi**
- **CC: 1065854138**
- **Role**: Frontend developer 

- **Johandry Julio Clan Cienaga Riwi**
- **CC: 1001877889**
- **Role**: Frontend developer 
### **Team Members**

- **DevTitan Development Team**
- **Specialization**: Web Development, UI/UX Design, System Architecture

## 🙏 Acknowledgments

### **Open Source Technologies**

- **Vite**: For lightning-fast build tooling and development experience
- **Tailwind CSS**: For utility-first CSS framework and responsive design
- **Leaflet**: For open-source mapping and geolocation capabilities
- **Bootstrap**: For component library and responsive grid system
- **FontAwesome**: For comprehensive icon library and visual elements

### **Development Tools**

- **TypeScript**: For enhanced development experience and type safety
- **ESLint**: For code quality and consistency
- **PostCSS**: For CSS processing and optimization
- **Node.js**: For JavaScript runtime and package management

### **Community & Resources**

- **MDN Web Docs**: For web standards and best practices
- **CSS-Tricks**: For advanced CSS techniques and solutions
- **Stack Overflow**: For community-driven problem solving
- **GitHub**: For version control and collaboration tools

## 📞 Support & Contact

For technical support, feature requests, or collaboration opportunities:

- **Email**: [Your Email]
- **GitHub**: [Your GitHub Profile]
- **LinkedIn**: [Your LinkedIn Profile]
- **Portfolio**: [Your Portfolio Website]

---

**NearMe** - Connecting consumers with local businesses through advanced technology and intuitive design.

_Built with ❤️ by the DevTitan team_

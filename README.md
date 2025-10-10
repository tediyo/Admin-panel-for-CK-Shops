# Coffee Shop Admin Panel

A standalone admin panel for managing coffee shop website content. This admin panel can be used for multiple projects and provides a comprehensive content management system.

## Features

### 🏠 Home Section Management
- **Welcome Text & Slogans**: Manage hero section content including welcome text, main heading, and call-to-action buttons
- **Rating Display**: Control customer rating display and subtitle
- **Real-time Preview**: See changes instantly with live preview

### ⚙️ Display Settings
- **Toggle Controls**: On/off switches for various display elements
- **Clock Display**: Control whether interactive clocks are shown
- **Section Visibility**: Toggle highlights, history, facts, and animations

### ⭐ Highlight Cards
- **Card Management**: Create, edit, and delete highlight cards
- **Image Support**: Add images to cards
- **Badges & Pricing**: Set prices, badges, and special indicators
- **Popular/Seasonal**: Mark cards as popular or seasonal

### 📚 Coffee History Timeline
- **Timeline Management**: Add historical coffee events
- **Year-based Organization**: Organize by years/eras
- **Image Support**: Add images to timeline items
- **Sorting**: Control display order

### 💡 Coffee Fun Facts
- **Fact Management**: Add interesting coffee facts
- **Active/Inactive**: Control which facts are displayed
- **Sorting**: Order facts by priority

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT tokens
- **Icons**: Lucide React

## Installation

1. **Navigate to admin panel directory**:
   ```bash
   cd admin-panel
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access admin panel**:
   Open [http://localhost:3002](http://localhost:3002)

## Default Login

- **Username**: `admin`
- **Password**: `admin123`

## Database

The admin panel uses SQLite database stored in `data/admin.db`. The database is automatically created with the following tables:

- `users` - Admin user accounts
- `home_content` - Home page content
- `display_settings` - Display toggles and settings
- `highlight_cards` - Highlight cards for home page
- `coffee_history` - Coffee history timeline
- `coffee_facts` - Coffee fun facts
- `menu_items` - Menu items (for future use)
- `branches` - Store locations (for future use)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Home Content
- `GET /api/home-content` - Get all home content
- `POST /api/home-content` - Update home content

### Display Settings
- `GET /api/display-settings` - Get all display settings
- `POST /api/display-settings` - Update display settings

### Highlight Cards
- `GET /api/highlight-cards` - Get all highlight cards
- `POST /api/highlight-cards` - Create new highlight card
- `PUT /api/highlight-cards` - Update highlight card
- `DELETE /api/highlight-cards?id={id}` - Delete highlight card

### Coffee History
- `GET /api/coffee-history` - Get all history items
- `POST /api/coffee-history` - Create new history item
- `PUT /api/coffee-history` - Update history item
- `DELETE /api/coffee-history?id={id}` - Delete history item

### Coffee Facts
- `GET /api/coffee-facts` - Get all facts
- `POST /api/coffee-facts` - Create new fact
- `PUT /api/coffee-facts` - Update fact
- `DELETE /api/coffee-facts?id={id}` - Delete fact

## Usage

### 1. Home Content Management
- Edit welcome text, slogans, and call-to-action buttons
- Update customer rating display
- Preview changes in real-time

### 2. Display Settings
- Toggle various display elements on/off
- Control clock visibility
- Manage section visibility

### 3. Highlight Cards
- Add new highlight cards with images
- Set prices, badges, and special indicators
- Mark cards as popular or seasonal

### 4. Coffee History
- Add historical coffee events
- Organize by years/eras
- Include images and descriptions

### 5. Coffee Facts
- Add interesting coffee facts
- Control which facts are displayed
- Organize by priority

## Integration with Main Website

The admin panel provides API endpoints that can be consumed by your main website. The main website should fetch data from these endpoints to display dynamic content.

### Example Integration

```javascript
// Fetch home content
const response = await fetch('http://localhost:3001/api/home-content');
const homeContent = await response.json();

// Fetch display settings
const settingsResponse = await fetch('http://localhost:3001/api/display-settings');
const settings = await settingsResponse.json();
```

## Customization

### Adding New Content Types
1. Add new table to database schema in `lib/database.ts`
2. Create API endpoints in `app/api/`
3. Create management component in `components/`
4. Add to dashboard navigation

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `globals.css` for global styles
- Customize component styles in individual files

## Security

- JWT-based authentication
- Password hashing with bcryptjs
- CORS enabled for API access
- Input validation on all endpoints

## Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

3. **Environment Variables**:
   - Set `JWT_SECRET` for production
   - Configure database path
   - Set up proper CORS origins

## Support

This admin panel is designed to be standalone and reusable across multiple projects. For questions or issues, please refer to the documentation or create an issue in the repository.

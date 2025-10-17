# Modern Kanban Board App

A beautiful, responsive Kanban board application built with vanilla HTML, CSS, and JavaScript. Features a modern design with dark/light theme toggle, drag-and-drop functionality, and local storage persistence.

![Kanban Board Preview](https://via.placeholder.com/800x400/6366f1/ffffff?text=Kanban+Board+Preview)

## ✨ Features

### Core Functionality
- **Three Column Layout**: To Do, In Progress, and Done
- **Task Management**: Add, edit, and delete tasks with rich details
- **Drag & Drop**: Intuitive task movement between columns
- **Local Storage**: Tasks persist between browser sessions
- **Responsive Design**: Works seamlessly on desktop and mobile

### Task Details
- **Title & Description**: Full task information
- **Due Dates**: Set and track task deadlines
- **Priority Levels**: High, Medium, Low with visual indicators
- **Overdue Detection**: Automatic highlighting of overdue tasks

### Design Highlights
- **Theme Toggle**: Switch between dark and light modes
- **Modern UI**: Clean, minimalist design with smooth animations
- **Glassmorphism**: Semi-transparent elements with backdrop blur
- **Gradient Accents**: Beautiful color gradients throughout
- **Smooth Transitions**: Fluid animations and hover effects
- **Empty States**: Helpful illustrations when columns are empty

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software or dependencies required

### Installation

1. **Clone or Download** the repository
   ```bash
   git clone https://github.com/yourusername/kanban-board-app.git
   cd kanban-board-app
   ```

2. **Open the Application**
   - Simply open `index.html` in your web browser
   - Or use a local server for development:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve .
     
     # Using PHP
     php -S localhost:8000
     ```

3. **Start Organizing!**
   - Click "Add Task" to create your first task
   - Drag tasks between columns to update their status
   - Use the theme toggle (top-right) to switch between dark and light modes

## 🎨 Customization

### Adding New Columns
To add more columns, modify the `kanban-board` section in `index.html` and update the corresponding JavaScript logic in `script.js`.

### Styling Changes
All styling is contained in `styles.css` using CSS custom properties for easy theme customization:

```css
:root {
    --accent-primary: #6366f1;
    --accent-secondary: #8b5cf6;
    /* Modify these values to change colors */
}
```

### Task Fields
To add new task fields, update the form in `index.html` and the corresponding JavaScript functions in `script.js`.

## 🛠️ Technical Details

### Tech Stack
- **HTML5**: Semantic markup and accessibility
- **CSS3**: Modern styling with Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: ES6+ features, no frameworks or libraries

### Key Technologies Used
- **CSS Grid**: Responsive column layout
- **CSS Custom Properties**: Dynamic theming
- **Drag and Drop API**: Native browser drag-and-drop
- **Local Storage**: Client-side data persistence
- **CSS Animations**: Smooth transitions and micro-interactions

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Responsive Design

The application is fully responsive and works great on:
- **Desktop**: Full three-column layout
- **Tablet**: Optimized spacing and touch interactions
- **Mobile**: Single-column stacked layout with touch-friendly controls

## 🎯 Performance

- **Lightweight**: No external dependencies or frameworks
- **Fast Loading**: Optimized CSS and JavaScript
- **Efficient Rendering**: Minimal DOM manipulation
- **Smooth Animations**: Hardware-accelerated CSS transitions

## 🔧 Development

### Project Structure
```
kanban-board-app/
├── index.html          # Main HTML structure
├── styles.css          # All styling and themes
├── script.js           # Application logic
└── README.md           # This file
```

### Code Organization
- **Modular JavaScript**: Clean class-based architecture
- **Semantic HTML**: Accessible and well-structured markup
- **Organized CSS**: Logical grouping and clear naming conventions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Design inspiration from modern productivity apps
- Icons from Feather Icons
- Color palette inspired by modern design systems

---

**Built with ❤️ for front-end developers**

*Perfect for showcasing modern web development skills and clean, maintainable code.*

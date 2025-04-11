
# TV App UI Export Guide

This document explains how to export the UI components from this TV application into Figma or FlutterFlow for design and development purposes.

## Exporting to Figma

### Method 1: Screenshot and Recreate

1. **Take Screenshots**:
   - Navigate to each screen in the application
   - Take high-quality screenshots of each view (Home, Library, Settings, etc.)
   - Capture individual components (buttons, cards, navigation items)

2. **Import to Figma**:
   - Create a new Figma project
   - Import the screenshots as references
   - Use Figma's tools to recreate the components with the exact sizing, spacing, and colors

3. **Color Palette**:
   - Main colors to use:
     - Background: `#143D60` (dark blue)
     - Primary: `#A0C878` (green)
     - Secondary: `#DDEB9D` (light green)
     - Accent: `#EB5B00` (orange)
     - Card: slightly lighter blue than background
     - Text: light/white

### Method 2: Code to Figma

1. **Use Figma Dev Mode**:
   - Export your React components as SVG or PNG
   - Import these into Figma
   - Use Figma's dev mode to inspect and recreate the components

2. **Use a Conversion Tool**:
   - Tools like [React to Figma](https://www.figma.com/community/plugin/1126545089931344155/react-to-figma) plugin
   - Copy your React component code
   - Paste into the plugin to generate Figma components

### Component Structure

Structure your Figma file to match the application hierarchy:

```
- Pages
  - Home
  - Library
  - Settings
  - Auth
- Components
  - Navigation
  - Cards
  - Buttons
  - Headers
  - Footers
```

## Exporting to FlutterFlow

### Method 1: Component Recreation

1. **Analyze Component Structure**:
   - Identify all UI components in the React application
   - Note their properties, states, and interactions

2. **Create in FlutterFlow**:
   - Create a new FlutterFlow project
   - Build equivalent widgets for each component
   - Use the same color palette and styling

3. **Replicate Navigation**:
   - Set up similar navigation structure using FlutterFlow's navigation tools
   - Create equivalent routes for Home, Library, Settings, etc.

### Method 2: Design Import

1. **Export Designs from Figma**:
   - If you've recreated the UI in Figma, export designs as PNG or SVG
   - Import these into FlutterFlow as reference images

2. **Use FlutterFlow's UI Builder**:
   - Build the UI on top of the reference images
   - Match all dimensions, colors, and interactions

### Color and Theme Reference

Add these colors to your FlutterFlow theme:

```dart
// Main theme colors
final primaryColor = Color(0xFFA0C878);  // Green
final secondaryColor = Color(0xFFDDEB9D);  // Light green
final accentColor = Color(0xFFEB5B00);  // Orange
final backgroundColor = Color(0xFF143D60);  // Dark blue
final cardBackgroundColor = Color(0xFF1E4975);  // Slightly lighter blue
final textColor = Color(0xFFF7FAFC);  // Light text
```

### Responsive Design Notes

- The TV application is designed for landscape orientation
- All main containers use flex layouts for responsive positioning
- Cards and elements scale proportionally on different screen sizes
- Ensure touch targets in FlutterFlow are at least 48x48px for TV remote navigation

## Component Sizes and Specifications

### Button Components
- Standard Button: 120px × 44px
- Large Button: 180px × 56px
- Icon Button: 40px × 40px
- Radius: 8px for all buttons

### Card Components
- Game Card: 280px × 380px
- Featured Game Card: 100% width × 400px
- Settings Card: 100% width × variable height
- Card Radius: 12px

### Text Specifications
- Headers: 24px, semi-bold
- Subheaders: 18px, medium
- Body Text: 16px, regular
- Button Text: 16px, medium

## Additional Notes

- Focus states are critical for TV interfaces - ensure you recreate the focus rings
- Controllers/remote navigation requires special consideration in FlutterFlow
- The design uses a dark theme with vibrant accent colors for TV visibility
- Animations are subtle but important for user experience

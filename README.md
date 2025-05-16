# ShopSphere

## Updated Project Structure

```
src/
  components/
    common/          # Shared components like Header, Footer, etc.
    ui/              # UI-specific components
    product/         # Product-specific components
  context/           # Context files for global state management
  hooks/             # Custom hooks
  lib/               # Utility functions, database queries, and types
  pages/             # Next.js pages
    api/             # API routes
    products/        # Product-related pages
    cart/            # Cart-related pages
    ...other pages...
  services/          # External services (e.g., payment)
  styles/            # Global styles (e.g., Tailwind, CSS files)
  tests/             # Test files
  public/            # Static assets (e.g., images)
```

## Notes
- Files have been reorganized for better maintainability.
- Follow the structure above for adding new files or features.
- Refer to the `docs/` folder for additional guidelines.

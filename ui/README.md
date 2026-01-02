# @gamecp/ui

React UI component library for GameCP. A collection of reusable, accessible, and customizable components built with React, TypeScript, and Tailwind CSS.

## Installation

```bash
npm install @gamecp/ui
```

## Requirements

- React 19+
- Tailwind CSS (configured in your project)
- react-icons
- framer-motion
- Next.js 15+ (for Link component)

## Usage

```tsx
import { Button, Card, FormInput, Badge } from '@gamecp/ui';

function MyComponent() {
  return (
    <Card title="Example Card">
      <FormInput
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button variant="primary">Submit</Button>
      <Badge variant="success">Active</Badge>
    </Card>
  );
}
```

## Components

### Core Components

#### Button
Versatile button component with multiple variants and sizes.

```tsx
<Button variant="primary" size="md" isLoading={false}>
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'link' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `leftIcon`, `rightIcon`: React.ReactNode
- `fullWidth`: boolean

#### Badge
Display status, categories, or labels.

```tsx
<Badge variant="success" size="md">Active</Badge>
```

**Props:**
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'gray' | 'purple' | etc.
- `size`: 'sm' | 'md' | 'lg'
- `customColors`: { background, text, border }

#### Card
Flexible container component with header, content, and footer sections.

```tsx
<Card 
  title="Card Title"
  subtitle="Subtitle"
  icon={IconComponent}
  variant="default"
>
  Card content
</Card>
```

**Variants:**
- `SimpleCard`: Basic card
- `HeaderCard`: Card with header section
- `StatusCard`: Card with status indicator
- `ClickableCard`: Interactive card
- `AccordionCard`: Collapsible card

#### Link
Next.js Link wrapper with consistent styling.

```tsx
<Link href="/dashboard" variant="primary">
  Go to Dashboard
</Link>
```

### Form Components

#### FormInput
Comprehensive form input supporting multiple types.

```tsx
<FormInput
  label="Username"
  name="username"
  type="text"
  value={value}
  onChange={handleChange}
  required
  error={errors.username}
  description="Enter your username"
/>
```

**Supported Types:**
- text, email, password, number, tel, url
- checkbox, textarea, color

**Features:**
- Icon support (left/right)
- Password visibility toggle
- Copy to clipboard
- Clear button
- Loading states
- Error handling

#### Switch
Toggle switch component.

```tsx
<Switch
  checked={enabled}
  onChange={setEnabled}
  label="Enable feature"
  description="Turn this on to enable the feature"
/>
```

### UI Components

#### Modal
Accessible modal dialog with animations.

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  size="md"
>
  Modal content
</Modal>
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `blocking`: boolean (prevents closing)
- `variant`: 'default' | 'plain'
- `fullScreen`: boolean

#### LoadingSpinner
Animated loading indicator.

```tsx
<LoadingSpinner message="Loading..." showMessage />
```

### Layout Components

#### PageHeader
Consistent page header with title, subtitle, and actions.

```tsx
<PageHeader
  icon={IconComponent}
  title="Page Title"
  subtitle="Page description"
  rightContent={<Button>Action</Button>}
/>
```

#### FormSection
Organize form fields into logical sections.

```tsx
<FormSection
  title="Account Settings"
  description="Manage your account preferences"
>
  <FormInput... />
  <FormInput... />
</FormSection>
```

#### Grid & GridItem
Responsive grid layout system.

```tsx
<Grid cols={3} gap={4}>
  <GridItem span={1}>Content 1</GridItem>
  <GridItem span={2}>Content 2</GridItem>
</Grid>
```

## Styling

All components use Tailwind CSS utility classes and expect your project to have Tailwind configured. The components use semantic color tokens like:

- `primary`, `secondary`, `destructive`
- `foreground`, `background`, `muted`
- `border`, `ring`, `success`, `error`

Make sure these are defined in your Tailwind theme.

## TypeScript

All components are fully typed with TypeScript. Import types as needed:

```tsx
import type { ButtonProps, BadgeVariant } from '@gamecp/ui';
```

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Watch mode for development
npm run dev
```

## License

MIT

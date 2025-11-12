# Framez - Social Media App

A mobile social application built with React Native and Convex that allows users to share posts with images and text.

## Features

### Authentication
- User registration with name, email, and password
- Secure login and logout
- Persistent user sessions using Expo Secure Store
- Password validation

### Posts
- Create posts with text and/or images
- Upload images from device gallery
- View a feed of all posts from users
- Display post author, timestamp, likes, and comments count
- Chronological feed display (most recent first)

### Profile
- View user profile with name, email, and avatar
- Display all posts created by the current user
- Toggle between grid and list view for posts
- Edit profile functionality
- Logout option

## Tech Stack

- **Framework**: React Native (Expo)
- **Backend**: Convex
- **Database**: Convex
- **State Management**: Context API
- **Navigation**: React Navigation v6
- **Image Handling**: Expo Image Picker
- **Secure Storage**: Expo Secure Store
- **TypeScript**: Full TypeScript support

## Project Structure

```
Framez-social-app/
├── convex/                 # Convex backend functions
│   ├── schema.ts          # Database schema
│   ├── auth.ts            # Authentication functions
│   └── posts.ts           # Post-related functions
├── contexts/              # React Context providers
│   └── AuthContext.tsx    # Authentication context
├── navigation/            # Navigation configuration
│   └── AppNavigator.tsx   # Main navigation setup
├── screens/               # App screens
│   ├── WelcomeScreen.tsx  # Welcome/landing screen
│   ├── SignUpScreen.tsx   # User registration
│   ├── LoginScreen.tsx    # User login
│   ├── HomeScreen.tsx     # Feed of all posts
│   ├── CreatePostScreen.tsx # Create new post
│   └── ProfileScreen.tsx  # User profile
├── constants/             # App constants
│   └── theme.ts           # Colors, spacing, fonts
├── App.js                 # Root component
└── package.json           # Dependencies
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator
- Convex account (free at convex.dev)

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   git clone https://github.com/juskins/Framez-social-media-app.git
   cd "c:\Users\User PC\Desktop\HNG 13\Framez-social-app"
   ```

2. **Install dependencies** (already done):
   ```bash
   npm install
   ```

3. **Convex Setup** (already initialized):
   - Convex has been initialized and deployed
   - Your deployment URL is in `.env.local`
   - View your dashboard at: https://dashboard.convex.dev

4. **Start the Convex development server**:
   ```bash
   npx convex dev
   ```
   Keep this terminal running.

5. **In a new terminal, start the Expo development server**:
   ```bash
   npm start
   ```

6. **Run on your device**:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator (Mac only)
   - Or press `w` to run in web browser

## Environment Variables

The project uses the following environment variables (automatically set by Convex):

- `EXPO_PUBLIC_CONVEX_URL`: Your Convex deployment URL
- `CONVEX_DEPLOYMENT`: Your Convex deployment name

These are stored in `.env.local` and should not be committed to version control.

## Usage

### Sign Up
1. Open the app
2. Tap "Sign Up"
3. Enter your name, email, and password
4. Tap "Sign Up" button

### Log In
1. Open the app
2. Tap "Log In"
3. Enter your email and password
4. Optionally check "Stay Logged In"
5. Tap "Log In" button

### Create a Post
1. Navigate to the "Add Post" tab (center button)
2. Write your thoughts in the text area
3. Optionally tap "Upload Image" to add an image
4. Tap "Post" to publish

### View Feed
1. Navigate to the "Home" tab
2. Scroll through posts from all users
3. Pull down to refresh the feed

### View Profile
1. Navigate to the "Profile" tab
2. View your profile information
3. Toggle between grid and list view of your posts
4. Tap "Edit Profile" to update your information
5. Tap "Logout" to sign out

## Key Features Implementation

### Authentication Flow
- Uses Convex mutations for sign-up and login
- Passwords are hashed (basic implementation - should use bcrypt in production)
- User sessions persist using Expo Secure Store
- Authentication state managed through Context API

### Post Creation
- Text and image support
- Images stored in Convex storage
- Image upload with progress feedback
- Validation for empty posts

### Feed Display
- Real-time updates from Convex
- Pull-to-refresh functionality
- Displays author information and timestamps
- Responsive image loading

### Profile Management
- View personal posts in grid or list layout
- Online status indicator
- Edit profile capability
- Secure logout with confirmation

## Design

The app follows the provided design mockups:
https://app.visily.ai/projects/cf518634-689c-40ff-8b8c-2f9b0b73d333/boards/2197235/elements/1040531226


## Database Schema

### Users Table
- `_id`: User ID
- `name`: User's name
- `email`: User's email (indexed)
- `password`: Hashed password
- `avatar`: Optional avatar URL
- `createdAt`: Timestamp

### Posts Table
- `_id`: Post ID
- `userId`: Reference to user
- `content`: Post text content
- `imageUrl`: Optional image URL
- `imageStorageId`: Optional Convex storage ID
- `likes`: Number of likes
- `comments`: Number of comments
- `createdAt`: Timestamp (indexed)

## API Functions

### Authentication (convex/auth.ts)
- `signUp`: Create a new user account
- `login`: Authenticate user
- `getUser`: Fetch user details
- `updateProfile`: Update user information

### Posts (convex/posts.ts)
- `createPost`: Create a new post
- `getAllPosts`: Fetch all posts with user information
- `getUserPosts`: Fetch posts for a specific user
- `likePost`: Increment post likes
- `generateUploadUrl`: Generate URL for image upload
- `getImageUrl`: Get URL for stored image

## Testing

1. **Test Authentication**:
   - Sign up with a new account
   - Log out
   - Log in with the same credentials
   - Close and reopen the app (should stay logged in)

2. **Test Post Creation**:
   - Create a text-only post
   - Create a post with an image
   - View the post in the feed
   - View the post in your profile

3. **Test Feed**:
   - View posts from multiple users
   - Pull to refresh
   - Check timestamp formatting

4. **Test Profile**:
   - Switch between grid and list views
   - Verify posts display correctly
   - Test logout functionality

## Known Limitations

1. **Image Storage**: Images are stored in Convex storage. In production, consider using a CDN.
2. **Password Security**: Uses basic Base64 encoding. Should implement bcrypt or similar in production.
3. **Real-time Updates**: Currently uses polling. Could implement Convex subscriptions for real-time updates.
4. **Image Optimization**: Images should be compressed before upload for better performance.
5. **Search Functionality**: Search tab currently shows home screen - to be implemented.

## Future Enhancements

- [ ] Implement actual like functionality (toggle likes)
- [ ] Add comments feature
- [ ] Implement search functionality
- [ ] Add user following/followers
- [ ] Push notifications
- [ ] Image compression and optimization
- [ ] Video support
- [ ] Dark mode
- [ ] Profile editing with avatar upload
- [ ] Post deletion
- [ ] Share to other platforms
- [ ] Hashtags and mentions

## Troubleshooting

### Convex Connection Issues
- Ensure `npx convex dev` is running
- Check that `EXPO_PUBLIC_CONVEX_URL` is set in `.env.local`
- Verify internet connection

### Image Upload Fails
- Check device permissions for camera roll
- Ensure image size is reasonable (< 5MB)
- Check Convex storage limits

### App Crashes on Startup
- Clear Metro bundler cache: `npm start -- --reset-cache`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npx tsc --noEmit`

## Contributing

This is a learning project. Feel free to fork and experiment!

## License

MIT License

## Credits

- Design: Made with Visily
- Backend: Convex
- Framework: React Native / Expo
- Developer: Juskins

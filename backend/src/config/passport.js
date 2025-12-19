import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import { WorkspaceRole } from './constants.js';

// Configure Google OAuth Strategy only if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User exists, return user
          return done(null, user);
        }

        // Check if user exists with this email
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // User exists with email, link Google account
          user.googleId = profile.id;
          if (!user.image && profile.photos && profile.photos.length > 0) {
            user.image = profile.photos[0].value;
          }
          await user.save();
          return done(null, user);
        }

        // Create new user
        const newUser = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
          password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // Random password
          isGoogleUser: true,
        });

        // Create default workspace for new user
        const defaultWorkspace = await Workspace.create({
          name: `${newUser.name}'s Workspace`,
          slug: `${newUser.name.toLowerCase().replace(/\s+/g, '-')}-workspace-${Date.now()}`,
          description: 'My personal workspace',
          ownerId: newUser._id,
        });

        // Add user as admin member to the workspace
        await WorkspaceMember.create({
          userId: newUser._id,
          workspaceId: defaultWorkspace._id,
          role: WorkspaceRole.ADMIN,
        });

        return done(null, newUser);
      } catch (error) {
        console.error('Google OAuth Error:', error);
        return done(error, null);
      }
    }
    )
  );

  // Serialize user for the session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
} else {
  console.warn('⚠️  Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env to enable.');
}

export default passport;

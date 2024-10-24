const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const User = require("../models/User"); // Adjust the path as needed

const GOOGLE_CLIENT_ID = "123705957832-9anaatocmu5jhb29l4k3ol8mk3un81uk.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const GITHUB_CLIENT_ID = "0f08a441f9de8ad00933";
const GITHUB_CLIENT_SECRET = "6dc8ce00957cd02d1cdbeddcc46ec41f4dac94e2";

const FACEBOOK_CLIENT_ID = "519046297201499";
const FACEBOOK_CLIENT_SECRET = "cf2fbea2ff6804068ff193d30b066213";

// GitHub Strategy
passport.use(
  new GitHubStrategy({ 
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
      scope: ["user:email"]
  },
  async (accessToken, refreshToken, profile, done) => {
      try {
          let user = await User.findOne({ githubId: profile.id });

          if (!user) {
              user = new User({
                  githubId: profile.id,
                  name: profile.displayName,
                  email: profile.emails?.[0]?.value,
                  profileImage: profile._json.avatar_url
              });

              await user.save();
          }

          return done(null, user);
      } catch (error) {
          return done(error, null);
      }
  })
);

// Facebook Strategy
passport.use(
  new FacebookStrategy({ 
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'photos', 'emails'], // Request profile fields
      scope: ["public_profile", "email"]
  },
  async (accessToken, refreshToken, profile, done) => {
      try {
          let user = await User.findOne({ facebookId: profile.id });

          if (!user) {
              user = new User({
                  facebookId: profile.id,
                  name: profile.displayName,
                  email: profile.emails?.[0]?.value,
                  profileImage: profile._json.picture.data.url
              });

              await user.save();
          }

          return done(null, user);
      } catch (error) {
          return done(error, null);
      }
  })
);

// Google Strategy
passport.use(
  new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"]
  },
  async (accessToken, refreshToken, profile, done) => {
      try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
              user = new User({
                  googleId: profile.id,
                  name: profile.displayName,
                  email: profile.emails[0].value,
                  profileImage: profile._json.picture
              });

              await user.save();
          }

          return done(null, user);
      } catch (error) {
          return done(error, null);
      }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Store only the user ID in the session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
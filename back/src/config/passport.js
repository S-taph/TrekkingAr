// Passport Google OAuth 2.0 strategy configuration
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import Usuario from '../models/Usuario.js'

export function configurePassportGoogle(app) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value
      if (!email) return done(null, false)
      let user = await Usuario.findOne({ where: { email } })
      if (user) {
        // link googleId and avatar if not set
        await user.update({ googleId: user.googleId || profile.id, avatar: user.avatar || profile.photos?.[0]?.value })
      } else {
        user = await Usuario.create({
          email,
          password_hash: null,
          nombre: profile.name?.givenName || profile.displayName || 'GoogleUser',
          apellido: profile.name?.familyName || '',
          dni: Math.floor(Math.random()*1e8), // placeholder, should be completed later
          telefono: null,
          experiencia_previa: null,
          rol: 'cliente',
          googleId: profile.id,
          avatar: profile.photos?.[0]?.value,
        })
      }
      return done(null, user)
    } catch (e) {
      return done(e)
    }
  }))

  app.use(passport.initialize())
}

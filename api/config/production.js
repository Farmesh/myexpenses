export default {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3001,
  clientURL: 'https://farmeshexpenses.netlify.app'
}; 
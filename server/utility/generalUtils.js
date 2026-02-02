exports.keysBasedOnEnv = () => {
  if (process.env.NODE_ENV === "production") {
    // PRODUCTION
    return {
      clientUrl: "https://leaflit.us",
      // Mailgun
      mailgun: {
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
      },
      // Supabase
      supabase: {
        url: "",
        apiKey: "",
      },
      // Cloudinary
      cloudinary: {
        name: process.env.CLOUDINARY_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
      },
      // Stripe
      stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY_PROD,
        price_garden: process.env.STRIPE_PRICE_GARDEN_PROD,
        price_grove: process.env.STRIPE_PRICE_GROVE_PROD,
        price_forest: process.env.STRIPE_PRICE_FOREST_PROD,
      },
      openai: {},
    };
  } else {
    // Non-Prod
    return {
      clientUrl: "https://localhost:5173",
      // Mailgun
      mailgun: {
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
      },
      // Supabase
      supabase: {
        url: process.env.SUPABASE_URL,
        apiKey: process.env.SUPABASE_API_KEY,
      },
      // Cloudinary
      cloudinary: {
        name: process.env.CLOUDINARY_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
      },
      // Stripe
      stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY_TEST,
        price_garden: process.env.STRIPE_PRICE_GARDEN,
        price_grove: process.env.STRIPE_PRICE_GROVE,
        price_forest: process.env.STRIPE_PRICE_FOREST,
      },
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
      },
    };
  }
};

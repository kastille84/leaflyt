exports.keysBasedOnEnv = () => {
  if (process.env.NODE_ENV === "production") {
    // PRODUCTION
    return {
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
        publishableKey: "",
      },
      openai: {},
    };
  } else {
    // Non-Prod
    return {
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
        publishableKey: "",
      },
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
      },
    };
  }
};

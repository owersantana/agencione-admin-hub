
// Configuração global da marca - modifique aqui para whitelabel
export const BRAND_CONFIG = {
  name: "OneAgenda",
  tagline: "Gerencie seu negócio de forma inteligente",
  
  // URLs e links
  website: "https://oneagenda.com.br",
  support: "https://agencione.com.br/suporte",
  
  // Redes sociais
  social: {
    instagram: "https://instagram.com/oneagenda",
    facebook: "https://facebook.com/oneagenda", 
    tiktok: "https://tiktok.com/@oneagenda"
  },
  
  // Configurações de autenticação
  auth: {
    enableSignup: true,
    enableForgotPassword: true,
    enableSocialLogin: false
  }
} as const;

// Configuração da API
export const API_CONFIG = {
  // URL de desenvolvimento (local)
  DEVELOPMENT: "http://192.168.15.25:3000",
  // URL de produção (Vercel)
  PRODUCTION: "https://srd-solucoes.vercel.app",
};

// Determina qual URL usar baseado no ambiente
export const getApiBaseUrl = (): string => {
  // Em desenvolvimento, você pode usar __DEV__ para alternar
  // ou definir uma variável de ambiente
  if (__DEV__) {
    // Para alternar entre desenvolvimento e produção durante o desenvolvimento
    // você pode comentar/descomentar a linha abaixo
    return API_CONFIG.PRODUCTION; // Use PRODUCTION para testar com a API da Vercel
    // return API_CONFIG.DEVELOPMENT; // Use DEVELOPMENT para testar localmente
  }

  // Em produção, sempre usar a URL da Vercel
  return API_CONFIG.PRODUCTION;
};

// Exporta a URL base atual
export const API_BASE_URL = getApiBaseUrl();

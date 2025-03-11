# Etapa 1: Construção da aplicação
FROM node:18-alpine AS build

WORKDIR /app

# Copia apenas arquivos essenciais para instalar dependências
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copia o restante do projeto
COPY . .

# Compila a aplicação React
RUN npm run build

# Etapa 2: Servindo com Nginx
FROM nginx:alpine

# Copia os arquivos compilados para a pasta pública do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia um arquivo de configuração customizado do Nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expondo a porta padrão do Nginx
EXPOSE 90

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]

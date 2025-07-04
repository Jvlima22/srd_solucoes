# 📝 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2024-07-04

### 🎉 Lançamento Inicial

#### ✨ Adicionado

- **Autenticação completa**

  - Sistema de login com validação de unidades
  - Autenticação persistente com AsyncStorage
  - Logout com confirmação
  - Tela de startup com informações do app

- **Gestão de Manifestos**

  - Listagem de manifestos
  - Busca por número de manifesto
  - Inicialização de transporte
  - Controle de status (EM TRÂNSITO, PENDENTE)
  - Detalhes de ocorrências

- **Gestão de Entregas**

  - Listagem de entregas por manifesto
  - Detalhes completos de cada entrega
  - Lançamento de ocorrências
  - Upload de arquivos
  - Exclusão de ocorrências
  - Seleção múltipla de documentos

- **Gestão de Coletas**

  - Controle de coletas
  - Registro de ocorrências
  - Detalhamento de informações
  - Gestão de documentos
  - Upload de arquivos

- **Gestão de Despachos**

  - Controle de despachos
  - Lançamento de ocorrências
  - Detalhes de minutas
  - Gestão de fretes
  - Exclusão de ocorrências

- **Gestão de Retiradas**

  - Controle de retiradas
  - Registro de ocorrências
  - Detalhamento de romaneios
  - Gestão de documentos
  - Seleção múltipla

- **Gestão de Transferências**

  - Controle de transferências
  - Lançamento de ocorrências
  - Detalhes de fretes
  - Gestão de documentos
  - Exclusão de ocorrências

- **Interface e UX**

  - Design moderno com NativeWind (Tailwind CSS)
  - Navegação intuitiva com React Navigation
  - Bottom sheets para detalhes
  - Modais customizados
  - Componentes reutilizáveis
  - Ícones Lucide React Native
  - Animações suaves

- **Funcionalidades Técnicas**
  - Configuração flexível de API (desenvolvimento/produção)
  - Sistema de mock para desenvolvimento
  - Interceptors para logs de requisições
  - Tratamento de erros
  - Loading states
  - Pull-to-refresh
  - Validações de formulário

#### 🛠 Tecnologias

- React Native 0.79.2
- Expo SDK 53
- TypeScript 5.8.3
- NativeWind 4.1.23
- React Navigation 7
- Axios 1.9.0
- @gorhom/bottom-sheet 5.1.2
- Lucide React Native 0.486.0

#### 📱 Plataformas Suportadas

- Android
- iOS
- Web

#### 🔧 Configuração

- API de produção: `https://srd-solucoes.vercel.app`
- API de desenvolvimento: `http://192.168.15.25:3000`
- Sistema de configuração flexível para alternar entre ambientes

---

## [Unreleased]

### 🚧 Em Desenvolvimento

- [ ] Testes automatizados
- [ ] PWA (Progressive Web App)
- [ ] Notificações push
- [ ] Modo offline
- [ ] Temas claro/escuro
- [ ] Internacionalização (i18n)
- [ ] Analytics e métricas
- [ ] Performance optimizations

### 🔮 Planejado

- [ ] Dashboard com gráficos
- [ ] Relatórios exportáveis
- [ ] Integração com GPS
- [ ] Assinatura digital
- [ ] Backup automático
- [ ] Sincronização em tempo real

---

## 📋 Tipos de Mudanças

- **✨ Adicionado** - Nova funcionalidade
- **🐛 Corrigido** - Correção de bug
- **💥 Alterado** - Mudança que quebra compatibilidade
- **🗑 Removido** - Funcionalidade removida
- **🔒 Segurança** - Correção de vulnerabilidade
- **📚 Documentação** - Mudanças na documentação
- **🎨 Estilo** - Mudanças que não afetam o código
- **♻️ Refatorado** - Refatoração de código
- **⚡ Performance** - Melhorias de performance
- **🧪 Teste** - Adição ou correção de testes
- **🔧 Configuração** - Mudanças em arquivos de configuração

---

## 📞 Suporte

Para suporte ou dúvidas sobre as versões, entre em contato:

- Email: [seu-email@exemplo.com](targetlogsolutions@outlook.com)
- Issues: [GitHub Issues](https://github.com/Jvlima22/srd_solucoes/issues)

---

**Desenvolvido com ❤️ pela equipe SRD Soluções**

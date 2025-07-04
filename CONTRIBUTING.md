# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o projeto SRD Soluções! Este documento fornece diretrizes para contribuições.

## 📋 Índice

- [Como Contribuir](#-como-contribuir)
- [Configuração do Ambiente](#-configuração-do-ambiente)
- [Padrões de Código](#-padrões-de-código)
- [Processo de Pull Request](#-processo-de-pull-request)
- [Reportando Bugs](#-reportando-bugs)
- [Solicitando Features](#-solicitando-features)

## 🚀 Como Contribuir

### 1. Fork e Clone

```bash
# Faça um fork do repositório
# Clone seu fork
git clone https://github.com/seu-usuario/srd-solucoes.git
cd srd-solucoes

# Adicione o repositório original como upstream
git remote add upstream https://github.com/original-owner/srd-solucoes.git
```

### 2. Crie uma Branch

```bash
# Crie uma branch para sua feature
git checkout -b feature/nova-funcionalidade

# Ou para correção de bugs
git checkout -b fix/correcao-bug
```

### 3. Faça suas Alterações

- Escreva código limpo e bem documentado
- Siga os padrões de código estabelecidos
- Adicione testes quando apropriado
- Atualize a documentação se necessário

### 4. Commit suas Alterações

```bash
# Adicione suas alterações
git add .

# Faça o commit com uma mensagem descritiva
git commit -m "feat: adiciona nova funcionalidade de busca"

# Push para sua branch
git push origin feature/nova-funcionalidade
```

## ⚙️ Configuração do Ambiente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI
- Git

### Instalação

```bash
# Instale as dependências
npm install

# Configure o ambiente de desenvolvimento
npm start
```

### Scripts Úteis

```bash
npm start          # Inicia o servidor de desenvolvimento
npm run android    # Executa no Android
npm run ios        # Executa no iOS
npm run web        # Executa na web
npm run lint       # Executa o linter
npm run lint:fix   # Corrige problemas de linting automaticamente
```

## 📝 Padrões de Código

### TypeScript

- Use TypeScript para todo o código
- Defina tipos apropriados para props e estados
- Evite `any` - use tipos específicos
- Use interfaces para objetos complexos

```typescript
// ✅ Bom
interface UserProps {
  name: string;
  email: string;
  age?: number;
}

// ❌ Evite
const user: any = { name: "João" };
```

### Componentes React

- Use componentes funcionais com hooks
- Mantenha componentes pequenos e focados
- Use props tipadas
- Documente props complexas

```typescript
// ✅ Bom
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}) => {
  // Componente implementação
};
```

### Estilização

- Use NativeWind (Tailwind CSS) para estilos
- Mantenha consistência nas cores e espaçamentos
- Use as classes definidas em `src/styles/colors.ts`

```typescript
// ✅ Bom
<View className="flex-1 bg-grayscale-0 p-4">
  <Text className="text-grayscale-600 text-lg font-bold">
    Título
  </Text>
</View>
```

### Nomenclatura

- Use camelCase para variáveis e funções
- Use PascalCase para componentes
- Use kebab-case para arquivos
- Use UPPER_CASE para constantes

```typescript
// ✅ Bom
const userName = "João";
const UserProfile = () => {};
const API_BASE_URL = "https://srd-solucoes.vercel.app";

// ❌ Evite
const user_name = "João";
const userprofile = () => {};
const apiBaseUrl = "https://srd-solucoes.vercel.app";
```

## 🔄 Processo de Pull Request

### 1. Prepare seu PR

- Certifique-se de que seu código segue os padrões
- Execute os testes: `npm run lint`
- Atualize a documentação se necessário
- Verifique se não há conflitos

### 2. Crie o Pull Request

- Use um título descritivo
- Descreva as mudanças na descrição
- Mencione issues relacionadas
- Adicione screenshots se aplicável

### 3. Template do PR

```markdown
## Descrição

Breve descrição das mudanças realizadas.

## Tipo de Mudança

- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Testes

- [ ] Testei no Android
- [ ] Testei no iOS
- [ ] Testei na web

## Screenshots (se aplicável)

Adicione screenshots aqui.

## Checklist

- [ ] Meu código segue os padrões do projeto
- [ ] Adicionei testes para minhas mudanças
- [ ] Atualizei a documentação
- [ ] Não há conflitos
```

### 4. Review Process

- Mantenha o PR pequeno e focado
- Responda aos comentários do review
- Faça as correções solicitadas
- Aguarde a aprovação antes do merge

## 🐛 Reportando Bugs

### Antes de Reportar

1. Verifique se o bug já foi reportado
2. Teste na versão mais recente
3. Reproduza o bug consistentemente

### Template do Bug Report

```markdown
## Descrição do Bug

Descrição clara e concisa do bug.

## Passos para Reproduzir

1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## Comportamento Esperado

O que deveria acontecer.

## Comportamento Atual

O que está acontecendo.

## Screenshots

Adicione screenshots se aplicável.

## Ambiente

- OS: [ex: iOS, Android, Web]
- Versão: [ex: 1.0.0]
- Dispositivo: [ex: iPhone 12, Samsung Galaxy]

## Informações Adicionais

Qualquer contexto adicional sobre o problema.
```

## 💡 Solicitando Features

### Template da Feature Request

```markdown
## Descrição da Feature

Descrição clara da funcionalidade desejada.

## Problema que Resolve

Explicação do problema que esta feature resolveria.

## Solução Proposta

Descrição da solução proposta.

## Alternativas Consideradas

Outras soluções que foram consideradas.

## Contexto Adicional

Qualquer contexto adicional.
```

## 📞 Comunicação

- Use issues para discussões
- Seja respeitoso e construtivo
- Ajude outros desenvolvedores
- Mantenha o foco no projeto

## 🎯 Áreas para Contribuição

- **UI/UX**: Melhorias na interface
- **Performance**: Otimizações
- **Testes**: Cobertura de testes
- **Documentação**: Melhorias na docs
- **Bug Fixes**: Correções de bugs
- **Features**: Novas funcionalidades

## 🙏 Agradecimentos

Obrigado por contribuir com o projeto SRD Soluções! Sua contribuição é muito importante para a comunidade.

---

**Juntos construímos um futuro melhor para a logística! 🚛✨**

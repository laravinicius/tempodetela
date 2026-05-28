# 📱 Plano de Ação — Protótipo "Tempo de Tela"

## Visão Geral do Projeto

**Nome do App:** Tempo de Tela  
**Tipo:** Protótipo de app mobile (HTML + CSS + JS)  
**Objetivo:** Apresentar um protótipo navegável de um app que bloqueia o acesso ao celular por um tempo configurável, incentivando o usuário a se manter fora das telas.

---

## Estrutura de Arquivos

```
tempo-de-tela/
├── index.html       # Estrutura HTML de todas as telas
├── style.css        # Estilos visuais (tema, animações, layout mobile)
└── app.js           # Lógica de navegação, timer e validação
```

---

## Telas do App

### Tela 1 — Home (Tela Inicial)

**Componentes:**

| Elemento | Posição | Estado |
|---|---|---|
| Menu hamburger (☰) | Topo esquerdo | Visual apenas |
| Nome "Tempo de Tela" | Topo centro | — |
| Foto de perfil (avatar) | Topo direito | Visual apenas |
| Seção de configuração | Corpo central | Funcional |
| Campo de Horas | Dentro da seção | Input numérico |
| Campo de Minutos | Dentro da seção | Input numérico |
| Botão "Iniciar Bloqueio" | Abaixo da seção | **Funcional** |

---

### Tela 2 — Tela de Bloqueio (Sobreposta)

**Ativação:** clique em "Iniciar Bloqueio"  
**Comportamento:** cobre 100% da tela com overlay

**Componentes:**

| Elemento | Detalhe |
|---|---|
| Display do Timer | Contagem regressiva em tempo real (HH:MM:SS) |
| Botão "Desbloquear" | Abre o modal de confirmação |

---

### Tela 3 — Modal de Confirmação de Desbloqueio

**Ativação:** clique em "Desbloquear"  
**Comportamento:** modal sobre a tela de bloqueio

**Componentes:**

| Elemento | Detalhe |
|---|---|
| Instrução ao usuário | Texto explicando o que deve ser digitado |
| Frase exigida | `"Estou ciente sobre o desbloqueio"` |
| Campo de texto | Input para digitação da frase |
| Validação | Comparação exata (case-insensitive recomendado) |
| Confirmação | Retorna à Home com timer zerado |
| Cancelar | Fecha o modal, bloqueio continua |

---

## Fluxo de Navegação

```
[Home]
   │
   │  usuário define horas e minutos
   │  clica em "Iniciar Bloqueio"
   ▼
[Tela de Bloqueio]
   │
   │  timer conta regressivamente
   │  clica em "Desbloquear"
   ▼
[Modal de Confirmação]
   │
   ├── digita frase correta ──► [Home] (timer zerado)
   │
   └── cancela ──────────────► [Tela de Bloqueio] (timer continua)
```

---

## Lógica JavaScript

### Timer
- Capturar valores dos inputs (horas + minutos)
- Converter para segundos totais
- Usar `setInterval` a cada 1000ms para decrementar
- Formatar exibição: `HH:MM:SS`
- Ao chegar em 00:00:00 → retornar automaticamente à Home

### Validação da frase
- Capturar texto digitado no modal
- Comparar com `"Estou ciente sobre o desbloqueio"` (normalizado)
- Se correto: fechar telas de bloqueio, limpar timer, resetar inputs
- Se incorreto: exibir mensagem de erro, manter bloqueio ativo

### Navegação entre telas
- Usar classes CSS (`hidden`, `active`) para exibir/ocultar telas
- Sem redirecionamento de página — tudo em `index.html`

---

## Diretrizes de Design

### Estética
- **Tema:** Dark mode — transmite foco, seriedade e redução de estímulos visuais
- **Paleta:** tons escuros de fundo + acento em azul-elétrico ou verde-menta
- **Tipografia:** fonte moderna e limpa (ex: `DM Sans`, `Sora`, ou `Plus Jakarta Sans`)
- **Layout:** simulação de tela mobile centralizada no browser (max-width ~390px)
- **Bordas e sombras:** suaves, com leve profundidade (glassmorphism opcional)

### Animações
- Fade-in na tela de bloqueio ao iniciar
- Slide-up no modal de confirmação
- Shake no input ao errar a frase
- Pulse sutil no timer enquanto corre

---

## Critérios de Aceitação

- [ ] Tela inicial com os 3 elementos no topo (menu, título, avatar)
- [ ] Inputs de hora e minuto funcionando corretamente
- [ ] Botão "Iniciar Bloqueio" transiciona para a tela de bloqueio
- [ ] Timer exibido e contando regressivamente em tempo real
- [ ] Botão "Desbloquear" abre o modal
- [ ] Campo de texto valida a frase exata
- [ ] Frase correta retorna à Home e zera o timer
- [ ] Frase incorreta mantém o bloqueio e exibe erro
- [ ] Layout responsivo simulando mobile
- [ ] Visual coeso e esteticamente cuidado

---

## Ordem de Desenvolvimento Sugerida

1. **HTML** — estrutura das 3 telas (home, bloqueio, modal) em um único arquivo
2. **CSS** — layout mobile, tema escuro, tipografia, animações
3. **JS** — lógica do timer (start, tick, reset)
4. **JS** — lógica de navegação (mostrar/ocultar telas)
5. **JS** — validação da frase de desbloqueio
6. **Refinamento** — micro-interações, feedback visual de erro, polimento geral

---

## Observações Finais

- Os botões de menu hamburger e foto de perfil são **decorativos** nesta versão
- O projeto não usa frameworks — puro HTML/CSS/JS para máxima portabilidade
- O protótipo é estático e roda diretamente no browser sem servidor

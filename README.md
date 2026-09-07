# Optimus Study — Sistema de Controle de Estudos

Protótipo acadêmico do Grupo Optimus para cadastro e acompanhamento de disciplinas.

## Estrutura
- `index.html`
- `style.css`
- `script.js`
- `img/logo.svg`
- `img/` — imagens da equipe utilizadas pelo projeto

## Requisitos atendidos
O sistema utiliza objetos, array de objetos, manipulação do DOM, `localStorage`, `JSON.stringify()` e `JSON.parse()`.

A chave `disciplinas` guarda o array serializado. A preferência do tema é armazenada separadamente em `optimusStudyTema`.

## Como executar
Abra `index.html` pelo Live Server do VS Code.

## Funcionalidades
- Adicionar disciplina.
- Validar nome e horas.
- Listar disciplinas.
- Concluir e reabrir disciplina.
- Remover disciplina.
- Persistir dados após F5.
- Alternar tema claro/escuro e persistir a preferência.

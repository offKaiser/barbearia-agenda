# Barbearia Norte

Aplicacao web de agendamento para barbearias, criada como projeto de portfolio. A experiencia permite que o cliente consulte servicos, escolha um horario e crie uma reserva; o profissional administra agenda, servicos, disponibilidade e indicadores pelo painel.

## Demonstracao

Esta versao foi preparada para GitHub Pages e funciona sem backend. Abra `index.html` para a pagina publica e `painel.html` para o painel demonstrativo.

## Recursos

### Pagina publica

- Catalogo de servicos com descricao, valor e duracao.
- Horarios calculados a partir da disponibilidade configurada.
- Bloqueio de conflitos entre atendimentos.
- Reserva com nome, WhatsApp e aceite da politica.
- Instrucoes de sinal PIX e atalho para WhatsApp.
- Consulta de reserva por codigo e WhatsApp.
- Cancelamento online permitido ate duas horas antes do atendimento.

### Painel do profissional

- Cadastro, edicao, pausa e exclusao de servicos.
- Configuracao de dias de trabalho, horarios e pausa/almoço.
- Datas fechadas para feriados, ferias e folgas.
- Horarios especiais para datas pontuais.
- Filtros por data, status, cliente e servico.
- Confirmacao simulada de PIX e atualizacao de status.
- Relatorios por periodo: reservas, faturamento previsto, sinais confirmados, faltas, cancelamentos e servico mais procurado.
- Lembretes simulados para reservas nas proximas 24 horas, com abertura da mensagem no WhatsApp.

## Tecnologias

- HTML5
- CSS3 responsivo
- JavaScript puro
- Lucide Icons
- Google Fonts
- `localStorage` para persistencia no modo demonstrativo

## Arquitetura da demonstracao

GitHub Pages hospeda apenas arquivos estaticos. Por isso, esta versao persiste servicos, horarios, reservas e indicadores no `localStorage` do navegador.

Isso permite uma demonstracao funcional sem instalar Node.js, banco de dados ou servidor. Como consequencia, os dados nao sao compartilhados entre dispositivos, visitantes ou navegadores. Limpar os dados do navegador tambem limpa a demonstracao.

## Executar localmente

Nao ha dependencias para esta versao. Basta abrir `index.html` em um navegador moderno. Para testar o fluxo completo, faca uma reserva na pagina publica e abra `painel.html` no mesmo navegador.

## Publicar no GitHub Pages

1. Crie um repositorio no GitHub, por exemplo `barbearia-agenda`.
2. Envie o conteudo desta pasta para a raiz do repositorio.
3. Acesse **Settings > Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/(root)`.
6. Salve e aguarde o GitHub informar a URL publicada.

## Evolucao para producao

Para um produto real, os proximos passos seriam:

- API hospedada e banco PostgreSQL ou SQLite em servidor.
- Autenticacao e perfis de acesso para profissionais.
- Integracao oficial com WhatsApp Cloud API.
- Provedor de PIX com confirmacao real de pagamento.
- Politica de privacidade, termos de uso e LGPD.
- Agenda compartilhada para varios profissionais e unidades.
- Notificacoes automatizadas e observabilidade.

## Estrutura

```text
index.html        Pagina publica e reserva
painel.html       Painel demonstrativo
demo-store.js     Persistencia e regras locais
script.js         Fluxo da pagina publica
painel-demo.js    Funcionalidades do painel
styles.css        Estilos da pagina publica
painel.css        Estilos do painel
pix.css           Estilos da confirmacao PIX
```

## Aviso

Nao envie bancos locais, tokens, chaves PIX reais ou credenciais para um repositorio publico. Esta pasta ja exclui o backend Node.js e o banco SQLite usados durante o desenvolvimento local.

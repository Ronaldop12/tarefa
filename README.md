# Sistema Lista de Tarefas - Frontend

## Descrição
Este projeto é o frontend do sistema Lista de Tarefas, um sistema web que permite ao usuário criar, editar, excluir e reordenar tarefas.


## Campos
- **Identificador da tarefa** (chave primária)
- **Nome da tarefa:**
- Não deve permitir duplicidade.
- **Custo (R$):**
- Valor fracionário maior ou igual a zero.
- **Data limite:**
- Deve ser uma data válida.
- Exibida sempre no formato DD/MM/AAAA.
- **Ordem de apresentação** (campo numérico):
- Não repetido.
- Usado para ordenar os registros na tela.

## Funcionalidade
## Lista de Tarefas

- É a página principal do sistema.
- Lista todos os registros da tabela "Tarefas".
- Todos os campos, exceto "Ordem de apresentação", são apresentados.
- Ordenadas pelo campo "Ordem de apresentação".
- Tarefa com custo ≥ R$1.000,00 tem apresentação diferenciada (e.g., fundo amarelo).
- Dois botões ao lado de cada registro:
  - Editar
  - Excluir
- Botão para Incluir novo registro ao final da listagem.

## Excluir

- Exclui o registro da tarefa selecionada.
- Solicita confirmação (Sim/Não) antes da exclusão.

## Editar

- Edição de:
  - Nome da Tarefa
  - Custo
  - Data Limite
- Verificação de nome duplicado.
- Implementações possíveis:
  - Edição direta na tela principal.
  - Nova tela (popup) para edição.

## Incluir

- Inclusão de nova tarefa.
- Campos obrigatórios:
  - Nome da Tarefa
  - Custo
  - Data Limite
- Demais campos são gerados automaticamente.
- Novo registro é adicionado ao final.

## Reordenação das Tarefas

- Altera a ordem de apresentação.
- Implementações possíveis
  - Botões "subir" e "descer" em cada linha.
 
  ## Pré-requisitos
- Node.js (versão 16.14.0) e npm (Versão 8.3.1)
- Angular CLI (version 16.1.5)


## Clone o repositório
git clone https://github.com/Ronaldop12/tarefa-front.git

## Entre no diretório do projeto
cd tarefa-front

## Instale as dependências
npm install

## Execute o servidor de desenvolvimento
ng serve


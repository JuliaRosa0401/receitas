// script.js - Traduzido para Português e Atualizado com Limpeza

// Referências aos elementos importantes no DOM
// Obtemos referências aos elementos HTML usando seus IDs para manipulá-los no JavaScript.
const divIngredientes = document.getElementById('ingredients'); // Contêiner onde as linhas de ingredientes ficam
const divResposta = document.getElementById('response'); // Contêiner onde a receita/resposta é exibida
const btnGerarReceita = document.getElementById('generate-recipe-btn'); // Botão Gerar Receita para gerenciar estado (desabilitar/habilitar)
const btnLimparCampos = document.getElementById('clear-ingredients-btn'); // NOVO: Referência ao botão Limpar Campos

/**
 * @function atualizarBotoesRemover
 * @description Habilita ou desabilita os botões de remoção de ingredientes
 * com base na quantidade de campos de ingrediente na lista.
 * Propósito: Garantir que haja sempre pelo menos 3 campos (o número inicial) não removíveis,
 * impedindo que o usuário exclua todos os inputs.
 */
function atualizarBotoesRemover() {
    // Seleciona todos os botões com a classe .btn-danger dentro de um elemento .ingredient-row.
    // Querying dentro de divIngredientes é mais eficiente do que em todo o documento.
    const botoesRemover = divIngredientes.querySelectorAll('.ingredient-row .btn-danger');
    // Seleciona todas as divs que representam linhas de ingrediente para contar.
    const linhasIngrediente = divIngredientes.querySelectorAll('.ingredient-row');
    // Obtém a contagem atual de linhas de ingrediente.
    const contadorLinhas = linhasIngrediente.length;

    // Itera sobre cada botão "Excluir" encontrado.
    botoesRemover.forEach(botao => {
        // Define a propriedade 'disabled' do botão: será true se o contador de linhas for <= 3,
        // e false se for > 3. As classes Tailwind 'disabled:...' cuidam da aparência.
        botao.disabled = contadorLinhas <= 3;
    });

    // Log opcional para debug no console do navegador.
    // console.log(`[atualizarBotoesRemover] Contagem: ${contadorLinhas}. Botões Remover desabilitados: ${contadorLinhas <= 3}.`);
}

/**
 * @function adicionarIngrediente
 * @description Cria e adiciona dinamicamente um novo campo de input para ingrediente
 * junto com um botão "Excluir" associado ao contêiner de ingredientes no DOM.
 */
function adicionarIngrediente() {
    // console.log('[adicionarIngrediente] Adicionando novo ingrediente...');

    // 1. Cria o elemento 'div' que envolverá o input e o botão (a "linha" do ingrediente).
    const linhaIngredienteDiv = document.createElement('div');
    // Adiciona as classes Tailwind para layout flex, alinhamento e espaçamento.
    linhaIngredienteDiv.className = 'ingredient-row flex items-center space-x-2'; // Reusa as classes da estrutura HTML inicial

    // 2. Cria o elemento 'input' para o nome do ingrediente.
    const novoInput = document.createElement('input');
    // Define o tipo do input como 'text'.
    novoInput.type = 'text';
    // Adiciona as classes Tailwind para estilização (padding, borda, arredondamento, foco)
    // e classes de identificação ('ingredient', 'ingredient-input').
    novoInput.className = 'ingredient ingredient-input flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700';
    // Define o texto que aparece no input quando está vazio.
    novoInput.placeholder = `Informe um ingrediente culinário...`;

    // 3. Cria o elemento 'button' para remover a linha do ingrediente.
    const botaoRemover = document.createElement('button');
     // Adiciona as classes Tailwind para estilização (fundo, hover, texto, padding, arredondamento, estado disabled)
    botaoRemover.className = 'btn-danger bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 text-sm';
    // Define o texto visível no botão.
    botaoRemover.innerText = 'Excluir';

    // Anexa um event listener de 'click' ao botão "Excluir" recém-criado.
    // Quando clicado, chama a função `removerIngrediente`, passando o próprio botão como argumento.
    // Usamos uma arrow function `() => removerIngrediente(botaoRemover)` para garantir que `removerIngrediente`
    // seja chamada no momento do click e receba o `botaoRemover` correto, mesmo dentro do loop ou contexto de criação.
    botaoRemover.addEventListener('click', () => removerIngrediente(botaoRemover));
    // console.log('[adicionarIngrediente] Event listener adicionado ao botão Excluir.');

    // 4. Monta a nova linha: anexa o input e o botão como filhos da div da linha.
    linhaIngredienteDiv.appendChild(novoInput);
    linhaIngredienteDiv.appendChild(botaoRemover);

    // 5. Adiciona a nova linha completa (div com input e botão) ao contêiner principal de ingredientes no DOM.
    divIngredientes.appendChild(linhaIngredienteDiv);
    // console.log('[adicionarIngrediente] Nova linha anexada ao contêiner principal.');

    // 6. Após adicionar um novo campo, reavalia e atualiza o estado dos botões "Excluir".
    atualizarBotoesRemover();
    // console.log('[adicionarIngrediente] atualizarBotoesRemover chamado.');
}

/**
 * @function removerIngrediente
 * @description Remove a div que contém o campo de input e o botão "Excluir"
 * associada ao botão "Excluir" que foi clicado.
 * @param {HTMLButtonElement} botao - O botão "Excluir" (o elemento HTML) que acionou a remoção.
 */
function removerIngrediente(botao) {
    // console.log('[removerIngrediente] Removendo ingrediente...');
    // Obtém o elemento pai do botão clicado, que é a div 'ingredient-row'.
    const linhaIngrediente = botao.parentElement;
    // Verifica se o elemento pai foi encontrado antes de tentar removê-lo.
    if (linhaIngrediente) {
        // Remove a div da linha de ingrediente (e seus filhos) do DOM.
        linhaIngrediente.remove(); // Método moderno para remover um elemento.
        // console.log('[removerIngrediente] Linha do ingrediente removida do DOM.');
    } else {
        // Log de erro caso algo inesperado aconteça e o pai não seja encontrado.
        console.error('[removerIngrediente] Não foi possível encontrar o elemento pai (ingredient-row) para remover.');
    }
    // Após remover um campo, reavalia e atualiza o estado dos botões "Excluir".
    atualizarBotoesRemover();
    // console.log('[removerIngrediente] atualizarBotoesRemover chamado.');
}

/**
 * @function limparCamposIngredientes
 * @description Percorre todos os campos de input de ingredientes existentes no DOM
 * e define o valor de cada um como vazio.
 */
function limparCamposIngredientes() {
    console.log('[limparCamposIngredientes] Limpando campos...');
    // Seleciona todos os inputs de ingrediente dentro do contêiner divIngredientes.
    const inputs = divIngredientes.querySelectorAll('.ingredient-row .ingredient-input');
    // Itera sobre a lista de inputs encontrada.
    inputs.forEach(input => {
        // Define o valor atual do input como uma string vazia.
        input.value = '';
    });
    console.log('[limparCamposIngredientes] Campos limpos.');
}


/**
 * @function renderizarReceita
 * @description Constrói dinamicamente o HTML da receita a partir de um objeto JSON
 * retornado pela API e o exibe na área de resposta designada.
 * @param {object} dadosReceita - O objeto JSON contendo os dados da receita (título, porcionamento, tempo, ingredientes, modo de fazer).
 * Espera a seguinte estrutura: `{ titulo: string, porcionamento: string, tempo_de_preparo: string, ingredientes: string[], modo_de_fazer: string[] }`.
 */
function renderizarReceita(dadosReceita) {
    // Primeira validação: Verifica se os dados recebidos para renderização têm o formato básico esperado.
    if (!dadosReceita || typeof dadosReceita !== 'object' || !dadosReceita.titulo || !Array.isArray(dadosReceita.ingredientes) || !Array.isArray(dadosReceita.modo_de_fazer)) {
        console.error("Erro ao renderizar: Dados da receita no formato inesperado.", dadosReceita);
        // Exibe uma mensagem de erro específica caso os dados passados para a função `renderizarReceita` estejam incorretos.
        divResposta.innerHTML = '<p class="text-red-600 font-semibold">Erro ao renderizar a receita recebida.</p>';
        divResposta.classList.add('text-red-600'); // Adiciona classe Tailwind para cor vermelha.
        // Garante que as classes de layout da área de resposta estejam corretas.
        divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-xl mx-auto';
        return; // Sai da função se os dados não forem válidos para renderizar.
    }

    // Começa a construir o HTML usando template literals (strings que permitem multilinha e interpolação ${}).
    let htmlReceita = `
        <h2 class="text-2xl font-bold mb-4 text-gray-800">${dadosReceita.titulo}</h2>
    `;

    // Adiciona informações de porcionamento e tempo de preparo, com ícones.
    // Verifica se as propriedades existem antes de adicioná-las ao HTML.
    if (dadosReceita.porcionamento || dadosReceita.tempo_de_preparo) {
         htmlReceita += `
            <div class="flex items-center text-gray-700 mb-4 space-x-4">
                ${dadosReceita.porcionamento ? `<p class="flex items-center"><span class="mr-2 text-xl">🍽️</span> ${dadosReceita.porcionamento}</p>` : ''}
                ${dadosReceita.tempo_de_preparo ? `<p class="flex items-center"><span class="mr-2 text-xl">⏱️</span> ${dadosReceita.tempo_de_preparo}</p>` : ''}
            </div>
        `;
    }

    // Adiciona a seção de ingredientes.
    // Verifica se o array de ingredientes existe e não está vazio antes de criar a lista HTML.
    if (dadosReceita.ingredientes && dadosReceita.ingredientes.length > 0) {
         htmlReceita += `
            <h3 class="text-xl font-semibold mb-2 text-gray-700">Ingredientes:</h3>
            <ul class="list-disc list-inside text-gray-700 mb-4">
        `;
        // Itera sobre o array de ingredientes, mapeia cada ingrediente para um item de lista <li> HTML
        // e junta todos os itens de lista em uma única string.
         htmlReceita += dadosReceita.ingredientes.map(ingrediente => `<li class="mb-1">${ingrediente}</li>`).join('');
         htmlReceita += `</ul>`; // Fecha a tag <ul>
    }

    // Adiciona a seção de modo de fazer (instruções).
    // Verifica se o array de passos existe e não está vazio antes de criar a lista ordenada HTML.
    if (dadosReceita.modo_de_fazer && dadosReceita.modo_de_fazer.length > 0) {
        htmlReceita += `
            <h3 class="text-xl font-semibold mb-2 text-gray-700">Modo de Fazer:</h3>
            <ol class="list-decimal list-inside text-gray-700 space-y-2">
        `;
        // Itera sobre o array de passos, mapeia cada passo para um item de lista ordenada <li> HTML
        // e junta todos os itens de lista em uma única string.
        htmlReceita += dadosReceita.modo_de_fazer.map(passo => `<li>${passo}</li>`).join('');
        htmlReceita += `</ol>`; // Fecha a tag <ol>
    }

    // Define o conteúdo HTML interno da área de resposta com o HTML construído.
    divResposta.innerHTML = htmlReceita;
    // Remove a classe de cor vermelha caso ela tenha sido adicionada por um erro anterior.
    divResposta.classList.remove('text-red-600');
}

/**
 * @function enviarFormulario
 * @description Coleta os ingredientes dos campos de input, valida se há pelo menos 3,
 * envia os dados para a API do back-end Flask usando Fetch API,
 * processa a resposta (receita em JSON ou erro) e exibe o resultado na tela.
 * É uma função assíncrona (`async`) pois contém operações que esperam (`await`),
 * como a requisição de rede.
 */
async function enviarFormulario() {
    console.log('[enviarFormulario] Processando e enviando formulário...');

    // Desabilita o botão "Gerar Receita" para evitar múltiplos cliques enquanto a requisição está em andamento.
    btnGerarReceita.disabled = true;
    // Altera o texto do botão para dar feedback visual ao usuário.
    btnGerarReceita.innerHTML = 'Gerando...';

    // Limpa qualquer conteúdo anterior na área de resposta e mostra um indicador de carregamento.
    divResposta.innerHTML = 'Carregando...';
    // Garante que a área de resposta esteja visível removendo a classe 'hidden' do Tailwind.
    divResposta.classList.remove('hidden');
    // Opcional: Ajusta classes Tailwind para centralizar o texto de carregamento, se desejado.
    // divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-center max-w-xl mx-auto';


    // Seleciona todos os elementos de input de ingrediente no DOM.
    const inputsIngrediente = divIngredientes.querySelectorAll('.ingredient-row .ingredient-input');
    const ingredientes = []; // Inicializa um array para armazenar os valores dos ingredientes.

    // Itera sobre cada input de ingrediente encontrado.
    inputsIngrediente.forEach(input => {
        // Obtém o valor do input e remove espaços em branco no início/fim (`.trim()`).
        const valor = input.value.trim();
        // Verifica se o valor não está vazio após remover espaços.
        if (valor) {
            // Adiciona o valor (ingrediente) ao array.
            ingredientes.push(valor);
        }
    });

    console.log('[enviarFormulario] Ingredientes coletados:', ingredientes);

    // Validação mínima no frontend: Verifica se pelo menos 3 ingredientes foram preenchidos.
    // Esta é uma validação de User Experience (UX) para dar feedback imediato antes de chamar a API.
    // O backend também deve validar por segurança.
    if (ingredientes.length < 3) {
        alert('Por favor, preencha pelo menos três campos de ingrediente para gerar uma receita!');
        console.warn('[enviarFormulario] Validação falhou: Menos de 3 ingredientes.');
        // Oculta a área de resposta novamente se a validação falhar.
        divResposta.classList.add('hidden');
        // Reabilita o botão "Gerar Receita" e restaura seu texto.
        btnGerarReceita.disabled = false;
        btnGerarReceita.innerHTML = 'Gerar Receita';
        return; // Sai da função, interrompendo o processo de envio.
    }

    // Prepara os dados no formato de objeto JSON esperado pelo backend.
    const dados = {
        ingredientes: ingredientes
    };
    console.log('[enviarFormulario] Dados preparados para API:', dados);

    // Inicia um bloco `try...catch...finally` para gerenciar erros durante a requisição e processamento.
    try {
        console.log('[enviarFormulario] Enviando requisição para API...');
        // Usa a Fetch API para enviar a requisição assíncrona.
        // `await` pausa a execução da função `enviarFormulario` até que a Promise retornada por `fetch` seja resolvida.
        const resposta = await fetch('http://localhost:5000/receita', { // URL do endpoint da sua API Flask.
            method: 'POST', // Define o método HTTP como POST.
            headers: {
                // Define o cabeçalho Content-Type para informar ao servidor que o corpo da requisição é JSON.
                'Content-Type': 'application/json'
            },
            // Converte o objeto JavaScript `dados` em uma string JSON para enviar no corpo da requisição.
            body: JSON.stringify(dados)
        });

        console.log('[enviarFormulario] Resposta da API recebida (Status: ' + resposta.status + ').');

        // `await resposta.json()` tenta ler o corpo da resposta e parseá-lo como JSON.
        // Esta operação também é assíncrona e pode falhar se a resposta não for JSON válido.
        const resultado = await resposta.json();
        console.log('[enviarFormulario] Resposta JSON parseada:', resultado); // Loga o objeto/array resultante do parsing.

        // --- VERIFICAÇÃO AJUSTADA DA ESTRUTURA DA RESPOSTA ---
        // Variável para armazenar o objeto da receita se ele for encontrado e validado.
        let objetoReceita = null;

        // 1. Tenta encontrar e validar o objeto da receita SE o resultado for um Array contendo um objeto no índice 0.
        if (Array.isArray(resultado) && resultado.length > 0 && typeof resultado[0] === 'object' &&
            // Valida se o objeto no índice 0 tem as chaves e tipos esperados para uma receita.
            resultado[0].titulo && Array.isArray(resultado[0].ingredientes) && Array.isArray(resultado[0].modo_de_fazer)) {

            console.log('[enviarFormulario] Recebido Array com objeto de receita esperado no índice 0. Usando resultado[0].');
            objetoReceita = resultado[0]; // Associa o objeto encontrado dentro do array.

        }
        // 2. Caso contrário, tenta encontrar e validar o objeto da receita SE o resultado for diretamente um objeto.
        else if (resultado && typeof resultado === 'object' &&
                 // Valida se o objeto diretamente recebido tem as chaves e tipos esperados para uma receita.
                 resultado.titulo && Array.isArray(resultado.ingredientes) && Array.isArray(resultado.modo_de_fazer)) {

             console.log('[enviarFormulario] Recebido objeto de receita esperado diretamente. Usando resultado.');
             objetoReceita = resultado; // Associa o objeto direto.

        }
        // --- FIM DA VERIFICAÇÃO AJUSTADA ---


        // Agora, verifica se conseguimos encontrar e validar com sucesso um `objetoReceita` em um dos formatos esperados.
        if (objetoReceita) { // Se `objetoReceita` for um objeto válido (não null/undefined).
             console.log('[enviarFormulario] Objeto de receita válido encontrado. Renderizando.');
             // Chama a função `renderizarReceita`, passando o objeto validado para construir o HTML e exibi-lo.
             renderizarReceita(objetoReceita);
             // NOVO: Chama a função para limpar todos os campos de input de ingredientes após a geração bem-sucedida da receita.
             limparCamposIngredientes();
             // Garante que as classes da área de resposta estejam corretas (texto alinhado à esquerda, etc.) para a receita renderizada.
             divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-xl mx-auto';

        }
        // Verifica se o resultado parseado é um objeto que contém uma chave 'error' (formato de erro retornado pelo backend).
        else if (resultado && typeof resultado === 'object' && resultado.error) {
             console.error('[enviarFormulario] API retornou objeto de erro:', resultado.error);
             // Exibe a mensagem de erro retornada pelo backend na área de resposta.
             divResposta.innerHTML = `<p class="text-red-600 font-semibold">Erro da API: ${resultado.error}</p>`;
             divResposta.classList.add('text-red-600'); // Adiciona classe Tailwind para cor vermelha ao texto do erro.
             // Garante classes de layout corretas para exibição do erro.
             divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-xl mx-auto';

        }
        // Se nenhuma das verificações acima correspondeu, o formato da resposta da API é inesperado.
        else {
            console.error('[enviarFormulario] API retornou formato inesperado:', resultado);
            // Exibe uma mensagem de erro genérica informando sobre o formato inesperado.
            divResposta.innerHTML = '<p class="text-red-600 font-semibold">Erro: Formato de resposta inesperado da API.</p>';
            divResposta.classList.add('text-red-600'); // Adiciona classe para cor vermelha.
            // Garante classes de layout corretas para exibição do erro.
            divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-xl mx-auto';
        }

        // Torna a área de resposta visível (já foi feito no início, mas garante caso a classe 'hidden' fosse re-adicionada).
        divResposta.classList.remove('hidden');


    } catch (error) {
        // Este bloco `catch` é executado se ocorrer qualquer erro durante o bloco `try` que não foi tratado internamente,
        // como erros de rede (servidor offline, CORS bloqueado) ou falha ao parsear a resposta como JSON.
        console.error('[enviarFormulario] Erro no Fetch ou parsing JSON:', error);
        // Exibe uma mensagem de erro genérica na área de resposta com os detalhes do erro capturado.
        divResposta.innerHTML = `<p class="text-red-600 font-semibold">Ocorreu um erro ao tentar comunicar com o servidor: ${error.message}</p>`;
        divResposta.classList.add('text-red-600'); // Adiciona classe para cor vermelha.
        // Garante que as classes da área de resposta estejam corretas.
        divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-xl mx-auto';
        divResposta.classList.remove('hidden');

    } finally {
        // O bloco `finally` é executado SEMPRE, independentemente de ter ocorrido um erro ou não no bloco `try`.
        // É ideal para código de limpeza, como reabilitar botões ou esconder indicadores de carregamento.
        // Reabilita o botão "Gerar Receita".
        btnGerarReceita.disabled = false;
        // Restaura o texto original do botão.
        btnGerarReceita.innerHTML = 'Gerar Receita';
        console.log('[enviarFormulario] Finalizado.');
    }
}

/**
 * @description Este é o ponto de entrada principal do script. Ele espera o DOM carregar,
 * obtém referências aos botões e anexa os event listeners apropriados.
 */
// Adiciona um listener ao evento 'DOMContentLoaded'. Este evento é disparado quando o
// documento HTML foi completamente carregado e parseado (o DOM está pronto).
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM completamente carregado.');

    // Obtém a referência ao botão "Adicionar Ingrediente" pelo ID.
    const btnAdicionarIngrediente = document.getElementById('add-ingredient-btn');

    // Anexa um event listener de 'click' ao botão "Adicionar Ingrediente".
    // Quando clicado, a função `adicionarIngrediente` será executada.
    btnAdicionarIngrediente.addEventListener('click', adicionarIngrediente);
    console.log('Event listener adicionado ao botão "Adicionar Ingrediente".');

    // Anexa um event listener de 'click' ao botão "Gerar Receita".
    // Quando clicado, a função assíncrona `enviarFormulario` será executada.
    btnGerarReceita.addEventListener('click', enviarFormulario); // btnGerarReceita já foi obtido globalmente
    console.log('Event listener adicionado ao botão "Gerar Receita".');

     // NOVO: Anexa um event listener de 'click' ao botão "Limpar Campos".
    // Quando clicado, a função `limparCamposIngredientes` será executada.
    btnLimparCampos.addEventListener('click', limparCamposIngredientes); // btnLimparCampos já foi obtido globalmente
    console.log('Event listener adicionado ao botão "Limpar Campos".');


    // Seleciona todos os botões "Excluir" que já existem no HTML inicial quando a página carrega.
     const botoesRemoverIniciais = divIngredientes.querySelectorAll('.ingredient-row .btn-danger');
     // Itera sobre esses botões iniciais.
     botoesRemoverIniciais.forEach(botao => {
         // Anexa um event listener de 'click' a cada um deles.
         // A arrow function garante que `removerIngrediente` seja chamada com o botão clicado correto.
         botao.addEventListener('click', () => removerIngrediente(botao));
     });
     console.log('Event listeners adicionados aos botões "Excluir" iniciais.');

    // Chama a função `atualizarBotoesRemover` uma vez na inicialização.
    // Isso garante que os botões "Excluir" iniciais (que são 3) estejam desabilitados no carregamento da página.
    atualizarBotoesRemover();
    console.log('atualizarBotoesRemover chamado na inicialização.');
});
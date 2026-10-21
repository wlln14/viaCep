const formulario = document.querySelector("#formulario")
const campoCep = document.querySelector("#cep")
const campoRua = document.querySelector("#rua")
const campoBairro = document.querySelector("#bairro")
const campoCidade = document.querySelector("#cidade")
const campoEstado = document.querySelector("#estado")
const mensagem = document.querySelector("#mensagem")
const botao = document.querySelector("#botao")


async function consultarAPI(url) {
    const resposta = await fetch(url)
    if(!resposta.ok) {
        throw new Error(`Error HTTP: ${resposta.status}`)
    }
    
    const dados = await resposta.json()
    return dados
}

// exclusivo para a API (ViaCEP)
function preencherEndereco(dados) {
    campoRua.value = dados.logradouro || ""
    campoBairro.value = dados.bairro || ""
    campoCidade.value = dados.localidade || ""
    campoEstado.value = dados.uf || ""
}

async function buscarEndereco(evento) {
    evento.preventDefault() // evita recarregar a pagina ao enviar o form
    preencherEndereco({}) // limpa o resultado da consulta anterior
    
    // aceita o CEP com ou sem hifem
    const cep = campoCep.value.trim().replace("-","")

    if (!/^[0-9]{8}$/.test(cep)) {
        mensagem.textContent = "Digite um CEP com 8 números"
        return
    }

    mensagem.textContent = "Buscando..."
    botao.disabled = true
    campoCep.disabled = true

    try {
        const url = `https://viacep.com.br/ws/${cep}/json/`
        const dados = await consultarAPI(url)
        console.log(dados)

        //condição necessária, pois o ViaCEP responde HTTP 200
        //mesmo quando o cep não existe
        if(dados.erro) {
            throw new Error("Cep não encontrado.")
        }
        preencherEndereco(dados)
        mensagem.textContent = "Endereço encontrado!"
    } catch(erro) {
        mensagem.textContent = `Não foi possível consultar. ${erro.message}`
    } finally {
        botao.disabled = false
        campoCep.disabled = false
    }
}

formulario.addEventListener("submit", buscarEndereco)
const API_URL = "https://dummyjson.com/products"

let listaProdutos = []

let favoritos =
    JSON.parse(
        localStorage.getItem("favoritos")
    ) || []

let carrinho = []

async function carregarProdutos() {

    try {

        const resposta = await fetch(API_URL)

        const dados = await resposta.json()

        listaProdutos = [

            ...dados.products,

            {
                id: 1001,
                title: "Macbook Air Apple 13.6\" (Chip M2, 24GB RAM, SSD 512GB)",
                price: "2999,00",
                category: "Computadores",
                thumbnail: "img/Macbook_air.png"
            }
        ]


        renderProdutos(listaProdutos)

        renderFavoritos()

    } catch (erro) {

        console.error(erro)
    }
}

function renderProdutos(lista) {

    const areaProdutos =
        document.getElementById("produtos")

    areaProdutos.innerHTML = ""

    lista.forEach(produto => {

        const favorito =
            favoritos.includes(produto.id)

        areaProdutos.innerHTML += `

            <div class="col-md-4">

                <div class="
                    card
                    card-produto
                    h-100
                    ${favorito ? "favorito" : ""}
                ">

                    <img
                        src="${produto.thumbnail}"
                        class="card-img-top imagem-produto"
                    >

                    <div class="card-body">

                        <h5>${produto.title}</h5>

                        <p>${produto.category}</p>

                        <p class="fw-bold">
                            R$ ${produto.price}
                        </p>

                        <button
                            class="btn btn-primary"
                            onclick="toggleFavorito(${produto.id})"
                        >
                            ⭐
                        </button>

                        <button
                           class="btn btn-success btn-carrinho"
                            onclick="adicionarCarrinho(${produto.id})"
                        >
                            🛒
                        </button>

                    </div>

                </div>

            </div>
        `
    })
}

document
    .getElementById("busca")
    .addEventListener("input", function (evento) {

        const texto =
            evento.target.value.toLowerCase()

        const filtrados =
            listaProdutos.filter(produto =>

                produto.title
                    .toLowerCase()
                    .includes(texto)
            )

        renderProdutos(filtrados)
    })

function toggleFavorito(id) {

    if (favoritos.includes(id)) {

        favoritos =
            favoritos.filter(
                item => item !== id
            )

    } else {

        favoritos.push(id)
    }

    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
    )

    renderProdutos(listaProdutos)

    renderFavoritos()
}

function renderFavoritos() {

    const area =
        document.getElementById("favoritos-row")

    area.innerHTML = ""

    const lista =
        listaProdutos.filter(produto =>
            favoritos.includes(produto.id)
        )

    lista.forEach(produto => {

        area.innerHTML += `

            <div class="col-md-4">

                <div class="card favorito">

                    <div class="card-body">

                        <h5>${produto.title}</h5>

                    </div>

                </div>

            </div>
        `
    })
}

function adicionarCarrinho(id) {

    const produto =
        listaProdutos.find(
            produto => produto.id === id
        )

    carrinho.push(produto)

    renderCarrinho()
}

function renderCarrinho() {

    const area =
        document.getElementById("carrinho-row")

    const total =
        document.getElementById("total")

    area.innerHTML = ""

    let soma = 0

    carrinho.forEach((produto, index) => {

        const preco = Number(String(produto.price).replace(',', '.')) || 0

        soma += preco

        area.innerHTML += `

            <div class="col-md-4">

                <div class="card">

                    <div class="card-body">

                        <h5>${produto.title}</h5>

                        <p>R$ ${preco.toFixed(2).replace('.', ',')}</p>

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="removerDoCarrinho(${index})"
                        >
                            Remover
                        </button>

                    </div>

                </div>

            </div>
        `
    })

    total.innerHTML = `Total: R$ ${soma.toFixed(2).replace('.', ',')}`
}

function removerDoCarrinho(index) {

    if (index < 0 || index >= carrinho.length) return

    carrinho.splice(index, 1)

    renderCarrinho()
}

function finalizarCompra() {

    if (carrinho.length === 0) {

        alert("Carrinho vazio!")

        return
    }

    alert("✅ Compra realizada com sucesso!")

    carrinho = []

    renderCarrinho()
}

carregarProdutos()
const Modal = {
    open() {
        // Abrir modal
        // Adicionar a class active ao modal
        document.querySelector('.modal-overlay').classList.add('active')
    },
    close() {
        // Fechar o modal
        //Remover a class active do modal
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}



// tabela

/* const transactions = [{
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021',
    },

    {
        description: 'Website',
        amount: 500000,
        date: '23/01/2021',
    },

    {
        description: 'Internet',
        amount: -20000,
        date: '23/01/2021',
    },
]
 */

//Adicionando valores à tabela

// Somar as entradas
// Somar as saídas
// Subtrair entradas e saídas 
// Encontrar o total


const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) ||
        []
    },

    set(transactions){
        localStorage.setItem("dev.finances:transactions", 
        JSON.stringify(transactions))
    }
}




const Transaction = {
    all: Storage.get(), 
    
    /* [
        {
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021',
    },

    {
        description: 'Website',
        amount: 500000,
        date: '23/01/2021',
    },

    {
        description: 'Internet',
        amount: -20000,
        date: '23/01/2021',
    },
],
 */
    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0;
        // pegar todas as transações
        Transaction.all.forEach(function(transaction){
            // para cada transação, verificar se ela é positiva

            if(transaction.amount > 0 ){
                // se sim, somar a uma variável e retornar a variável

                income += transaction.amount;
            }
        }) 
        return income;
    },
    expenses() {
        let expense = 0;
        // pegar todas as transações
        Transaction.all.forEach(function(transaction){
            // para cada transação, verificar se ela é negativa

            if(transaction.amount < 0){
                // se sim, somar a uma variável e retornar a variável

                expense += transaction.amount;
            }
        })             
        return expense;
    },

    total() {
        return Transaction.incomes() + Transaction.expenses();
    }
}


// Substituir os dados do HTML com os dados do JS

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction,index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },


    innerHTMLTransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt=" Image Remover transação">
            </td>

         `
        return html
    },

    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML =  Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}


const Utils = {

    formatAmount(value){

        //Outra maneira utilizando regex
        // value = Number(value.replace(/\,\./g,"")) * 100
        value = Number(value) * 100
        return value

    },

    formatDate(date){
        const splittedDate = date.split('-')

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? '-' : ''

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),


    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validadeFields(){
        const {description, amount, date} = Form.getValues()

        if(description.trim() === '' || amount.trim() === '' || date.trim()=== ''){
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues(){
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return{
            description,
            amount,
            date
        }
    },

    saveTransaction(transaction){
        Transaction.add(transaction)
    },

    clearFields(){
        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value = ''
    },


    submit(event){
        event.preventDefault()

        try {
            Form.validadeFields()
            // formatar os dados para salvar
            const transaction = Form.formatValues()
            // salvar
            Form.saveTransaction(transaction)
            // apagar os dados do formulário
            Form.clearFields()
            // modal fechar
            Modal.close()
        }
        catch (error){
            alert(error.message)
        }
        // verificar se todas as informações foram preenchidas
       
    }
}


const App = {
    init(){

        Transaction.all.forEach(function(transaction, index){
            DOM.addTransaction(transaction,index)
        })
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()









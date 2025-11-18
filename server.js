const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const userController = require('./controllers/userController');
const isAuth = require('./middleware/auth'); 
const authController = require('./controllers/authController');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

// [CRUCIAL AULA 17] Middleware para ler dados de formulários (req.body)
// Sem isso, o req.body nos POSTs será undefined.
app.use(express.urlencoded({ extended: true }));

// Configuração do Middleware de Sessão (Aula 18)
app.use(session({
    secret: 'segredo-do-capitao-black', 
    resave: false,
    saveUninitialized: false, 
    cookie: { secure: false }
}));

// 2. Conectar ao MongoDB 
mongoose.connect('mongodb://127.0.0.1:27017/arquiteturaWeb')
  .then(() => console.log('🔥 Conectado ao MongoDB!'))
  .catch(err => console.error('Erro ao conectar no Mongo:', err));

// --- ROTAS PÚBLICAS (AUTH) ---
// Rota de Login (Passa query params para a View para exibir erros)
app.get('/login', (req, res) => {
    // Acessa os parâmetros 'erro' ou 'sucesso' da URL (Query String)
    res.render('login', { erro: req.query.erro, sucesso: req.query.sucesso });
});
app.post('/login', authController.login);
app.get('/logout', authController.logout);

// Rotas de REGISTRO
app.get('/register', authController.getRegisterForm);
app.post('/register', authController.registerUser);


// --- ROTAS PROTEGIDAS (CRUD) ---
app.get('/', (req, res) => res.redirect('/users'));

// Rotas protegidas pelo Middleware isAuth[cite: 1673]:
app.get('/users', isAuth, userController.getAllUsers);

// ⚠️ Rotas de Criação (Substituímos o antigo createNewUser pelo fluxo de registro)
// Se você quer manter um form de criação DENTRO da área ADMIN:
app.get('/users/new', isAuth, userController.getNewUserForm); 
// Se for para criar um novo membro (o POST disso é o createNewUser original):
app.post('/users', userController.createNewUser); 


// --- ROTAS PARA CRUD AVANÇADO ---
// Rota para DELETAR
app.post('/users/delete/:id', isAuth, userController.deleteUser); // Adicionei isAuth aqui

// Rotas para EDITAR
app.get('/users/edit/:id', isAuth, userController.getEditUserForm); // Adicionei isAuth aqui
app.post('/users/update/:id', isAuth, userController.updateUser); // Adicionei isAuth aqui


app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
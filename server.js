// ========================================
// TRABALHO 4: SERVIDOR COM DEFESAS ARQUITETURAIS
// ========================================

require('dotenv').config(); // [TAREFA 3B] Carregar variáveis de ambiente

const express = require('express');
const session = require('express-session'); 
const mongoose = require('mongoose');
const helmet = require('helmet'); // [TAREFA 3A] Proteção de Headers
const csrf = require('csurf'); // [TAREFA 4] Proteção CSRF
const rateLimit = require('express-rate-limit'); // [TAREFA 2] Rate Limiting

const userController = require('./controllers/userController');
const isAuth = require('./middleware/auth');
const authController = require('./controllers/authController');

const app = express();

// ========================================
// [TAREFA 3A] HELMET - Proteção de HTTP Headers
// Deve ser o PRIMEIRO middleware
// ========================================
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"], // Permite CSS inline
            scriptSrc: ["'self'"]
        }
    }
}));

// ========================================
// CONFIGURAÇÃO DE VIEWS
// ========================================
app.set('view engine', 'ejs');
app.set('views', './views');

// [CRUCIAL] Middleware para ler dados de formulários (req.body)
app.use(express.urlencoded({ extended: true }));

// ========================================
// [TAREFA 3B] CONFIGURAÇÃO DE SESSÃO COM VARIÁVEIS DE AMBIENTE
// ========================================
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-change-me', 
    resave: false, 
    saveUninitialized: false, 
    cookie: { 
        secure: false, // Em produção com HTTPS, mudar para true
        httpOnly: true, // Proteção contra XSS via JavaScript
        maxAge: 3600000 // 1 hora
    }
}));

// ========================================
// [TAREFA 4] PROTEÇÃO CSRF
// ========================================
const csrfProtection = csrf({ cookie: false }); // Usa sessão, não cookies

// Middleware global para passar o token CSRF para todas as views
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken ? req.csrfToken() : null;
    next();
});

// ========================================
// [TAREFA 2] RATE LIMITING PARA LOGIN
// Proteção contra Força Bruta
// ========================================
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 5, // Máximo 5 tentativas
    message: 'Muitas tentativas de login. Tente novamente em 1 minuto.',
    standardHeaders: true,
    legacyHeaders: false,
    // Customizar resposta para redirecionar em vez de JSON
    handler: (req, res) => {
        res.redirect('/login?erro=rate_limit');
    }
});

// ========================================
// [TAREFA 3B] CONEXÃO COM MONGODB (Variável de Ambiente)
// ========================================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/arquiteturaWeb')
    .then(() => console.log('🔥 Conectado ao MongoDB!'))
    .catch(err => console.error('Erro ao conectar no Mongo:', err));

// ========================================
// ROTAS PÚBLICAS (LOGIN/LOGOUT/REGISTRO)
// ========================================

// Rota de Login (GET) - COM CSRF
app.get('/login', csrfProtection, (req, res) => {
    res.render('login', { 
        erro: req.query.erro, 
        sucesso: req.query.sucesso,
        csrfToken: req.csrfToken()
    });
});

// Rota de Login (POST) - COM RATE LIMITING E CSRF
app.post('/login', loginLimiter, csrfProtection, authController.login);

// Logout
app.get('/logout', authController.logout);

// Rotas de REGISTRO PÚBLICO - COM CSRF
app.get('/register', csrfProtection, authController.getRegisterForm);
app.post('/register', csrfProtection, authController.registerUser);

// ========================================
// ROTAS PROTEGIDAS (CRUD) - TODAS COM CSRF
// ========================================
app.get('/', (req, res) => res.redirect('/users'));

// Listar usuários (protegida por autenticação)
app.get('/users', isAuth, userController.getAllUsers);

// Formulário de novo usuário (protegida + CSRF)
app.get('/users/new', isAuth, csrfProtection, userController.getNewUserForm);

// DELETAR usuário (protegida + CSRF)
app.post('/users/delete/:id', isAuth, csrfProtection, userController.deleteUser);

// EDITAR usuário - Formulário (protegida + CSRF)
app.get('/users/edit/:id', isAuth, csrfProtection, userController.getEditUserForm);

// EDITAR usuário - Salvar (protegida + CSRF)
app.post('/users/update/:id', isAuth, csrfProtection, userController.updateUser);

// ========================================
// INICIAR SERVIDOR
// ========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));

// controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
// Não se esqueça de que o 'express-session' nos dá o objeto req.session automaticamente!

// --- Lógica de Login (POST) ---
const login = async (req, res) => {
  const { email, senha } = req.body; 

  try {
    // 1. Buscar o usuário no Model
    const user = await User.findOne({ email: email });
    
    // 2. Tratar usuário não encontrado
    if (!user) {
      return res.redirect('/login?erro=usuario_nao_encontrado'); 
    }

    // 3. Comparar a senha (usando o hash guardado)
[cite_start]    const isMatch = await bcrypt.compare(senha, user.password); [cite: 919]
    
    // 4. Tratar senha incorreta
    if (!isMatch) {
      return res.redirect('/login?erro=senha_incorreta');
    }

    // 5. Autenticação bem-sucedida! Criar a Sessão
    req.session.userId = user._id; // Guardamos o ID do usuário na sessão
    req.session.userName = user.nome; // Guardamos o nome
    
    // 6. Redirecionar para a área protegida (PRG Pattern)
    return res.redirect('/users');
    
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).send("Erro interno no servidor.");
  }
};

// --- Lógica de Logout (GET) ---
const logout = (req, res) => {
[cite_start]  req.session.destroy(err => { // O express-session destrói a sessão no servidor [cite: 976]
    if (err) {
      console.error('Erro ao destruir sessão:', err);
    }
    
    // Opcional: Limpar o cookie no navegador
    res.clearCookie('connect.sid'); 
    
    // Redireciona para a página de login
    res.redirect('/login');
  });
};

// --- Lógica de Registro (GET: Renderizar form) ---
const getRegisterForm = (req, res) => {
    res.render('register');
};

// --- Lógica de Registro (POST: Criar usuário) ---
const registerUser = async (req, res) => {
    const { nome, email, senha, cargo } = req.body;
    
    try {
        // [SEGURANÇA] Hashing da senha 
        const hashedPassword = await bcrypt.hash(senha, 10); 

        // Cria e salva o novo usuário no MongoDB
        await User.create({
            nome,
            email,
[cite_start]            password: hashedPassword, // Salva o hash, nunca o texto puro! [cite: 836]
            cargo
        });
        
        // PRG Pattern: Redirecionar para a página de login com sucesso
        res.redirect('/login?sucesso=cadastro');

    } catch (error) {
        // Tratar erro de e-mail duplicado (código 11000 do MongoDB)
        if (error.code === 11000) {
            return res.redirect('/register?erro=email_existente');
        }
        console.error("Erro ao registrar usuário:", error);
        return res.status(500).send("Erro interno ao registrar.");
    }
};

// ----------------------------------------------------------------------------------
// CORREÇÃO: Exporta todas as funções de uma vez só.
module.exports = { 
    login, 
    logout, 
    getRegisterForm, 
    registerUser 
};
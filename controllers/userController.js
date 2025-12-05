// controllers/userController.js
// [TAREFA 1A] Mongoose usa Queries Parametrizadas, protegendo contra SQLi

const User = require('../models/User');

const userController = {

  // READ: Buscar todos (Esta rota é protegida pelo middleware isAuth no server.js)
  getAllUsers: async (req, res) => {
    try {
      // Captura o nome do usuário logado da sessão
      const loggedInUserName = req.session.userName;

      // [TAREFA 1A] Mongoose usa Queries Parametrizadas automaticamente
      // Não há concatenação de strings SQL, portanto está protegido contra SQLi
      const users = await User.find(); 

      // Passa a lista de usuários E o nome do usuário logado para a View
      // O csrfToken é passado via res.locals no server.js
      res.render('usersList', { 
        usuarios: users,
        userName: loggedInUserName
      });
    } catch (error) {
      res.status(500).send("Erro ao buscar usuários: " + error.message);
    }
  },

  // Renderizar form de criação 
  getNewUserForm: (req, res) => {
    // O csrfToken é passado automaticamente via res.locals
    res.render('formUsuario');
  },

  // --- DELETE ---
  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      
      // [TAREFA 1A] Mongoose usa Queries Parametrizadas
      // O id é tratado como valor, não como comando SQL
      await User.findByIdAndDelete(id); 
      
      res.redirect('/users');
    } catch (error) {
      res.status(500).send("Erro ao deletar: " + error.message);
    }
  },

  // --- UPDATE (Parte 1 - Mostrar o Form Preenchido) ---
  getEditUserForm: async (req, res) => {
    try {
      const id = req.params.id;
      
      // [TAREFA 1A] Mongoose usa Queries Parametrizadas
      const user = await User.findById(id); 
      
      if (!user) {
        return res.status(404).send("Usuário não encontrado");
      }
      
      // O csrfToken é passado automaticamente via res.locals
      res.render('editUsuario', { user: user });
    } catch (error) {
      res.status(500).send("Erro ao buscar para editar: " + error.message);
    }
  },

  // --- UPDATE (Parte 2 - Salvar Alteração) ---
  updateUser: async (req, res) => {
    try {
      const id = req.params.id;
      
      // [TAREFA 1A] Mongoose trata os dados como valores
      // Validação básica dos campos
      const dadosAtualizados = {
        nome: req.body.nome_usuario,
        cargo: req.body.cargo_usuario
      };

      // Validação simples
      if (!dadosAtualizados.nome || !dadosAtualizados.cargo) {
        return res.status(400).send("Nome e cargo são obrigatórios");
      }
      
      // [TAREFA 1A] Mongoose usa Queries Parametrizadas
      await User.findByIdAndUpdate(id, dadosAtualizados);
      
      res.redirect('/users');
    } catch (error) {
      res.status(500).send("Erro ao atualizar: " + error.message);
    }
  }
};

module.exports = userController;

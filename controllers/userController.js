const User = require('../models/User');
// **AVISO:** O import do bcrypt foi removido, pois ele deve ser usado apenas no authController.

const userController = {

  // READ: Buscar todos (Esta rota é protegida pelo middleware isAuth no server.js)
  getAllUsers: async (req, res) => {
    try {
      // O Mongoose busca no banco (aguarda a promessa)
      const users = await User.find(); 
      // Você pode usar 'req.session.userName' aqui para personalizar a view!
      res.render('usersList', { usuarios: users });
    } catch (error) {
      res.status(500).send("Erro ao buscar usuários: " + error.message);
    }
  },

  // Renderizar form de criação (Mantido para criar um usuário **APÓS LOGIN**, se for o caso)
  // NOTA: Se este form for para **registro público**, ele deve ser renderizado por authController.getRegisterForm.
  getNewUserForm: (req, res) => {
    res.render('formUsuario');
  },

  // **MÉTODO createNewUser FOI REMOVIDO.**
  // Motivo: A lógica de Hashing e Registro de novo usuário foi movida para 
  // o método 'registerUser' dentro do 'authController.js' para garantir a 
  // Separação de Responsabilidades.

  // --- DELETE ---
  deleteUser: async (req, res) => {
    try {
      const id = req.params.id; // Pega o ID da URL
      await User.findByIdAndDelete(id); // Mongoose remove pelo ID
      res.redirect('/users');
    } catch (error) {
      res.status(500).send("Erro ao deletar: " + error.message);
    }
  },

  // --- UPDATE (Parte 1 - Mostrar o Form Preenchido) ---
  getEditUserForm: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id); // Busca o usuário para preencher os inputs
      res.render('editUsuario', { user: user });
    } catch (error) {
      res.status(500).send("Erro ao buscar para editar");
    }
  },

  // --- UPDATE (Parte 2 - Salvar Alteração) ---
  updateUser: async (req, res) => {
    try {
      const id = req.params.id;
      const dadosAtualizados = {
        nome: req.body.nome_usuario,
        cargo: req.body.cargo_usuario
      };
      // Busca pelo ID e atualiza
      await User.findByIdAndUpdate(id, dadosAtualizados);
      res.redirect('/users');
    } catch (error) {
      res.status(500).send("Erro ao atualizar");
    }
  }
};

module.exports = userController;
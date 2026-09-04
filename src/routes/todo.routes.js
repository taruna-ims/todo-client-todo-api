const express = require('express');
const {
  listTodos,
  getTodo,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
} = require('../controller/todo.controller');
const {
  validateObjectId,
  validateCreate,
  validateUpdate,
} = require('../middleware/validate');

const router = express.Router();


router
  .route('/')
  .get(listTodos)
  .post(validateCreate, createTodo);

router
  .route('/:id')
  .all(validateObjectId) 
  .get(getTodo)
  .put(validateUpdate, updateTodo)
  .delete(deleteTodo)

router.patch('/:id/toggle', validateObjectId, toggleTodo);

module.exports = router;

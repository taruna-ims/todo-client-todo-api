const Todo = require("../models/todo");

const { asyncHandler, ApiError } = require("../utils");


// GET ALL TODOS
const listTodos = asyncHandler(async (req, res) => {
  const page = Math.max(
    parseInt(req.query.page, 10) || 1,
    1
  );

  const limit = Math.min(
    Math.max(parseInt(req.query.limit, 10) || 20, 1),
    100
  );

  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.completed === "true") {
    filter.completed = true;
  }

  if (req.query.completed === "false") {
    filter.completed = false;
  }

  if (req.query.search) {
    filter.title = {
      $regex: req.query.search,
      $options: "i",
    };
  }

  const [todos, total] = await Promise.all([
    Todo.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Todo.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: todos,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});



// GET ONE TODO
const getTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  res.json({
    success: true,
    data: todo,
  });
});



// CREATE TODO
const createTodo = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    dueDate,
  } = req.body;

  const todo = await Todo.create({
    title,
    description,
    dueDate,
  });

  res.status(201).json({
    success: true,
    data: todo,
  });
});



// UPDATE TODO
const updateTodo = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    completed,
    dueDate,
  } = req.body;

  const updates = {};

  if (title !== undefined) {
    updates.title = title;
  }

  if (description !== undefined) {
    updates.description = description;
  }

  if (completed !== undefined) {
    updates.completed = completed;
  }

  if (dueDate !== undefined) {
    updates.dueDate = dueDate;
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(
      400,
      "No valid fields provided to update"
    );
  }

  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  res.json({
    success: true,
    data: todo,
  });
});




// TOGGLE TODO
const toggleTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  todo.completed = !todo.completed;

  await todo.save();

  res.json({
    success: true,
    data: todo,
  });
});




// DELETE TODO
const deleteTodo = asyncHandler(async (req, res) => {
  console.log("DELETE ID:", req.params.id);

  const todo = await Todo.findByIdAndDelete(
    req.params.id
  );

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
    data: {
      id: req.params.id,
    },
  });
});


module.exports = {
  listTodos,
  getTodo,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
};
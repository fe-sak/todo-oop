class Board {
  constructor({ id, title, tasks }) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
  }

  onBoardTitleClick() {
    const newTitle = prompt('Novo titulo do board');
    if (!newTitle) {
      alert('Insira o novo título!');
      return;
    }

    const boardTitleElement = document.querySelector(`[data-board-id="${this.id}"] .board-title`);
    boardTitleElement.textContent = newTitle;
  }

  onAddTask(newTaskName) {
    const task = new Task({
      id: getNextTaskId(this.tasks),
      name: newTaskName,
      completed: false,
    });
    this.tasks.push(task);

    const tasksContainer = document.querySelector(`[data-board-id="${this.id}"] .tasks`);
    const taskContainer = getTaskView(this, task);
    tasksContainer.appendChild(taskContainer);
  }

  onDeleteTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);

    const taskContainer = document.querySelector(`[data-task-id="${taskId}"][data-board-id="${this.id}"]`);
    taskContainer.remove();
  }

  onCompleteTask(taskId) {
    const taskContainer = document.querySelector(`[data-task-id="${taskId}"][data-board-id="${this.id}"]`);
    taskContainer.classList.toggle('completed');
  }
}

class Task {
  constructor({ id, name, completed }) {
    this.id = id;
    this.name = name;
    this.completed = completed;
  }
}

function onDuplicateBoard(board) {
  const boardsContainer = document.querySelector('.boards');
  const newBoard = structuredClone(board);
  newBoard.id = getNextBoardId();
  newBoard.title = `${newBoard.title} Copy`;

  const boardContainer = getBoardView(newBoard);
  boardsContainer.appendChild(boardContainer);
  boards.push(newBoard);
}

function onDeleteBoard(boardId) {
  boards = boards.filter((board) => board.id !== boardId);

  const boardContainer = document.querySelector(`[data-board-id="${boardId}"]`);
  boardContainer.remove();
}

function onAddBoard(newBoardTitle) {
  console.log(newBoardTitle);

  const board = new Board({
    id: getNextBoardId(),
    title: newBoardTitle,
    tasks: [],
  });

  boards.push(board);

  const boardsContainer = document.querySelector('.boards');
  const boardContainer = getBoardView(board);
  boardsContainer.appendChild(boardContainer);
}

function onDeleteTask(boardId, taskId) {
  const board = boards.find((board) => board.id === boardId);
  board.tasks = board.tasks.filter((task) => task.id !== taskId);

  const taskContainer = document.querySelector(`[data-task-id="${taskId}"][data-board-id="${boardId}"]`);
  taskContainer.remove();
}

function onCompleteTask(boardId, taskId) {
  const board = boards.find((board) => board.id === boardId);

  const completedTask = board.tasks.find((task) => task.id === taskId);
  completedTask.completed = !completedTask.completed;

  const taskContainer = document.querySelector(`[data-task-id="${taskId}"][data-board-id="${boardId}"]`);
  taskContainer.classList.toggle('completed');
}

function handleNewTaskInputKeypress(board, e) {
  if (e.key === 'Enter') {
    board.onAddTask(e.target.value);
    e.target.value = '';
  }
}

function handleNewBoardInputKeypress(e) {
  if (e.key === 'Enter') {
    onAddBoard(e.target.value);
    e.target.value = '';
  }
}

function getNextBoardId() {
  const lastBoardIndex = boards.length - 1;
  const lastBoardId = boards[lastBoardIndex]?.id;
  if (!lastBoardId) return 1;

  return lastBoardId + 1;
}

function getNextTaskId(tasks) {
  const lastTaskIndex = tasks.length - 1;
  const lastTaskId = tasks[lastTaskIndex]?.id;
  if (!lastTaskId) return 1;

  return lastTaskId + 1;
}

function getTaskView(board, task) {
  const taskContainer = document.createElement('li');
  taskContainer.classList.add('task');
  taskContainer.dataset.taskId = task.id;
  taskContainer.dataset.boardId = board.id;
  if (task.completed) {
    taskContainer.classList.add('completed');
  }

  const taskCheckbox = document.createElement('input');
  taskCheckbox.id = `checkbox-${task.id}-${Date.now()}`;
  taskCheckbox.classList.add('checkbox');
  taskCheckbox.type = 'checkbox';
  taskCheckbox.checked = task.completed;
  taskCheckbox.addEventListener('click', () => board.onCompleteTask(task.id));
  taskContainer.appendChild(taskCheckbox);

  const taskName = document.createElement('label');
  taskName.classList.add('task-name');
  taskName.textContent = task.name;
  taskName.htmlFor = taskCheckbox.id;
  taskContainer.appendChild(taskName);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.textContent = 'X';
  deleteButton.addEventListener('click', () => board.onDeleteTask(task.id));
  taskContainer.appendChild(deleteButton);

  return taskContainer;
}

function getBoardView(board) {
  const boardContainer = document.createElement('div');
  boardContainer.classList.add('board');
  boardContainer.dataset.boardId = board.id;

  const htmlRow = document.createElement('div');
  htmlRow.classList.add('row');

  const duplicateButton = document.createElement('button');
  duplicateButton.classList.add('duplicate-button');
  duplicateButton.textContent = 'Duplicate board';
  duplicateButton.addEventListener('click', () => onDuplicateBoard(board));
  htmlRow.appendChild(duplicateButton);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.textContent = 'X';
  deleteButton.addEventListener('click', () => onDeleteBoard(board.id));
  htmlRow.appendChild(deleteButton);

  boardContainer.appendChild(htmlRow);

  const boardTitle = document.createElement('p');
  boardTitle.classList.add('board-title');
  boardTitle.textContent = board.title;
  boardTitle.addEventListener('click', () => board.onBoardTitleClick());
  boardContainer.appendChild(boardTitle);

  const tasksContainer = document.createElement('ul');
  tasksContainer.classList.add('tasks');
  boardContainer.appendChild(tasksContainer);
  console.log(board);
  board.tasks.forEach((task) => {
    const taskContainer = getTaskView(board.id, task);
    tasksContainer.appendChild(taskContainer);
  });

  const newTaskInput = document.createElement('input');
  newTaskInput.dataset.boardId = board.id;
  newTaskInput.classList.add('new-task-input');
  newTaskInput.type = 'text';
  newTaskInput.placeholder = 'Nova tarefa';
  newTaskInput.addEventListener('keypress', (e) => handleNewTaskInputKeypress(board, e));
  boardContainer.appendChild(newTaskInput);

  return boardContainer;
}

let boards = [];

function renderBoards(boards) {
  const boardsContainer = document.querySelector('.boards');

  boards.forEach((board) => {
    const boardContainer = getBoardView(board);

    boardsContainer.appendChild(boardContainer);
  });
}
renderBoards(boards);

const newBoardInput = document.querySelector('.new-board-input');
newBoardInput.addEventListener('keypress', handleNewBoardInputKeypress);

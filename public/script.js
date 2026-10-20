// Add todo validation
document.getElementById('todo-form').addEventListener('submit', function(e) {
  var input = document.getElementById('todo-input');
  if (!input.value.trim()) {
    alert('Please enter a todo item.');
    e.preventDefault();
  }
});

// Edit todo
document.querySelectorAll('.edit-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var todoItem = btn.closest('.todo-item');
    var textSpan = todoItem.querySelector('.todo-text');
    var currentText = textSpan.textContent;
    var input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';
    textSpan.replaceWith(input);
    input.focus();

    input.addEventListener('blur', function() {
      if (input.value.trim()) {
        fetch('/edit/' + todoItem.dataset.id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: input.value })
        }).then(() => location.reload());
      } else {
        alert('Todo cannot be empty.');
        input.focus();
      }
    });
  });
});

// Delete todo
document.querySelectorAll('.delete-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var todoItem = btn.closest('.todo-item');
    if (confirm('Delete this todo?')) {
      fetch('/delete/' + todoItem.dataset.id, { method: 'DELETE' })
        .then(() => location.reload());
    }
  });
});

// Filter by priority
document.getElementById('priority-filter').addEventListener('change', function() {
  var selected = this.value;
  document.querySelectorAll('.todo-item').forEach(function(item) {
    if (selected === 'all' || item.dataset.priority === selected) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
      }
  });
});
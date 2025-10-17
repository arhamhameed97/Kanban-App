// Kanban Board Application
class KanbanApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentEditingTask = null;
        this.currentColumn = null;
        this.confettiCanvas = null;
        this.confettiCtx = null;
        this.confettiParticles = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.setupConfetti();
        this.render();
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        
        // Modal controls
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancel-task').addEventListener('click', () => this.closeModal());
        
        // Task form
        document.getElementById('task-form').addEventListener('submit', (e) => this.handleTaskSubmit(e));
        
        // Add task buttons
        document.querySelectorAll('.add-task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.openModal(e.target.dataset.column));
        });
        
        // Modal backdrop click
        document.getElementById('task-modal').addEventListener('click', (e) => {
            if (e.target.id === 'task-modal') this.closeModal();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    // Theme Management
    setupTheme() {
        const savedTheme = localStorage.getItem('kanban-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('kanban-theme', newTheme);
    }

    // Task Management
    generateTaskId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    createTask(title, description, dueDate, priority, column) {
        return {
            id: this.generateTaskId(),
            title: title.trim(),
            description: description.trim(),
            dueDate: dueDate || null,
            priority: priority,
            column: column,
            createdAt: new Date().toISOString()
        };
    }

    addTask(taskData) {
        this.tasks.push(taskData);
        this.saveTasks();
        this.render();
    }

    updateTask(taskId, updates) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
            this.saveTasks();
            this.render();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.render();
    }

    moveTask(taskId, newColumn) {
        const oldTask = this.tasks.find(task => task.id === taskId);
        this.updateTask(taskId, { column: newColumn });
        
        // Trigger confetti if task moved to done
        if (newColumn === 'done' && oldTask && oldTask.column !== 'done') {
            this.createConfetti();
        }
    }

    // Modal Management
    openModal(column = null, taskId = null) {
        this.currentColumn = column;
        this.currentEditingTask = taskId;
        
        const modal = document.getElementById('task-modal');
        const modalTitle = document.getElementById('modal-title');
        const form = document.getElementById('task-form');
        
        // Reset form
        form.reset();
        
        if (taskId) {
            // Edit mode
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                modalTitle.textContent = 'Edit Task';
                document.getElementById('task-title').value = task.title;
                document.getElementById('task-description').value = task.description;
                document.getElementById('task-due-date').value = task.dueDate || '';
                document.getElementById('task-priority').value = task.priority;
            }
        } else {
            // Add mode
            modalTitle.textContent = 'Add New Task';
            document.getElementById('task-priority').value = 'medium';
        }
        
        modal.classList.add('show');
        document.getElementById('task-title').focus();
    }

    closeModal() {
        const modal = document.getElementById('task-modal');
        modal.classList.remove('show');
        this.currentEditingTask = null;
        this.currentColumn = null;
    }

    handleTaskSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const dueDate = document.getElementById('task-due-date').value;
        const priority = document.getElementById('task-priority').value;
        const column = this.currentColumn || 'todo';
        
        if (this.currentEditingTask) {
            // Update existing task
            this.updateTask(this.currentEditingTask, {
                title,
                description,
                dueDate: dueDate || null,
                priority,
                column
            });
        } else {
            // Add new task
            const newTask = this.createTask(title, description, dueDate, priority, column);
            this.addTask(newTask);
        }
        
        this.closeModal();
    }

    // Drag and Drop
    setupDragAndDrop() {
        const taskCards = document.querySelectorAll('.task-card');
        const columns = document.querySelectorAll('.column-content');
        
        taskCards.forEach(card => {
            card.draggable = true;
            
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', card.dataset.taskId);
                card.classList.add('dragging');
            });
            
            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
            });
        });
        
        columns.forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                column.parentElement.classList.add('drag-over');
            });
            
            column.addEventListener('dragleave', () => {
                column.parentElement.classList.remove('drag-over');
            });
            
            column.addEventListener('drop', (e) => {
                e.preventDefault();
                column.parentElement.classList.remove('drag-over');
                
                const taskId = e.dataTransfer.getData('text/plain');
                const newColumn = column.parentElement.dataset.column;
                
                this.moveTask(taskId, newColumn);
            });
        });
    }

    // Rendering
    render() {
        this.renderColumns();
        this.updateTaskCounts();
        this.setupDragAndDrop();
        this.setupCardFlip();
    }

    renderColumns() {
        const columns = ['todo', 'progress', 'done'];
        
        columns.forEach(columnName => {
            const columnElement = document.getElementById(`${columnName}-column`);
            const emptyState = document.getElementById(`${columnName}-empty`);
            const columnTasks = this.tasks.filter(task => task.column === columnName);
            
            // Clear existing tasks
            const existingTasks = columnElement.querySelectorAll('.task-card');
            existingTasks.forEach(task => task.remove());
            
            if (columnTasks.length === 0) {
                emptyState.style.display = 'flex';
            } else {
                emptyState.style.display = 'none';
                
                columnTasks.forEach(task => {
                    const taskElement = this.createTaskElement(task);
                    columnElement.appendChild(taskElement);
                });
            }
        });
    }

    createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-card';
        taskDiv.dataset.taskId = task.id;
        taskDiv.dataset.priority = task.priority;
        
        const dueDateText = task.dueDate ? 
            new Date(task.dueDate).toLocaleDateString() : 
            'No due date';
        
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
        
        taskDiv.innerHTML = `
            <div class="card-flip-container">
                <div class="card-front">
                    <div class="task-title">${this.escapeHtml(task.title)}</div>
                    <div class="task-priority-badge ${task.priority}">${task.priority.toUpperCase()}</div>
                    <div class="flip-hint">Click to flip</div>
                </div>
                <div class="card-back">
                    <div class="task-description">${this.escapeHtml(task.description || 'No description')}</div>
                    <div class="task-meta">
                        <span class="task-due-date ${isOverdue ? 'overdue' : ''}">${dueDateText}</span>
                        <div class="task-actions">
                            <button class="edit-btn" title="Edit task">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>
                            <button class="delete-btn" title="Delete task">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3,6 5,6 21,6"/>
                                    <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                                    <line x1="10" y1="11" x2="10" y2="17"/>
                                    <line x1="14" y1="11" x2="14" y2="17"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners for edit and delete
        const editBtn = taskDiv.querySelector('.edit-btn');
        const deleteBtn = taskDiv.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openModal(task.column, task.id);
        });
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteTask(task.id);
        });
        
        return taskDiv;
    }

    updateTaskCounts() {
        const counts = {
            todo: this.tasks.filter(task => task.column === 'todo').length,
            progress: this.tasks.filter(task => task.column === 'progress').length,
            done: this.tasks.filter(task => task.column === 'done').length
        };
        
        document.getElementById('todo-count').textContent = counts.todo;
        document.getElementById('progress-count').textContent = counts.progress;
        document.getElementById('done-count').textContent = counts.done;
    }


    // Card Flip Functionality
    setupCardFlip() {
        document.addEventListener('click', (e) => {
            const taskCard = e.target.closest('.task-card');
            if (taskCard && !e.target.closest('.task-actions')) {
                taskCard.classList.toggle('flipped');
            }
        });
    }

    // Confetti System
    setupConfetti() {
        this.confettiCanvas = document.getElementById('confetti-canvas');
        this.confettiCtx = this.confettiCanvas.getContext('2d');
        
        // Set canvas size
        this.resizeConfettiCanvas();
        window.addEventListener('resize', () => this.resizeConfettiCanvas());
    }

    resizeConfettiCanvas() {
        this.confettiCanvas.width = window.innerWidth;
        this.confettiCanvas.height = window.innerHeight;
    }

    createConfetti() {
        const colors = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            this.confettiParticles.push({
                x: Math.random() * this.confettiCanvas.width,
                y: -10,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                life: 1.0,
                decay: Math.random() * 0.02 + 0.01
            });
        }
        
        this.animateConfetti();
    }

    animateConfetti() {
        this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
        
        for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
            const particle = this.confettiParticles[i];
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // gravity
            particle.rotation += particle.rotationSpeed;
            particle.life -= particle.decay;
            
            // Draw particle
            this.confettiCtx.save();
            this.confettiCtx.globalAlpha = particle.life;
            this.confettiCtx.translate(particle.x, particle.y);
            this.confettiCtx.rotate(particle.rotation * Math.PI / 180);
            this.confettiCtx.fillStyle = particle.color;
            this.confettiCtx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
            this.confettiCtx.restore();
            
            // Remove dead particles
            if (particle.life <= 0 || particle.y > this.confettiCanvas.height) {
                this.confettiParticles.splice(i, 1);
            }
        }
        
        if (this.confettiParticles.length > 0) {
            requestAnimationFrame(() => this.animateConfetti());
        }
    }

    // Utility Functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Local Storage
    saveTasks() {
        localStorage.setItem('kanban-tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('kanban-tasks');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KanbanApp();
});

// Add some sample data for demonstration (only if no tasks exist)
document.addEventListener('DOMContentLoaded', () => {
    const app = new KanbanApp();
    
    // Add sample tasks if no tasks exist
    if (app.tasks.length === 0) {
        const sampleTasks = [
            {
                id: app.generateTaskId(),
                title: 'Welcome to Kanban Board',
                description: 'This is a sample task to get you started. You can edit, delete, or move this task between columns.',
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
                priority: 'medium',
                column: 'todo',
                createdAt: new Date().toISOString()
            },
            {
                id: app.generateTaskId(),
                title: 'Try Drag and Drop',
                description: 'Drag this task to different columns to see how the Kanban board works.',
                dueDate: null,
                priority: 'high',
                column: 'progress',
                createdAt: new Date().toISOString()
            },
            {
                id: app.generateTaskId(),
                title: 'Customize Your Tasks',
                description: 'Add descriptions, due dates, and set priorities for your tasks.',
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
                priority: 'low',
                column: 'done',
                createdAt: new Date().toISOString()
            }
        ];
        
        sampleTasks.forEach(task => app.tasks.push(task));
        app.saveTasks();
        app.render();
    }
});

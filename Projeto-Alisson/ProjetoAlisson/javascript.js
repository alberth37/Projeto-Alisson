function inicializarAplicacao() {
    document.addEventListener('DOMContentLoaded', () => {
        const listaTarefas = document.getElementById('tarefas');
        const formularioTarefa = document.getElementById('formulario-tarefa');
        const filtroUsuario = document.getElementById('filtroUsuario');

        let todasTarefas = [];
        let tarefasFiltradas = []; 
        const carregarTarefas = async () => {
            try {
                const resposta = await fetch('https://jsonplaceholder.typicode.com/todos');
                if (!resposta.ok) throw new Error('Erro ao carregar tarefas');
                todasTarefas = await resposta.json();
                tarefasFiltradas = todasTarefas; 
                renderizarTarefas();
            } catch (erro) {
                alert(erro.message);
            }
        };
         const renderizarTarefas = () => {
            listaTarefas.innerHTML = tarefasFiltradas.map(tarefa => `
            <li>
                <strong>${tarefa.title}</strong>
                <p>Usuário: ${tarefa.userId}</p>
                <p>${tarefa.completed ? 'Concluída' : 'Pendente'}</p>
                <p>${tarefa.description || ''}</p>
                <button class="btn-editar" onclick="editarTarefa(${tarefa.id})">Editar</button>
                <button class="btn-excluir" onclick="excluirTarefa(${tarefa.id})">Excluir</button>
                ${!tarefa.completed ? `<button class="btn-concluir" onclick="concluirTarefa(${tarefa.id})">Concluir</button>` : ''}
            </li>
        `).join('');
        };
         window.filtrarTarefas = () => {
            const idUsuario = filtroUsuario.value;
            if (idUsuario) {
                tarefasFiltradas = todasTarefas.filter(tarefa => tarefa.userId === parseInt(idUsuario));
            } else {
                tarefasFiltradas = todasTarefas;
            }
            renderizarTarefas();
        };
         formularioTarefa.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const idUsuario = document.getElementById('idUsuario').value;
                const titulo = document.getElementById('titulo').value;
                const descricao = document.getElementById('descricao').value;

                const resposta = await fetch('https://jsonplaceholder.typicode.com/todos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: parseInt(idUsuario), title: titulo, description: descricao, completed: false })
                });
                if (!resposta.ok) throw new Error('Erro ao adicionar tarefa');

                const novaTarefa = await resposta.json();
                todasTarefas.unshift(novaTarefa);
                filtrarTarefas();

                renderizarTarefas(); 
                alert('Tarefa adicionada com sucesso!');
                formularioTarefa.reset();
            } catch (erro) {
                alert(erro.message);
            }
        });
         // Função para editar uma tarefa
         window.editarTarefa = async (tarefaId) => {
            try {
                const tarefaParaEditar = todasTarefas.find(tarefa => tarefa.id === tarefaId);
                if (!tarefaParaEditar) {
                    throw new Error('Tarefa não encontrada');
                }

                const novoTitulo = prompt('Digite o novo título da tarefa:', tarefaParaEditar.title);
                if (novoTitulo !== null && novoTitulo !== '') {
                    const resposta = await fetch(`https://jsonplaceholder.typicode.com/todos/${tarefaId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: novoTitulo })
                    });
                    if (!resposta.ok) throw new Error('Erro ao editar tarefa');

                    // Atualiza a tarefa nos arrays
                    const atualizarTarefa = (tarefas) => {
                        const indiceTarefa = tarefas.findIndex(tarefa => tarefa.id === tarefaId);
                        if (indiceTarefa !== -1) {
                            tarefas[indiceTarefa].title = novoTitulo;
                        }
                    };
                    atualizarTarefa(todasTarefas);
                    atualizarTarefa(tarefasFiltradas);

                    renderizarTarefas();
                    alert('Tarefa editada com sucesso!');
                }
            } catch (erro) {
                console.error('Erro ao editar tarefa:', erro);
                alert(erro.message);
            }
        };
         // Função para excluir uma tarefa
         window.excluirTarefa = async (tarefaId) => {
            try {
                if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                    const resposta = await fetch(`https://jsonplaceholder.typicode.com/todos/${tarefaId}`, { method: 'DELETE' });
                    if (!resposta.ok) throw new Error('Erro ao excluir tarefa');

                    // Remove a tarefa dos arrays
                    todasTarefas = todasTarefas.filter(tarefa => tarefa.id !== tarefaId);
                    tarefasFiltradas = tarefasFiltradas.filter(tarefa => tarefa.id !== tarefaId);

                    renderizarTarefas();
                    alert('Tarefa excluída com sucesso!');
                }
            } catch (erro) {
                alert(erro.message);
            }
        };
        // Função para concluir uma tarefa
        window.concluirTarefa = async (tarefaId) => {
            try {
                const resposta = await fetch(`https://jsonplaceholder.typicode.com/todos/${tarefaId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ completed: true })
                });
const taskForm = document.getElementById('formulario-tarefa');
const taskTitle = document.getElementById('titulo');
const taskDescription = document.getElementById('descricao');
const userId = document.getElementById('idUsuario');
const taskList = document.getElementById('tarefas');
const filterUserId = document.getElementById('filtroUsuario');

const apiUrl = 'https://jsonplaceholder.typicode.com/todos';

let allTasks = [];
async function fetchTasks() {
    try {
        const response = await fetch(apiUrl);
        allTasks = await response.json(); 
        renderTasks(allTasks);  
    } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
    }
}
function renderTasks(tasks) {
    taskList.innerHTML = ''; 

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');

        if (task.completed) {
            taskItem.classList.add('completed');
        }
        const completionStatus = task.completed ? ' (Concluída)' : '';
        taskItem.innerHTML = `
            <span>${task.title}${completionStatus}</span>
            <div>
                <button onclick="deleteTask(${task.id})">Excluir</button>
                <button onclick="toggleTask(${task.id}, ${task.completed})">Concluir</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}
async function addTask(event) {
    event.preventDefault();

    if (!taskTitle.value.trim()) {
        alert("O título da tarefa não pode estar vazio.");
        return;
    }
    const newTask = {
        title: taskTitle.value,
        description: taskDescription.value || '',
        completed: false,
        userId: userId.value || 1 
    };
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });
        if (response.ok) {
            const addedTask = await response.json(); 
            allTasks.push(addedTask);
            renderTasks(allTasks); 
            taskTitle.value = ''; 
            taskDescription.value = '';
            userId.value = ''; 
        } else {
            console.error('Falha ao adicionar tarefa');
        }
    } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
    }
}
async function deleteTask(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log(`Tarefa com id ${id} excluída com sucesso.`);
            allTasks = allTasks.filter(task => task.id !== id); 
            renderTasks(allTasks); 
        } else {
            console.error('Falha ao excluir tarefa');
        }
    } catch (error) {
        console.error("Erro ao excluir tarefa:", error);
    }
}
async function toggleTask(id, currentStatus) {
    const updatedTask = {
        completed: !currentStatus
    };
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTask)
        });
        if (response.ok) {
            console.log(`Tarefa com id ${id} foi atualizada.`);
            const taskIndex = allTasks.findIndex(task => task.id === id);
            if (taskIndex !== -1) {
                allTasks[taskIndex].completed = !currentStatus;
            }
            renderTasks(allTasks); 
        } else {
            console.error('Falha ao atualizar tarefa');
        }
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
    }
}

function filtrarTarefas() {
    const userIdFilter = filterUserId.value;

    if (!userIdFilter) {
        renderTasks(allTasks);
    } else {
        const filteredTasks = allTasks.filter(task => task.userId === parseInt(userIdFilter));
    }
}
taskForm.addEventListener('submit', addTask);
fetchTasks();
                if (!resposta.ok) throw new Error('Erro ao concluir tarefa');

                const atualizarTarefa = (tarefas) => {
                    const indiceTarefa = tarefas.findIndex(tarefa => tarefa.id === tarefaId);
                    if (indiceTarefa !== -1) {
                        tarefas[indiceTarefa].completed = true;
                    }
                };
                atualizarTarefa(todasTarefas);
                atualizarTarefa(tarefasFiltradas);

                renderizarTarefas();
                alert('Tarefa concluída com sucesso!');
            } catch (erro) {
                alert(erro.message);
            }
        };

        carregarTarefas();
    });
}
inicializarAplicacao();
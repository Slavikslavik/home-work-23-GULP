class Todo {
    constructor(form,list,template){
        this.form = form;
        this.list = list;
        this.template = template;
        this.notes = [];
    }
    init(){
        //если нет авторизации
        const token = localStorage.getItem('access_token');

        if(token){
        // this.getTask();
        // this.render();
            this.form.addEventListener('submit',e => {
                e.preventDefault();
                const note = document.querySelector('.form_task').value;
                //console.log(note);
                this.append(note);
                this.getTask();
                this.render();
            });
        } else {
            alert('write your id');
        }

        this.list.addEventListener('click',({target}) => {

            const isCompleteBtn = target.tagName === 'BUTTON' && target.classList.contains('note__button-done');
            const editButton = target.tagName === 'BUTTON' && target.classList.contains('note__button--edit');
            const currentNoteId = target.closest('li').dataset.id;

            if(isCompleteBtn) {

                this.complete(Number(currentNoteId));

            } else if(editButton){
                this.edit(Number(currentNoteId));

            } else {
                this.remove(Number(currentNoteId));
            }
        });
    }

    append(note){
        const task = {
            value: note,
            priority: 1
        };
        const options = {
            method:'POST',
            body: JSON.stringify(task),
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${localStorage.getItem('access_token')}`
            }
        };

        fetch('https://todo.hillel.it/todo',options)
            .then(response => response.json())
            .then(notein => {

                this.notes.unshift(notein);
                this.render();

                this.form.reset();

            })
            .catch(error => alert('sorry, shit happends POST !!!!'));
    }
    render(){
        this.list.innerHTML = '';
        this.notes.forEach(note => {
            this.list.insertAdjacentHTML(
                'afterbegin',
                this.template(note)
            );
        });
    }

    getTask(){
        const options = {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Bearer ${localStorage.getItem('access_token')}`
            }
        };
        fetch('https://todo.hillel.it/todo',options)
            .then(result => result.json())
            .then(result => {
                //console.log(result);
                this.notes = result;
                this.render();
            })
            .catch(error => alert('Ooops..GET'));
    }

    getAccess(id){
        const options = {
            method:'POST',
            body:JSON.stringify({
                value: id
            }),
            headers: {
                'Content-Type':'application/json'
            }
        };
        fetch('https://todo.hillel.it/auth/login',options)
            .then(response => response.json())
            .then(result => {
            //console.log(result);
                localStorage.setItem('access_token',result.access_token);
                this.getTask();
            })
            .catch(error => alert('sorry, shit happends'));

    }
}

class ListTodo extends Todo{

    edit(id){
        const edit = document.querySelector('.edit');
        edit.classList.remove('hidden');
        this.notes.find(note => {
            if(note._id === id) {
            //console.log(note);


                edit.innerHTML =`<h1 class="header">  Make Changes 
                <input type="text" class="edit_value"  value="${note.value}">
                <div class="button1s">
                <button class="button1" data-action="save" >save</button>
                <button class="button1" data-action="cancel" >cancel</button>
                </div>
                </h1>`;
    
                fetch(`https://todo.hillel.it/todo/${note._id}`,{
                    method: 'PUT',
                    headers: {
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${localStorage.getItem('access_token')}`
                    },
                    body: JSON.stringify(note)
                })
                    .then(result => result.json())
                    .then(result => {
                    //console.log(result)
    
                        document.querySelector('.button1s').addEventListener('click',e => {
                            e.preventDefault();
                            if(e.target.dataset.action === 'save'){
                            //console.log('save');
    
                                note.value = document.querySelector('.edit_value').value;
    
                                this.render();
                            }
                            if (e.target.dataset.action === 'cancel'){
                                edit.classList.toggle('hidden');
                            //console.log(edit);
                            }
                        });
                    });
            }
        });
    }
    complete(id){
        this.notes.find(note => {
            // console.log(note._id);
            if(note._id === id) {
                fetch(`https://todo.hillel.it/todo/${note._id}/toggle`,{
                    method:'PUT',
                    headers: {
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${localStorage.getItem('access_token')}`
                    }
                })
                    .then(result => result.json())
                    .then(note => {
                        //console.log(note);
                        note.checked = true;
                        this.getTask();
                        //this.render();
                    });
            }
        });
    }
    remove(id){
        this.notes.find(note => {
            if(note._id === id){
                fetch(`https://todo.hillel.it/todo/${note._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                })
                    .then(result => result.json())
                    .then(result=> {
                        this.notes.splice(this.notes.indexOf(note),1);
                        this.render();
                        //    console.log(result);
                        //    this.notes.push(result);
                    });
            }
        });
    }
}

const first = new ListTodo(
    document.querySelector('.note'),
    document.querySelector('.note_list'),
    note => `
    <li data-id="${note._id}"  >
    <span class="note__text ${note.checked ? "note__text--completed" : ""}" > ${note.value}</span>   
    <button class="note__button note__button-done" ${note.checked ? "disabled" : ""} data-action ="done">DONE</button>
    <button class="note__button note__button--remove" data-action = "remove">Remove</button>
    <button class="note__button note__button--edit" ${note.checked ? "disabled" : ""} data-action = "edit">EDIT</button>
    </li>`
);
document.querySelector('.login').addEventListener('submit', e => {
    e.preventDefault();
    //console.log('qwe');
    const id = document.querySelector('.form_input').value;
    //console.log(typeof id);
    first.getAccess(id);

});

first.init();
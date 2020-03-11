import {pubsub} from './pubsub.js';

export const personForm = {
    render: container =>{
        //build form to add movie
        let template = document.getElementById('personFormTemplate');
        let form = template.content.cloneNode(true);

        form.querySelector('button').addEventListener('click', personForm.add);
        container.appendChild(form);
    },

    add: ev => { 
        ev.preventDefault();

        //get all the data from the input to create the new person object
        let nameField = document.querySelector('.person-form input.name');
        let birthdateField = document.querySelector('.person-form input.birthdate')
        let name = nameField.value;
        let birthdate = birthdateField.value;
        let id = Date.now();

        //now update the modules about the new person
        let newPerson = {id, name, birthdate}; //using the object shorthand instead of id:id
        pubsub.publish('personAdded', newPerson);
    }
}
import {pubsub} from './pubsub.js';

export const personForm = {
    trackerList: [], //will be used to store just the ids in local storage to have a reference of what to 
    render: container =>{
        //build form to add movie
        let template = document.getElementById('personFormTemplate');
        let form = template.content.cloneNode(true);

        form.querySelector('button').addEventListener('click', personForm.add);
        container.appendChild(form);

        //now to subscribe to any events that i need to listen for
        pubsub.subscribe('trackerListFound', personForm.reloadSavedPersons);
    },

    add: ev => { 
        ev.preventDefault();

        //get all the data from the input to create the new person object
        let nameField = document.querySelector('.person-form input.name');
        let birthdateField = document.querySelector('.person-form input.birthdate');
        let name = nameField.value;
        let birthdate = birthdateField.value;

        if(name && birthdate){
            let id = Date.now();
            //now update the modules about the new person
            let newPerson = {id, name, birthdate}; //using the object shorthand instead of id:id
            personForm.trackPerson(newPerson);
            pubsub.publish('personAdded', newPerson);
            nameField.value = ""; //clear out the values
            birthdateField.value = ""; 
        } else {
            alert('You Are Missing Required Attributes');
        }
    },

    //in the trackPerson helper function we will save the new Person to local storage
    //and also save their id to an array (also in local storage) to have refenrence of what
    //to search for in local storage when loading the program
    trackPerson: person =>{
        personForm.trackerList.push(person.id);
        localStorage.setItem(`GIFTR`, JSON.stringify(personForm.trackerList));
        localStorage.setItem(`GIFTR-${person.id}`, JSON.stringify(person));
    },

    reloadSavedPersons: savedList =>{
        console.log(savedList);
        savedList.forEach(save => personForm.trackerList.push(save.id)); 
        //since i am only loading in the list on the initial load, lets
        //unsubscribe after reloading the list

    }
}
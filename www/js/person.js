import {pubsub} from './pubsub.js';

export const person = {
    list: [],
    // randomElement: 1028, //number used to randomize person ids
    render: container => {
        let template = document.getElementById('personListTemplate');
        let div = template.content.cloneNode(true);
        container.appendChild(div);

        //listen for the Person Added message
        console.log('PERSON: is listening for a person added');
        pubsub.subscribe('personAdded', person.personAdded);
    },


    personAdded: newPerson =>{
        //using set to prevent duplicates
        console.log(`People: I hear that ${newPerson} was added`);
        let list = new Set(person.list);
        list.add(newPerson);

        person.list = Array.from(list).sort();

        //update any of the modules listening about the new person update
        console.log(`People: just updated the list`);
        pubsub.publish('peopleUpdated', person.list);

        //now to update the ui based on the new list
        let ul = document.querySelector('.person-container ul');
        ul.innerHTML = ""; //clear out the contents of the list

        let frag = document.createDocumentFragment();

        person.list.forEach(friend => {

            //first create the elements
            let li = document.createElement('li');
            let name = document.createElement('p');
            let date = document.createElement('p');
            let btn = document.createElement('btn');
            let btn_label = document.createElement('p');

            //set the properties and attributes needed
            li.setAttribute('data-personid', friend.id);
            name.textContent = friend.name;
            date.textContent = friend.birthdate;
            btn_label.textContent = 'DELETE'; //replace later with delete icon

            //append the attributes in the needed way
            btn.appendChild(btn_label);
            li.appendChild(date);
            li.appendChild(name);
            li.appendChild(btn);

            //append the li to the document frag
            frag.appendChild(li);
        });
        ul.appendChild(frag);        
    }
};
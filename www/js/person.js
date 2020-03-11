import {pubsub} from './pubsub.js';
import { personForm } from './personForm.js';

export const person = {
    list: [],
    // randomElement: 1028, //number used to randomize person ids
    render: container => {
        let template = document.getElementById('personListTemplate');
        let div = template.content.cloneNode(true);
        container.appendChild(div);

        //check local storage to see if there are any items
        let storedItems = JSON.parse(localStorage.getItem('GIFTR'));

        // console.log(storedItems);
        if(storedItems && storedItems.length > 0){ //if we have items in the stored item array
            //first initilize the list to hold, because when they are added intially
            //the set checks for unique ness we can just reload the people saved
            storedItems.forEach(x => {
                let savedPerson = JSON.parse(localStorage.getItem(`GIFTR-${x}`))
                person.list.push(savedPerson);

                //get a reference to the ul and append the people
                let ul = document.querySelector('.person-container ul');
                ul.innerHTML = ""; //clear out the contents of the list
        
                let frag = document.createDocumentFragment();
                person.list.forEach(friend => {
                    let li = person.createListItem(friend);
                    //append the li to the document frag
                    frag.appendChild(li);
                });
                ul.appendChild(frag);
            });
            //now to update the modules about the found tracker list
            pubsub.publish('trackerListFound', person.list);
            console.log(person.list);
            
        }

        //listen for the Person Added message
        console.log('PERSON: is listening for a person added');
        pubsub.subscribe('personAdded', person.personAdded);
    },

    personAdded: newPerson =>{
        //using set to prevent duplicates
        console.log(`People: I hear that ${newPerson} was added`);
        let list = new Set(person.list);
        list.add(newPerson);

        person.list = Array.from(list).sort(person.sortPerson);
        // person.list.concat(Array.from(list));
        // person.list.sort(person.sortPerson);

        //update any of the modules listening about the new person update
        console.log(`People: just updated the list`);
        pubsub.publish('peopleUpdated', person.list);

        //now to update the ui based on the new list
        let ul = document.querySelector('.person-container ul');
        ul.innerHTML = ""; //clear out the contents of the list

        let frag = document.createDocumentFragment();

        person.list.forEach(friend => {
            let li = person.createListItem(friend);
            //append the li to the document frag
            frag.appendChild(li);
        });
        ul.appendChild(frag);        
    },

    createListItem: friend =>{
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

        return li;
    },

    //callback function used for the sort
    //first we compared birth months then compare
    //the birth day
    sortPerson: (a,b) =>{
        let a_date = new Date(a.birthdate);
        let b_date = new Date(b.birthdate);

        if(a_date.getMonth() == b_date.getMonth()){ //they are the same month return day
            console.log(a_date.getDay(),  b_date.getDay())
            return a_date.getDay() - b_date.getDay();
        } else {
            return a_date.getMonth() - b_date.getMonth(); //if not the same month sort by month
        }
    }
};
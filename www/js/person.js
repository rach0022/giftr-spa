import {pubsub} from './pubsub.js';

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

                person.updatePersonList();
            });
            //now to update the modules about the found tracker list
            pubsub.publish('trackerListFound', person.list);
            console.log(person.list);
            
        }

        //listen for the Person Added message
        console.log('PERSON: is listening for a person added');
        pubsub.subscribe('personAdded', person.personAdded);
        pubsub.subscribe('personDeleted', person.updatePersonList);
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

        person.updatePersonList();        
    },
    updatePersonList: () => {
        console.log(person.list)
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
        let btn = document.createElement('button');
        let btn_label = document.createElement('i');

        //set the properties and attributes needed
        li.setAttribute('data-personid', friend.id);
        btn.setAttribute('data-personid', friend.id);
        name.textContent = friend.name;

        let convertedDate = new Date(friend.birthdate);
        let opts = {
            month: 'short',
            day: 'numeric'
        }
        let formattedDate = new Intl.DateTimeFormat('en-CA', opts).format(convertedDate);
        date.textContent = formattedDate;
        btn_label.classList.add('fas', 'fa-trash'); //replace later with delete icon

        //add the event listeners
        btn.addEventListener('click', person.deletePerson);

        //append the attributes in the needed way
        btn.appendChild(btn_label);
        li.appendChild(date);
        li.appendChild(name);
        li.appendChild(btn);

        li.addEventListener('click', person.personSelected);

        return li;
    },

    //callback function used for the sort
    //first we compared birth months then compare
    //the birth day
    sortPerson: (a,b) =>{
        let a_date = new Date(a.birthdate);
        let b_date = new Date(b.birthdate);

        if(a_date.getMonth() == b_date.getMonth()){ //they are the same month return days
            return a_date.getDay() - b_date.getDay();
        } else {
            return a_date.getMonth() - b_date.getMonth(); //if not the same month sort by month
        }
    },

    //helper/ callback function used to tell the program which person is selected 
    //and will publish this data with the id of the person and allow the gift form
    //to update which person it is adding a gift too
    personSelected: ev =>{
        ev.preventDefault();

        let id = ev.currentTarget.getAttribute('data-personid');
        pubsub.publish('personSelected', id);
    },

    //callback function to delete the person when the user clicks the
    //delete button
    deletePerson: ev =>{
        ev.preventDefault();
        ev.stopPropagation(); //stop the event from bubbling up and triggering the selectPerson event
        
        //to delete the person we just want to removeItem from local storage
        //and then publish an update saying the person was deleted
        let id = ev.currentTarget.getAttribute('data-personid');
        localStorage.removeItem(`GIFTR-${id}`);

        //also remove the id from the master array holding all the id values
        let masterList = JSON.parse(localStorage.getItem('GIFTR'));

        //remove from the person module
        let listIndex = person.list.findIndex(person => person.id == id);
        let removedListItem = person.list.splice(listIndex, 1);
        //and then from the master list
        let index = masterList.findIndex(person => person == id);
        let removed = masterList.splice(index, 1);

        //update local storage with the master list
        localStorage.setItem('GIFTR', JSON.stringify(masterList));
        pubsub.publish('personDeleted'); //update the modules about the deleted person
    
    }
};
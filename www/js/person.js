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
            
        } else {
            person.buildEmptyList(document.querySelector('.person-container ul'));
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
        if(person.list.length > 0){
            person.list.forEach(friend => {
                let li = person.createListItem(friend);
                //append the li to the document frag
                frag.appendChild(li);
            });
            ul.appendChild(frag);
        } else {
            person.buildEmptyList(ul);
        }
        
        // //change all states that need to be changed
        // document.querySelector('.gift-form').removeAttribute('data-selection'); //clearout the id
    },

    createListItem: friend =>{
        //first create the elements
        let li = document.createElement('li');
        let name = document.createElement('p');
        let date = document.createElement('p');
        let btn = document.createElement('button');
        let btn_label = document.createElement('i');

        //then get todays date to compare the birthdays too
        let past = person.isBirthdayPast(friend.birthdate);

        //set the properties and attributes needed
        li.setAttribute('data-personid', friend.id);
        if(past == 'past') li.classList.add(past); //will either add an emptry string or past 
        btn.setAttribute('data-personid', friend.id);
        name.textContent = friend.name;

        //now to split the date value based on the hypens and create a new Date
        //after the split 0 is year, 1 is month and 2 is day
        let dateArray = friend.birthdate.split('-');
        console.log(dateArray[0], dateArray[1], dateArray[2]);
        let convertedDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
        // console.log(`${friend.name} birthdate is `, convertedDate.getMonth(), convertedDate.getDay(), convertedDate.getFullYear());
        
        //check the current date against the birthdays (without comparing the year)

        // if(today.getMonth() > convertedDate.getMonth())
        
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
            return a_date.getDate() - b_date.getDate();
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

        //once the person is selected rebuild the list with just the one person
        //and add a button to deselect the person
        //first clear the list
        let ul = document.querySelector('.person-container ul');
        ul.innerHTML = "";

        //then find the person 
        let index = person.list.findIndex(per => per.id == id);
        let selected = person.list[index];

        //now build the li with the person and modify the button
        let li = person.createListItem(selected);
        let button = li.querySelector('button');
        button.querySelector('i').classList = 'fas fa-redo';
        button.removeEventListener('click', person.deletePerson);
        button.addEventListener('click', person.deselectPerson);

        //append the listItem to the unorderedList
        ul.appendChild(li);

    },

    //callback function to deselect the person, event is rebound on same button
    //button should have attribute that is the id of the person that was selected originally
    deselectPerson: ev =>{
        ev.preventDefault();
        ev.stopPropagation();
        let id = ev.currentTarget.getAttribute('data-personid');
        //call the updatePersonList to rebuild the list 
        person.updatePersonList();

        //update the other modules with the deselected person
        console.log(`PERSON: #${id} was just deselected`);
        pubsub.publish('personDeselected', id); //not used yet
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
        let masterIndex = masterList.findIndex(userID => userID == id);
        let removed = masterList.splice(masterIndex, 1);

        //update local storage with the master list
        localStorage.setItem('GIFTR', JSON.stringify(masterList));
        pubsub.publish('personDeleted', removedListItem); //update the modules about the deleted person
    },

    //helper function to build the empty list message
    buildEmptyList: listContainer => {
        listContainer.innerHTML = ""; //clear out the list container
        let emptyText = document.createElement('p');
        emptyText.textContent = "There are no friends added, please click the add button to begin the giftr experince";
        listContainer.appendChild(emptyText);
    },

    //helper function to compare the current date vs the birthdate
    //to see if it is past or not, input parameter is the date value in ms
    //will return a value to say if the date is past or not
    isBirthdayPast: time => {
        let today = new Date(Date.now());
        let dateArray = time.split('-');
        let comparisonDate = new Date(dateArray[0], dateArray[1], dateArray[2]);

        //if the month of the birthday is greater then todays months
        //we know the birthday is coming up and not to be styled differnetly
        //but if the months are equal then we check the day comparison
        //otherwise if the month is less then the current month it will be styled
        //as a past date
        console.log(comparisonDate.getMonth(),  today.getMonth());
        if(comparisonDate.getMonth() > today.getMonth()){
            return undefined;  //return emptry string so nothing is added to the classlist
        } else if (comparisonDate.getMonth() == today.getMonth()){
            if(comparisonDate.getDate() > today.getDate() || comparisonDate.getDate() == today.getDate()){
                return undefined;
            } else {
                return 'past';
            }
        } else {
            return 'past';
        }
    }
};
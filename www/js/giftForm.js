import {pubsub} from './pubsub.js';

export const giftForm = {
    render: container =>{
        //build form to add gift idea
        let template = document.getElementById('giftFormTemplate');
        let form = template.content.cloneNode(true); //get a copy of the form

        form.querySelector('#submit').addEventListener('click', giftForm.add);
        form.querySelector('#cancel').addEventListener('click', ev =>{
            //do something to hide the form and show 
            //possibly just reselect the same person
            ev.preventDefault();
            ev.stopPropagation();
            giftForm.hideForm(); // hide the form
            pubsub.publish('formComplete'); //show the gift list
        });
        container.appendChild(form);
        //now subscribe to any events that i need to listen for
        pubsub.subscribe('personSelected', giftForm.targetPerson);
        pubsub.subscribe('showGiftForm', giftForm.showForm);
        pubsub.subscribe('personDeselected', giftForm.hideForm);
        pubsub.subscribe('personSelected', giftForm.hideForm);
    },
    add: ev =>{
        ev.preventDefault();

        //get all the data from the inputs
        let form = document.querySelector('.gift-form');
        let selectedPerson = form.getAttribute('data-selection');
        if(selectedPerson){
            let newGift = {
                id: Date.now(),
                name: document.querySelector('.gift-form input.name').value,
                price: document.querySelector('.gift-form input.price').value,
                location: {
                    store:document.querySelector('.gift-form input.store').value,
                    url: document.querySelector('.gift-form input.website').value
                }
            }
            if(newGift.name == "") { //|| newGift.price == "" add this in once i ask steve
                alert("Did Not Save Name or Price");
            }else {
                newGift = giftForm.saveGiftToPerson(newGift); //set the id onto the gift object attribute
            }
            form.reset();
            console.log(newGift);
        } else {
            alert('No Person Selected');
        }
        pubsub.publish('personSelected', selectedPerson); //alert the module to reload
        giftForm.hideForm();
    },


    //helper function used to change the selected person that the gift
    //form is targetting (as in who to add the gift too)
    targetPerson: id => {
        document.querySelector('.gift-form').setAttribute('data-selection', id);
    },

    //helper function to save the gift to the right person object in local storage
    //and then resave into local storage
    saveGiftToPerson: gift =>{
        //load the person from storage
        let id = document.querySelector('.gift-form').getAttribute('data-selection');
        let person = JSON.parse(localStorage.getItem(`GIFTR-${id}`));
        
        //set the id of the person to the gift to use later
        gift.owner = person.id;

        //save the new gift to the person
        person.gifts.push(gift);

        //save back to local storage
        localStorage.setItem(`GIFTR-${id}`, JSON.stringify(person));
        return gift;
    },

    //callback function to show the form
    showForm: function(){
        document.querySelector('.gift-form').classList.remove('deactive');
    },
    hideForm: function(){
        document.querySelector('.gift-form').classList.add('deactive');
    }
}
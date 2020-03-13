import {pubsub} from './pubsub.js';

export const gift = {
    render: container =>{
        let template = document.getElementById('giftListTemplate');
        let div = template.content.cloneNode(true);
        container.appendChild(div);

        //listen for any updates to gifts being added:
        console.log('GIFT: is liteneing for a gift being added');
        pubsub.subscribe('personSelected', gift.displayGiftList);
        pubsub.subscribe('showGiftForm', gift.hideGiftList); //hide the gift list
        pubsub.subscribe('showPersonForm', gift.hideGiftList); //hide the gift list
        pubsub.subscribe('formComplete', gift.showGiftList); //show the gift list
        pubsub.subscribe('personDeselected', gift.hideGiftList); //hide the gift list

    },
    displayGiftList: id => {
        console.log('GIFT: I hear that a person was selected');
        let person = JSON.parse(localStorage.getItem(`GIFTR-${id}`));

        let ul = document.querySelector('.gift-container ul');
        ul.innerHTML = ""; //clear out the old gift info
        let frag = document.createDocumentFragment();

        person.gifts.forEach(giftItem =>{
            let li = gift.createListItem(giftItem);
            frag.appendChild(li);
        });
        ul.appendChild(frag);
        gift.showGiftList(); //now to actually show the list
    },

    createListItem: giftItem =>{
        let li = document.createElement('li');
        let name = document.createElement('p');
        let price = document.createElement('p');
        let location = document.createElement('a');
        let delBtn = document.createElement('button');
        let btn_label = document.createElement('i');

        //set the properties needed
        delBtn.setAttribute('data-owner', giftItem.owner);
        delBtn.setAttribute('data-giftid', giftItem.id);
        name.textContent = giftItem.name;

        let currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CDN' });
        price.textContent = currencyFormatter.format( giftItem.price); 
        location.textContent = giftItem.location.store;
        location.href = giftItem.location.website;
        btn_label.classList.add('fas', 'fa-trash'); //switch to icon

        //add the appropirate listeners
        delBtn.addEventListener('click', gift.deleteGift);


        //append the properties needed
        delBtn.appendChild(btn_label);
        li.appendChild(name);
        li.appendChild(price);
        li.appendChild(location);
        li.appendChild(delBtn);

        return li;
    },

    //callback function to delete the gift when the user
    //clicks the button
    deleteGift: ev =>{
        ev.preventDefault();
        ev.stopPropagation(); //stop the event from bubbling up and triggering the selectPerson event

        //first find the person object in localstorage
        let person = JSON.parse(localStorage.getItem(`GIFTR-${ev.currentTarget.getAttribute('data-owner')}`));
        
        //find the index of the gift inside the person.gifts arrays
        let giftID = ev.currentTarget.getAttribute('data-giftid');
        console.log(person);
        let index = person.gifts.findIndex(person => person.id == giftID);
        let removed = person.gifts.splice(index,1);
        console.log(removed);

        localStorage.setItem(`GIFTR-${person.id}`, JSON.stringify(person));

        //emit an event to rebuild the list
        pubsub.publish('personSelected', person.id);

    },

    //helper functions to show/ hide the gift list
    showGiftList: function(){
        document.querySelector('.gift-container').classList.remove('deactive');
    },
    hideGiftList: function(){
        document.querySelector('.gift-container').classList.add('deactive');
    }
}
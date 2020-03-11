import {pubsub} from './pubsub.js';

export const gift = {
    render: container =>{
        let template = document.getElementById('giftListTemplate');
        let div = template.content.cloneNode(true);
        container.appendChild(div);

        //listen for any updates to gifts being added:
        console.log('GIFT: is liteneing for a gift being added');
        pubsub.subscribe('personSelected', gift.displayGiftList);
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
    },

    createListItem: giftItem =>{
        let li = document.createElement('li');
        let name = document.createElement('p');
        let price = document.createElement('p');
        let location = document.createElement('a');

        //set the properties needed
        name.textContent = giftItem.name;
        price.textContent = giftItem.price; 
        location.textContent = giftItem.location.store;
        location.href = giftItem.location.website; 

        //append the properties needed
        li.appendChild(name);
        li.appendChild(price);
        li.appendChild(location);

        return li;
    }
}
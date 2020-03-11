import {pubsub} from './pubsub.js';

export const gift = {
    render: container =>{
        let template = document.getElementById('giftListTemplate');
        let div = template.content.cloneNode(true);
        container.appendChild(div);

        //listen for any updates to gifts being added:
        console.log('GIFT: is liteneing for a gift being added');
        pubsub.subscribe('giftAdded', gift.giftAdded);
    },
    giftAdded: newGift => {}
}
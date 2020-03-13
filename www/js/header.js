import {pubsub} from './pubsub.js';

export const header = {

    //will initally render the container in the main.js
    render: container =>{
        let template = document.getElementById('headerTemplate');
        let div = template.content.cloneNode(true);

        //now add to the container and subscribe to other module feeds
        container.appendChild(div);
        pubsub.subscribe('personSelected', header.changeAddButton);
    },
    changeAddButton: target => {}
}
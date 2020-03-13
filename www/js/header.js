import {pubsub} from './pubsub.js';

export const header = {
    container: null, //get a reference to the container that loads this module
    //will initally render the container in the main.js

    //creating this load template helper function as its done multiple times
    loadTemplate: function() {
        let template = document.getElementById('headerTemplate');
        let div = template.content.cloneNode(true);
        return div; 
    }, 
    render: container =>{
        header.container = container; 
        let div = header.loadTemplate();
        //now add to the container and subscribe to other module feeds
        div.querySelector('button').addEventListener('click', ev => {pubsub.publish('showPersonForm')});
        container.appendChild(div);
        pubsub.subscribe('personSelected', header.showGiftForm);
        pubsub.subscribe('personDeselected', header.showPersonForm);
    },

    showGiftForm: target =>{
        header.container.innerHTML = "";
        let div = header.loadTemplate();
        div.querySelector('button').addEventListener('click', ev => {pubsub.publish('showGiftForm')});

        header.container.appendChild(div);
    },
    showPersonForm: target => {
        header.container.innerHTML = "";
        let div = header.loadTemplate();
        div.querySelector('button').addEventListener('click', ev => {pubsub.publish('showPersonForm')});
        header.container.appendChild(div);
    },

    // revealGiftForm: ev => {
    //     console.log('change the add button to show the add gift form');

    // },
    // revealPersonForm: ev => {
    //     console.log('change the add button to show the add personform')
    // }
}
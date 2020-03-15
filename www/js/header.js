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
        let btn = div.querySelector('button');
        btn.setAttribute('data-state', ""); //initilize the add button with no person selected
        btn.addEventListener('click', header.addPersonOrGift);
        container.appendChild(div);
        pubsub.subscribe('personSelected', header.showGiftForm);
        pubsub.subscribe('personDeselected', header.showPersonForm);
    },

    showGiftForm: target =>{
        console.log(target);

        // header.container.innerHTML = "";
        // let div = header.loadTemplate();
        // div.querySelector('button').addEventListener('click', ev => {pubsub.publish('showGiftForm')});
        document.getElementById('add-button').setAttribute('data-state', target);
        // header.container.appendChild(div);
    },
    showPersonForm: target => {
        console.log(target);
        document.getElementById('add-button').setAttribute('data-state', ""); //set to an empty string
        // header.container.innerHTML = "";
        // let div = header.loadTemplate();
        // div.querySelector('button').addEventListener('click', ev => {pubsub.publish('showPersonForm')});
        // header.container.appendChild(div);
    },

    //callback function for the button click event
    addPersonOrGift: ev =>{
        ev.preventDefault(); //stop from any accidnetal form submissions
        ev.stopPropagation(); //stop the event from bubbling up triggering other header events
        let event =  ev.currentTarget.getAttribute('data-state') == "" ? 'showPersonForm' : 'showGiftForm';
        pubsub.publish(event);
    }

    // revealGiftForm: ev => {
    //     console.log('change the add button to show the add gift form');

    // },
    // revealPersonForm: ev => {
    //     console.log('change the add button to show the add personform')
    // }
}
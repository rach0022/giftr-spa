
/*************************
*
*  @description This is the Main part of this JS applciation that will build/ display the interface
*
*  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
*
*  @version Mar 10, 2020
*
***********************/
//starter code for assignment based on : https://github.com/prof3ssorSt3v3/pubsub-demo

import {person} from './person.js';
import {personForm} from './personForm.js';
import {giftForm} from './giftForm.js'

let giftr = {
    appTextSource : {
        welcome : "Welcome to Giftr"
    },
    init : ev => {
        console.log(giftr.appTextSource.welcome);

        //get references to the container html elements
        let main = document.querySelector('main');
        let aside = document.querySelector('aside');

        //now render the proper modules in the proper container
        personForm.render(aside);
        person.render(main);
        giftForm.render(aside);

    }
};

document.addEventListener('DOMContentLoaded', giftr.init);
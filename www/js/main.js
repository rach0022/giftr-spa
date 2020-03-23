
/*************************
*
*  @description This is the Main part of this JS applciation that will build/ display the interface
*
*  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
*
*  @version Mar 23, 2020
*
***********************/
//starter code for assignment based on : https://github.com/prof3ssorSt3v3/pubsub-demo

import {person} from './person.js';
import {personForm} from './personForm.js';
import {giftForm} from './giftForm.js';
import {gift} from './gift.js';
import {header} from './header.js';
import { pubsub } from './pubsub.js';

let giftr = {
    appTextSource : {
        welcome : "Welcome to Giftr"
    },
    init : ev => {
        console.log(giftr.appTextSource.welcome);

        //get references to the container html elements
        let main = document.querySelector('main');
        let aside = document.querySelector('aside');

        //might switch to using pubsub for this if i find any good reason
        //to change anything else in the js 
        // pubsub.subscribe('mobileView', giftr.mobileView);
        // pubsub.subscribe('desktopView', giftr.desktopView);

        //now render the proper modules in the proper container
        personForm.render(aside);
        person.render(main);
        giftForm.render(aside);
        gift.render(aside);
        header.render(document.querySelector('header'));

        //add my resize observable to the header to check for page size
        let resizer = new ResizeObserver(giftr.resize);
        resizer.observe(document.querySelector('header'));
    },

    //callback function for the resize observer put onto the header
    resize: entries =>{
        entries.forEach(entry => {
            if(entry.contentRect){
                //header has been resized
                console.log(entry.contentRect.width, entry.contentRect.height);
                if(entry.contentRect.width > 800){
                    console.log('desktop view');
                    giftr.desktopView();
                } else {
                    console.log('mobile view');
                    giftr.mobileView(); 
                }
            }
        })
    },

    //helper function to switch to desktop view
    //just need to add the class desktop view to both the main and aside
    //and all the other containers/ forms
    desktopView: () =>{
        document.querySelector('main').classList.add('desktop-view');
        document.querySelector('aside').classList.add('desktop-view');
        document.querySelector('.person-container').classList.add('desktop-view');
        document.querySelector('.person-form').classList.add('desktop-view');
        document.querySelector('.gift-container').classList.add('desktop-view');
        document.querySelector('.gift-form').classList.add('desktop-view');
    },

    //helper function to switch back to mobile view
    //just need to nuke the calsslist for main and aside
    //then remove the desktop view class from the containers and forms
    mobileView: () =>{
        document.querySelector('main').classList = "";
        document.querySelector('aside').classList = "";
        document.querySelector('.person-container').classList.remove('desktop-view');
        document.querySelector('.person-form').classList.remove('desktop-view');
        document.querySelector('.gift-container').classList.remove('desktop-view');
        document.querySelector('.gift-form').classList.remove('desktop-view');
    }
};

document.addEventListener('DOMContentLoaded', giftr.init);
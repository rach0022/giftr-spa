//module used to animate elements in my html when they are clicked or what not

export const animate = {
    //helper function to turn off or on a class, paramter will be the class name that you want to
    //toggle and the function will then untoggle that class after a timeout (in ms) that is specified 
    //on a specific element (3 param), use case will look like tundra.toggleTimeOut('deactive', 400, document.getElementById('saved')); 
    toggleTimeout: (className, duration, element) =>{
        setTimeout(() =>{
            element.classList.toggle(className)
        }, duration);
        element.classList.toggle(className);
    }

}
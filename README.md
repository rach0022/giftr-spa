## GIFTR Single Page Application (SPA):

The assignment is to create a Single Page application for saving a list of people and their birthdates. For each person the user will be able to create a list of gift ideas. Each gift idea will have a label, a price, and potentially a location which could include a URL and/or a store name.

All the data will be saved in localStorage, so when the user returns they will still have the people and gift ideas from the last visit.

### Bugs to Fix: 
- [x] Figure out why sort does not work as intended (possibly because i was using getDay() not getDate() for the day number) || solution: convert the date values by first splitting the string by the hypen and then convert the date value with new Date also had to resort the list when the program is first opened as well
- [x] look into why december is treated as the first month (possibly when coverting the month value, by doing the minus 1 on dateArray[1]) || solution: forgot to subtract 1, maybe refactor code to make a function to return new dates based on the form given date value
- [ ] Figure out why delete does not remove from localStorage masterlist (only sometimes, it usually finds the correct one) (possibly a runtime error from saving and changing the program because the list object still contains the data from the previous run)
- [x] Figure out why when adding person the birthdate always set the day before the one chosen (look into INTL.dateTimeFormat, date is given correctly from form, see how the date is saved and look into how it is reloaded) || solution: the html form value comes as YYYY-MM-DD as a string so i split the string based on '-' and then gave the date[0] (date[1]-1) and date[2] values as the new date parameters to get a more accurate date value

### Logical Steps To Take Next:
- [x] add a message to the person/ gift list to show it is empty
- [x] style the person list differently for past birthdays versus current birthdays (check the date.now() vs the date of the birthday)
- [x] start using resize observer on the main.js to switch main and aside from 1 column layout (mobile first) to two column layout (desktop size)
- [x] change button to use data-state property (of person or gift) to determine which event to publish
- [x] add Header js file that will build the header module that contains the multiuse add button (will add person, or gift depending on view)
- [x] add a "refersh" button that will deselect the person
- [x] choose colour scheme (sorta, may need more colours) 
- [x] choose google fonts
- [x] host google fonts for offline usage (incase neetwork cant connect for some reason)

### Requirements:
- [x] All the functionality on one page
- [x] Button in header to Add new (person or idea)
- [ ] Use data-state property on the header to determine if you are adding person or idea
- [x] Mobile-first layout - one column when the layout is less than 800px wide.
- [x] Use Resize observer OR media queries to change the layout || Using resize observer
- [ ] Use a data-state property on person list to display one person or all the people
* [x] People list items should have
    * an id (not shown but in a data- property)
    * a name,
    * a date of birth (stored as a timestamp number)
    * be sorted according to month, then day
    * have either a button to see ideas or a button to delete the person [ ]
    * the delete button if showing one person
    * the gift idea button if showing all people
- [x] The list of people needs to be sorted month and day of birth.
- [x] Dates that have already passed for the current year should be styled differently than the upcoming dates.
- [x] Gift idea list is tied to a single person (the selected person)
- [x] Each person will be saved with a new key in localStorage.
- [x] The id for the person should be part of the key. Eg: giftr-15803293837366500
- [x] The list of gifts belonging to each person will be an array inside the person stored in localStorage.
- [x] Each gift for each person can have the following properties:
    * an id (not shown but in a data- property)
    * a label/title/name
    * a price (saved as a number, not a string)
    * a location, which has two child properties - url and store
- [x] When a person is selected and the gift list is being shown the add button in the header should show the add gift idea form area
- [x] When no person is selected then the add button in the header should should the add person form area.
- [x] The people list and gift lists should both have a message, if empty, that says to click the add button to create a person or gift.
- [x] The functions to build the list of people or the list of gifts should use an array in the app each time, not always go back to read from localStorage. Only read from localStorage when the app first loads.
- [x] Write to localStorage when a person or gift is added or deleted.
- [x] The forms to add new people or ideas should automatically be cleared out after the new person or gift is created.
- [x] Use the Intl date formatter for the birthdays.
- [x] Use the Intl currency formatter for the gift price value.
- [x] There are several ways to handle state in this application
    1. Use the data-state attribute to effect the layout through the CSS and use your own JavaScript to change the value of data-state and then run other code.
    2. Use a Mutation observer to watch the data-state attributes and trigger the changes in the interface.
    3. Use a Finite State Machine to handle the changes and then set the data-state attribute to update the layout through CSS.
    4. (SELECTED) use the pubsub design methodology to send changes to different parts of the program through the pubsub router
- [x] No need for the History API, pushState(), replaceState() or popstate since this is all on one page and we will always start from the people list.
- [ ] Design your app with a dark theme. (Dark background and light text)

### To Do: 
- [ ] select a color scheme for the app, need to choose a dark theme for a change
- [x] select the fonts you want to use for your app (serif: BioRhyme and sans-serif: Quicksand)
- [ ] finish designing the giftr-application (using SASS)
- [ ] create some keyframe animations for giftr to use (possibly when selecting and deselecting a person, or adding/ removing a gift idea)
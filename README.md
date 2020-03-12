## GIFTR Single Page Application (SPA):

The assignment is to create a Single Page application for saving a list of people and their birthdates. For each person the user will be able to create a list of gift ideas. Each gift idea will have a label, a price, and potentially a location which could include a URL and/or a store name.

All the data will be saved in localStorage, so when the user returns they will still have the people and gift ideas from the last visit.

### Bugs to Fix: 
- [ ] Figure out why sort does not work as intended

### Logical Steps To Take Next in JS Code:
- [ ] implement the mutation observer to change page based on browser size

### Requirements:
- [ ] All the functionality on one page
- [ ] Button in header to Add new (person or idea)
- [ ] Use data-state property on the header to determine if you are adding person or idea
- [ ] Mobile-first layout - one column when the layout is less than 800px wide.
- [ ] Use Resize observer OR media queries to change the layout
- [ ] Use a data-state property on person list to display one person or all the people
* [ ] People list items should have
    * an id (not shown but in a data- property)
    * a name,
    * a date of birth (stored as a timestamp number)
    * be sorted according to month, then day
    * have either a button to see ideas or a button to delete the person
    * the delete button if showing one person
    * the gift idea button if showing all people
- [ ] The list of people needs to be sorted month and day of birth.
- [ ] Dates that have already passed for the current year should be styled differently than the upcoming dates.
- [ ] Gift idea list is tied to a single person (the selected person)
- [ ] Each person will be saved with a new key in localStorage.
- [ ] The id for the person should be part of the key. Eg: giftr-15803293837366500
- [ ] The list of gifts belonging to each person will be an array inside the person stored in localStorage.
- [ ] Each gift for each person can have the following properties:
    * an id (not shown but in a data- property)
    * a label/title/name
    * a price (saved as a number, not a string)
    * a location, which has two child properties - url and store
- [ ] When a person is selected and the gift list is being shown the add button in the header should show the add gift idea form area
- [ ] When no person is selected then the add button in the header should should the add person form area.
- [ ] The people list and gift lists should both have a message, if empty, that says to click the add button to create a person or gift.
- [ ] The functions to build the list of people or the list of gifts should use an array in the app each time, not always go back to read from localStorage. Only read from localStorage when the app first loads.
- [ ] Write to localStorage when a person or gift is added or deleted.
- [ ] The forms to add new people or ideas should automatically be cleared out after the new person or gift is created.
- [ ] Use the Intl date formatter for the birthdays.
- [ ] Use the Intl currency formatter for the gift price value.
- [ ] There are several ways to handle state in this application
    1. Use the data-state attribute to effect the layout through the CSS and use your own JavaScript to change the value of data-state and then run other code.
    2. Use a Mutation observer to watch the data-state attributes and trigger the changes in the interface.
    3. Use a Finite State Machine to handle the changes and then set the data-state attribute to update the layout through CSS.
- [ ] No need for the History API, pushState(), replaceState() or popstate since this is all on one page and we will always start from the people list.
- [ ] Design your app with a dark theme. (Dark background and light text)

### To Do: 
- [ ] select a color scheme for the app
- [ ] select the fonts you want to use for your app (serif: __ and sans-serif: __)
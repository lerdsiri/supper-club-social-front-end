# Overview

Supper Club Social is a full stack project made as part of the assignment at the coding bootcamp, Integrify Academy, that combines my two passions - cooking and coding. This project envisions a community in which users may sign up to attend lunch or dinner parties organized by other users in the community at their homes. This helps showcase excellent home cooks and connect the community together. And what better way to get to know your neighbors than with food! 

This is a solo project - github automatically added the instructor as a co-contributor who set up the original private repository under Integrify Academy github account for ease of turning in the assignment. The codes were otherwise written independently.

## Links

The frontend was launched on Netlify at: https://siri-supper-club-social.netlify.app/ 

The backend was launched on Heroku. The backend code can be found here: https://github.com/lerdsiri/supper-club-social

## Tech Stack

Frontend: React, Redux Toolkit, Typescript, CSS, HTML, JavaScript
Backend: Node.js, Express, MongoDB

## Features

### Home

Sign up - Any new users may sign up. The inputs are verified through Formik schema. Password is encrypted in the backend with bcrypt.

Login - Any existing users may log in with email and password. Logged-in users may navigate the page with the token provided by the backend. All routes are protected.

You may test the page by signing up as a new user. Alternatively, you may use the following login/password:

Login as Angela Merkel (user): email - angela@gmail.com, password - angela@gmail.com
Login as Admin: email - admin@gmail.com, password - admin@gmail.com

(Please do not delete these profiles so that other people can also try using them)

The only difference between user and admin is that admin will have the admin console in the nav bar.

### MyPage

Once signed in, user is directed to MyPage. 

Left column: Nav bar with the following menu:
- MyPage
- MyProfile
- MyMessages
- MyEvents
- Logout
- Admin console (only shown if logged in as Admin)

Middle Column: show events in user's current city by default
- "Show events in your city" button: go back to list all events in user's current city if the search results are showing events in another city
- Search feature: search events in another city (events have been pre-loaded only for Berlin and Munich, but you are welcomed to create new events in any cities under MyEvents)

User can add any events to cart. The "Add to Cart" button is disabled if the event is the one that user is organizing or already attending or if it has been added to cart.

Right column: cart and payment
- "Remove" button: remove event from cart
- "Checkout" button: show payment form 
- "Pay" button: no actual payment has been set up. You can enter any random 16-digit credit card number. Once "paid", the events are removed from cart and placed on user's list of eventsAsAttendees (shwon in MyEvents page)

### MyProfile

Show user's current profile by default.
- "Edit Profile" button: allow user to upload a profile image to replace the current one; allow user to edit profile information (except username, email, and password)
- "Delete Profile" button: delete user's profile and redirect user back to signup/login page

Uploaded images are stored on Cloudinary.

### MyMessages

Each event is automatically assigned a message board (conversation) for the organizing user and attendees to communicate with one another. MyMessages page shows the message boards for all the events that the user is organizing and attending. Messages are grouped by event and shown in reverse chronological order (latest message at the top).

If you want to see messages that have been previously posted by various users, check out "One Night in Berlin" event by adding it to cart and fake-pay so that its message board shows up on MyMessages page. If you sign in as Angela Merkel, the message board for "One Night in Berlin" event will already be shown on MyMessages page.

Feel free to post new messages to any of the events!

### MyEvents 

This page shows all the events that user is organizing or attending. Event that user is attending are those that user has paid for.

- "Create New Event" button: shows hidden "Create New Event" form that user can fill out to create a new event. Once created, the event will show up on the list of events shown on MyPage if the search result is showing events in the city in which the newly created event will take place.

### Logout

This link logs user out and redirects user back to signup/login page.

### Admin Console 

This link is only shown if logged in as Admin. Admin console allows admin to ban users. Once banned, user will no longer be able to log in.

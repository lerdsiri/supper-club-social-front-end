import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import eventpic from 'assets/images/event-pic.jpg';

import { RootState } from 'types';
import { userActions } from 'store/userSlice';
import { eventActions } from 'store/eventSlice';
import styles from 'components/EventList/EventList.module.css';

export default function EventSearch() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const user = useSelector((state: RootState) => state.user.user);
  const eventsByCity = useSelector((state: RootState) => state.event.eventsByCity);

  const [ searchTerm, setSearchTerm ] = useState(user.location.city);
  const [ showEventsInUserHomeCity, setShowEventsInUserHomeCity ] = useState(true);

  // Fetch events by city based on the search term whenever the search term changes.
  // Then store the list of events by city in redux store to be displayed.
  useEffect( () => {
      fetch(`https://supper-club-social-backend.herokuapp.com/api/v1/events/city/${searchTerm}`, {
              headers: { Authorization: `Bearer ${token}`}
          })
          .then((response) => response.json())
          .then((data) => {
            dispatch(eventActions.getEventsByCity({events: data}));
          })
          .catch((error) => console.log("Error loading events.", error))
  }, [searchTerm, token, dispatch]);

  // Handler for "Show events in your city" button at the top.
  // This handler sets the search term to user's current city.
  const handleClickShowEventsInYourCity = (): void => {
    setSearchTerm(user.location.city);
    setShowEventsInUserHomeCity(true);
  }

  //    User's search input is assigned to dynamicSearchTerm first as user is 
  // typing. dynamicSearchTerm is then only assigned to searchTerm useState after 
  // user clicks Search button. This is to avoid the searchTerm from being changed 
  // after user's each keystroke, which would otherwise prompt data fetching too 
  // many times.
  let dynamicSearchTerm = "";
  const handleChangeSearchByCity = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    dynamicSearchTerm = evt.target.value;
  }

  const handleClickSearchByCity = (evt: React.MouseEvent<HTMLButtonElement>) => {
    setSearchTerm(dynamicSearchTerm.toLowerCase());
    setShowEventsInUserHomeCity(false);
  }

  //    Handler to add event to cart in the backend and then update user's state 
  // in redux store.
  const handleClickAddToCart = (eventId: string): void => {
    axios
      .patch(`https://supper-club-social-backend.herokuapp.com/api/v1/users/${user._id}/cart/events/${eventId}`, {}, {
        headers: { Authorization: `Bearer ${token}`}
      })
      .then((data) => dispatch(userActions.updateUser({updatedUser: data.data})))
  }

  return (
    <div className={styles["event-list-container"]}>
      {/* Top part - show events in user's city and search bar */}
      <div>
        <button className={styles.button} onClick={handleClickShowEventsInYourCity}>Show events in your city</button>
        <p>OR</p>
        <div className={styles.SearchBar}>
          <label htmlFor="search-term" className={styles["small-text"]}>
            <b>Search events by city's name</b><br />
            Note: Events have been preloaded only in Berlin and Munich, but you are welcomed to create new events in any cities under My events section.
          </label><br /><br />
          <input
            className={styles["search-box"]}
            type="text"
            onChange={handleChangeSearchByCity}
            id="search-term"
            name="search-term"
          /><br />
          <button className={styles["search-button"]} onClick={handleClickSearchByCity}>Search</button>
        </div>
        <br />
      </div>
      {/* Bottom part - display events in user's city or based on searchTerm */}
      <div>
        {showEventsInUserHomeCity && <h4>Events in your city</h4>}
        {!showEventsInUserHomeCity && <h4>Events in {searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1).toLowerCase()}</h4>}
      </div>
      <div>   
        {eventsByCity?.length === 0 && <p className={styles["small-text"]}>There are no events in {searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1).toLowerCase()} at the moment</p>}
        {eventsByCity?.map((anEvent) => (
          <div className={styles["event-box"]} key={anEvent._id}>
            <div><img src={eventpic} alt="homecooked meal" /></div>
            <div className={styles["event-title"]}>{anEvent.eventName}</div>
            <div className={styles["small-text"]}>Where: {anEvent.eventLoc.city}, {anEvent.eventLoc.country}</div>
            <div className={styles["small-text"]}>When: {anEvent.eventDateTime}</div>
            <div className={styles["small-text"]}>Status: {anEvent.status}</div>
            <br />
            <div><b>Cuisine: </b>{anEvent.cuisine}</div>
            <div><b>No. of attendees allowed: </b>{anEvent.numOfAttendeesAllowed}</div>
            <div><b>Response By: </b>{anEvent.responseDateline}</div> 
            <br />
            <div><b>Description: </b>{anEvent.description}</div>
            <button 
              onClick={() => handleClickAddToCart(anEvent._id)}
              className={
                //     Button to be grayed out if event has already been added to the cart, or
                // if user is organizing the event, or if user has already purchased the event 
                user.cart.includes(anEvent._id) || user.eventsAsOrganizer.includes(anEvent._id) || user.eventsAsAttendee.includes(anEvent._id) 
                ? styles["inactive-button"] 
                : styles.button
              }
            >
              Add event to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

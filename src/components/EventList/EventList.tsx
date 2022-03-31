import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import eventpic from 'assets/images/event-pic.jpg';

import { userActions } from 'store/userSlice';
import { eventActions } from 'store/eventSlice';
import { RootState } from 'types';
import 'components/EventList/EventList.css';

export default function EventSearch() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const user = useSelector((state: RootState) => state.user.user);
  const eventsByCity = useSelector((state: RootState) => state.event.eventsByCity);

  const [ searchTerm, setSearchTerm ] = useState(user.location.city);
  const [ showEventsInUserHomeCity, setShowEventsInUserHomeCity ] = useState(true);
 
  //To redo - fetch all events --> then filter by city searchterm in frontend 
  //default: show events in my city
  //alternate: show events from searched city
  useEffect( () => {
      fetch(`http://localhost:5000/api/v1/events/city/${searchTerm}`, {
              headers: { Authorization: `Bearer ${token}`}
          })
          .then((response) => response.json())
          .then((data) => {
            dispatch(eventActions.getEventsByCity({events: data}));
          })
          .catch((error) => console.log("Error loading events.", error))
  }, [searchTerm, token, dispatch]);

  const handleClickShowEventsInYourCity = (): void => {
    setSearchTerm(user.location.city);
    setShowEventsInUserHomeCity(true);
  }

  let dynamicSearchTerm = "";
  const handleChangeSearchByCity = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    dynamicSearchTerm = evt.target.value;
  }

  const handleClickSearchByCity = (evt: React.MouseEvent<HTMLButtonElement>) => {
    setSearchTerm(dynamicSearchTerm);
    setShowEventsInUserHomeCity(false);
  }

  const handleClickAddToCart = (eventId: string): void => {
    axios
      .patch(`http://localhost:5000/api/v1/users/${user._id}/cart/events/${eventId}`, {}, {
        headers: { Authorization: `Bearer ${token}`}
      })
      .then((data) => dispatch(userActions.updateUser({updatedUser: data.data})))
  }

  return (
    <div className="event-list-container">
      <div>
        <button className="button" onClick={handleClickShowEventsInYourCity}>Show events in your city</button>
        <p>OR</p>
        <div className="SearchBar">
          <label htmlFor="search-term" className="small-text">Search events by city's name</label><br /><br />
          <input
            className="search-box"
            type="text"
            onChange={handleChangeSearchByCity}
            id="search-term"
            name="search-term"
          /><br />
          <button className="search-button" onClick={handleClickSearchByCity}>Search</button>
        </div>
        <br />
      </div>
      <div>
        {showEventsInUserHomeCity && <h4>Events in your city</h4>}
        {!showEventsInUserHomeCity && <h4>Events in {searchTerm}</h4>}
      </div>
      <div>   
        {eventsByCity.length === 0 && <p className="small-text">There are no events in {searchTerm} at the moment</p>}
        {eventsByCity?.map((anEvent) => (
          <div className="event-box" key={anEvent._id}>
            <div><img src={eventpic} alt="homecooked meal" /></div>
            <div className="event-title">{anEvent.eventName}</div>
            <div className="small-text">Where: {anEvent.eventLoc.city}, {anEvent.eventLoc.country}</div>
            <div className="small-text">When: {anEvent.eventDateTime}</div>
            <div className="small-text">Status: {anEvent.status}</div>
            <br />
            <div><b>Cuisine: </b>{anEvent.cuisine}</div>
            <div><b>No. of attendees allowed: </b>{anEvent.numOfAttendeesAllowed}</div>
            <div><b>Response By: </b>{anEvent.responseDateline}</div> 
            <br />
            <div><b>Description: </b>{anEvent.description}</div>
            <button 
              onClick={() => handleClickAddToCart(anEvent._id)}
              className={
                user.cart.includes(anEvent._id) || user.eventsAsOrganizer.includes(anEvent._id) || user.eventsAsAttendee.includes(anEvent._id) 
                ? "inactive-button" 
                : "button"
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

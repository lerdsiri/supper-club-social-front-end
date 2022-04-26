import { useState } from 'react';
import { useSelector } from 'react-redux';
import eventpic from 'assets/images/event-pic.jpg';

import { RootState } from 'types';
import TopBanner from 'components/TopBanner/TopBanner';
import NavBar from 'components/NavBar/NavBar';
import CreateEvent from 'components/CreateEvent/CreateEvent';
import styles from 'pages/MyEvents/MyEvents.module.css';

export default function MyEvents() {
  const [ createNewEvent, setCreateNewEvent ] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const events = useSelector((state: RootState) => state.event.events);

  return (
    <div className={styles.container}>
        <TopBanner />
        <main className={styles["main-content"]}>
            {/* Left column */}
            <nav>
                <NavBar />
            </nav>
            {/* Right column */}
            <section className={styles["main-content__event-details"]}>
                {/* Right column - top - create new event */}
                <div>
                  <button className={styles.button} onClick={() => setCreateNewEvent(!createNewEvent)}>Create New Event</button>
                </div>
                {createNewEvent && <CreateEvent />}
                {/* Right column - middle - Events I'm Organizing */}
                <div>
                  <h4>EVENTS I'M ORGANIZING</h4>
                  {(user.eventsAsOrganizer.length === 0) && <p>You are currently not organizing any events.</p>}
                  {/* Loop through user's list of eventsAsOrganizers. For each eventAsOrganizer,
                  loop through list of all events to find the matching event id and retrieve
                  event info. 
                      Backend could be improved by returning user object whose list of 
                  eventsAsOrganizer has been populated with necessary info. But this could mean
                  always having to populate this field in all related backend routes that
                  returns user object because frontend alsmost always updates user object 
                  in redux store everytime there is a request sent to the backend that could
                  affect user object. But in many instances in the frontend, the populated
                  field is actually not needed. Does this improve or worsen the speed overall? */}
                  {user.eventsAsOrganizer.map((organizedEventId) => (
                    events.map((oneEvent) => 
                      oneEvent._id.toString() === organizedEventId
                      ? 
                        <div className={styles["event-box"]} key={oneEvent._id}>
                          <div><img src={eventpic} alt="homecooked meal" /></div>
                          <div className={styles["event-title"]}>{oneEvent.eventName}</div>
                          <div className={styles["small-text"]}>Where: {oneEvent.eventLoc.city}, {oneEvent.eventLoc.country}</div>
                          <div className={styles["small-text"]}>When: {oneEvent.eventDateTime}</div>
                          <div className={styles["small-text"]}>Status: {oneEvent.status}</div>
                          <br />
                          <div><b>Cuisine: </b>{oneEvent.cuisine}</div>
                          <div><b>No. of attendees allowed: </b>{oneEvent.numOfAttendeesAllowed}</div>
                          <div><b>Response By: </b>{oneEvent.responseDateline}</div> 
                          <br />
                          <div><b>Description: </b>{oneEvent.description}</div>
                        </div>
                      : null
                    )
                  ))}
                </div>
                {/* Right column - bottom - Events I'm Attending */}
                <div>
                  <h4>EVENTS I'M ATTENDING</h4>
                  {(user.eventsAsAttendee.length === 0) && <p>You are not attending any events.</p>}
                  {/* See inline comments above related to Events I'm Organizing */}
                  {user.eventsAsAttendee.map((attendEventId) => (
                    events.map((oneEvent) => 
                      oneEvent._id.toString() === attendEventId
                      ? 
                        <div className={styles["event-box"]} key={oneEvent._id}>
                          <div><img src={eventpic} alt="homecooked meal" /></div>
                          <div className={styles["event-title"]}>{oneEvent.eventName}</div>
                          <div className={styles["small-text"]}>Where: {oneEvent.eventLoc.city}, {oneEvent.eventLoc.country}</div>
                          <div className={styles["small-text"]}>When: {oneEvent.eventDateTime}</div>
                          <div className={styles["small-text"]}>Status: {oneEvent.status}</div>
                          <br />
                          <div><b>Cuisine: </b>{oneEvent.cuisine}</div>
                          <div><b>No. of attendees allowed: </b>{oneEvent.numOfAttendeesAllowed}</div>
                          <div><b>Response By: </b>{oneEvent.responseDateline}</div> 
                          <br />
                          <div><b>Description: </b>{oneEvent.description}</div>
                        </div>
                      : null
                    )
                  ))}
                </div>
            </section>
        </main>
    </div>
  )
}

import { useState } from 'react';
import { useSelector } from 'react-redux';
import eventpic from 'assets/images/event-pic.jpg';

import TopBanner from 'components/TopBanner/TopBanner';
import NavBar from 'components/NavBar/NavBar';
//import UserProfile from 'components/UserProfile/UserProfile';
import CreateEvent from 'components/CreateEvent/CreateEvent';
import { RootState } from 'types';
import styles from 'pages/MyEvents/MyEvents.module.css';

export default function MyEvents() {
  const [ createNewEvent, setCreateNewEvent ] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const events = useSelector((state: RootState) => state.event.events);

  return (
    <div className={styles.container}>
        <TopBanner />
        <main className={styles["main-content"]}>
            <nav>
                <NavBar />
            </nav>
            <section className={styles["main-content__event-details"]}>
                <div>
                  <button className={styles.button} onClick={() => setCreateNewEvent(!createNewEvent)}>Create New Event</button>
                </div>
                {createNewEvent && <CreateEvent />}
                <div>
                  <h4>EVENTS I'M ORGANIZING</h4>
                  {(user.eventsAsOrganizer.length === 0) && <p>You are currently not organizing any events.</p>}
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
                <div>
                  <h4>EVENTS I'M ATTENDING</h4>
                  {(user.eventsAsAttendee.length === 0) && <p>You are not attending any events.</p>}
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

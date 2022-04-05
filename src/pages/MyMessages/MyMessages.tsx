import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import eventpic from 'assets/images/event-pic.jpg';
import axios from 'axios';

import TopBanner from 'components/TopBanner/TopBanner';
import NavBar from 'components/NavBar/NavBar';
//import UserProfile from 'components/UserProfile/UserProfile';
import { RootState } from 'types';
import { conversationActions } from 'store/conversationSlice';
import 'pages/MyMessages/MyMessages.css';

export default function MyMessages() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const token = useSelector((state: RootState) => state.user.token);
  const events = useSelector((state: RootState) => state.event.events);
  const conversations = useSelector((state: RootState) => state.conversation.conversations);

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/conversations`, {
      headers: { Authorization: `Bearer ${token}`}
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(conversationActions.getConversations({conversations: data}));
      })
  }, [token, dispatch]) 

  let newMessage = "";
  const handleChangeNewMessage = (evt: React.ChangeEvent<HTMLTextAreaElement> ): void => {
    newMessage = evt.target.value;
  }

  const handleClickPostMessage = (conversationId: string): void => {
    axios
      .put(`http://localhost:5000/api/v1/conversations/${conversationId}/users/${user._id}`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } })
      .then((data) => {
        fetch(`http://localhost:5000/api/v1/conversations`, {
          headers: { Authorization: `Bearer ${token}`}
        })
          .then((res) => res.json())
          .then((data) => dispatch(conversationActions.getConversations({conversations: data})));
      })
      .catch((error) => console.log("Error posting new message.", error))
  }

  return (
    <div className="container">
        <TopBanner />
        <main className="main-content">
            <nav>
                <NavBar />
            </nav>
            <section className="main-content__conversation-details">
                <div>
                  <h4>MESSAGE BOARDS FOR EVENTS I'M ORGANIZING</h4>
                  {(user.eventsAsOrganizer.length === 0) && <p>You are currently not organizing any events.</p>}
                  {user.eventsAsOrganizer?.map((organizedEventId) => (
                    events?.map((oneEvent) => 
                      oneEvent._id.toString() === organizedEventId
                      ? 
                        <div className="conversation-box" key={oneEvent._id}>
                          <div className="conversation-title">{oneEvent.eventName}</div>
                          <div className="small-text">Where: {oneEvent.eventLoc.city}, {oneEvent.eventLoc.country}</div>
                          <div className="small-text">When: {oneEvent.eventDateTime}</div>
                          <div className="small-text">Status: {oneEvent.status}</div>
                          <div className="small-text">No. of attendees allowed: {oneEvent.numOfAttendeesAllowed}</div>
                          <br />
                          {
                            conversations?.map((conversation) =>                   
                              conversation.event === organizedEventId
                              ?
                                <div key={conversation._id}>
                                  <div>
                                    <label htmlFor="new-message">New Message</label><br /><br />
                                    <textarea
                                      className="message-box"
                                      onChange={handleChangeNewMessage}
                                      id="new-message"
                                      name="new-message"
                                    /><br />
                                    <button className="post-message-button" onClick={() => handleClickPostMessage(conversation._id)}>Post</button>
                                  </div>
                                  <div>
                                    {conversation.messages?.map((message) => (
                                      <div className="existing-message" key={message._id}>
                                        <img src={message.author.profilePic} alt="author profile pic" />
                                        <div className="author-info">
                                          <div className="small-text"><b>{message.author.username}</b>:</div>
                                          <div className="small-text">{message.messageDateTime}</div>
                                        </div>
                                        <div className="message-content">{message.content}</div>
                                      </div>
                                    ))}
                                  </div>                                  
                                </div>
                              : null      
                            )  
                          }                          
                        </div>
                      : null
                    )
                  ))}
                </div>
                <div>
                  <h4>MESSAGE BOARDS FOR EVENTS I'M ATTENDING</h4>
                  {(user.eventsAsAttendee.length === 0) && <p>You are currently not attending any events.</p>}
                  {user.eventsAsAttendee?.map((attendedEventId) => (
                    events?.map((oneEvent) => 
                      oneEvent._id.toString() === attendedEventId
                      ? 
                        <div className="conversation-box" key={oneEvent._id}>
                          <div className="conversation-title">{oneEvent.eventName}</div>
                          <div className="small-text">Where: {oneEvent.eventLoc.city}, {oneEvent.eventLoc.country}</div>
                          <div className="small-text">When: {oneEvent.eventDateTime}</div>
                          <div className="small-text">Status: {oneEvent.status}</div>
                          <div className="small-text">No. of attendees allowed: {oneEvent.numOfAttendeesAllowed}</div>
                          <br />
                          {
                            conversations?.map((conversation) =>                   
                              conversation.event === attendedEventId
                              ?
                                <div key={conversation._id}>
                                  <div>
                                    <label htmlFor="new-message">New Message</label><br /><br />
                                    <textarea
                                      className="message-box"
                                      onChange={handleChangeNewMessage}
                                      id="new-message"
                                      name="new-message"
                                    /><br />
                                    <button className="post-message-button" onClick={() => handleClickPostMessage(conversation._id)}>Post</button>
                                  </div>
                                  <div>
                                    {conversation.messages?.map((message) => (
                                      <div className="existing-message" key={message._id}>
                                        <img src={message.author.profilePic} alt="author profile pic" />
                                        <div className="author-info">
                                          <div className="small-text"><b>{message.author.username}</b>:</div>
                                          <div className="small-text">{message.messageDateTime}</div>
                                        </div>
                                        <div>{message.content}</div>
                                      </div>
                                    ))}
                                  </div>                                  
                                </div>
                              : null      
                            )  
                          }                          
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

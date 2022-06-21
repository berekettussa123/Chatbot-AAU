import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import MessageIcon from '@mui/icons-material/Message';
import Modal from '../modal/Modal';
import MapImage from './MapImage';
import { IsopenContext } from '../context/isopenContext';
import { renderToString } from 'react-dom/server';
import Box from './box';
import './chatbot.css';
import Options from './Options';
import io from 'socket.io-client';
import {TransformWrapper, TransformComponent} from 'react-zoom-pan-pinch'
//blue color 0e2e5f
//light blue d2dae5
function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [otherList, setOtherList] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const { isOpen, dispatch } = useContext(IsopenContext);
  const [showwAnswered, setShowAnswered] = useState(true);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [showImage, setShowImage] = useState("message-container")
  const [style, setStyle] = useState('');
  const [error, setError] = useState();
  const [mapImage, setMapImage] = useState();
  const [showOption, setShowOption] = useState(true);
  const [currentImage, setCurrentImage] = useState(true);
  const [forImage, setForImage] = useState(false);
  const [recommendation,setRecommendation] = useState([])


  const changeStyle = () => {
    console.log('you just clicked');
    setStyle('choice');
  };
  const handleShow=()=>{
    setShowImage(!currentImage? "message-container":'message-hidden')
    setCurrentImage(! currentImage)
    setForImage( !forImage)
}
console.log(currentImage);
// useEffect(()=>{
//   setShowImage(currentImage? "message-container":'message-hidden')
//   setCurrentImage(!currentImage)
// },[currentImage])

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: 'room',
        author: 'username',
        message: currentMessage,
        type: 'text',
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit('get_answer_event', messageData.message);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');
      setShowRecommendation(true);
      setError('');
      setShowOption(true);
    } else {
      setError('እባክዎ ጥያቄዎን ያስገቡ');
    }
  };
  // console.log('o' + otherList);

  useEffect(() => {
    // for (let step = 0; step < messageList.length; step++) {
    //   // Runs 5 times, with values of step 0 through 4.
    //   //
    //   if(File){
    //       if (messageList[step].toString().includes('[object ArrayBuffer]')) {
    //       console.log(messageList[step]);
    //       const arrayBufferView = new Uint8Array(messageList[step].message);
    //       const blob = new Blob([arrayBufferView], { type: 'image/png' });
    //       const img = URL.createObjectURL(blob);
    //       // reader.readAsDataURL(blob);
    //       // reader.onloadend = () => {
    //         // };
    //         console.log('oooooooooo' + messageList[step]);
    //         setMapImage(img);
    //       }
    //     // URL.revokeObjectURL(img)
    //   }
    // }
  }, [messageList]);
  // console.log('cccccc' + mapImage);


  useEffect(() => {
    socket.on('chatbot_response_event', (data) => {
      if (data.message) {
        setMessageList((list) => [...list, data]);
      } else if (!data.toString().includes('[object ArrayBuffer]')) {
        setMessageList((list) => [...list, data]);
      }
      // Runs 5 times, with values of step 0 through 4.
      //

      // console.log(messageList[step]);
      // const arrayBufferView = new Uint8Array(data);
      // const blob = new Blob([arrayBufferView], { type: 'image/png' });
      // const img = URL.createObjectURL(blob);
      // // reader.readAsDataURL(blob);
      // // reader.onloadend = () => {
      // // };

      // console.log('oooooooooo' + data);
      // setMapImage(img);

      // URL.revokeObjectURL(img)
      if (messageList.author !== username) {
        setOtherList((list) => [...list, data]);
      }
    });
  }, [messageList.author, socket, username]);
  useEffect(() => {
    socket.on('chatbot_response_event', (data) => {
      if (data.toString().includes('[object ArrayBuffer]')) {
        const arrayBufferView = new Uint8Array(data);
        const blob = new Blob([arrayBufferView], { type: 'image/png' });
        const img = URL.createObjectURL(blob);
        // reader.readAsDataURL(blob);
        // reader.onloadend = () => {
        // };
        setMessageList((list) => [...list, img]);
        console.log('oooooooooo' + data);
        setMapImage(img);
      }
    });
  }, [socket]);
  console.log('mmmmmmmmmm' + messageList);

  useEffect(()=>{
    socket.on('recommendation_event', (data) =>{
      setRecommendation(data)
      // console.log(data)
    })
  },[socket])
  console.log("this is recommendation" + recommendation);

  // const mapSocket = io.connect('ws://localhost:5000/');
  // mapSocket.on('connect', function () {
  //   console.log('connected');
  // });
  // useEffect(()=>{

  //   socket.emit('get_map_event');
  // },[socket])

  // socket.on('map_response_event', (data) => {
  //   console.log("helllo"+data);

  //   var arrayBufferView = new Uint8Array(data);
  //   var blob = new Blob([arrayBufferView], { type: 'image/png' });

  //   setMapImage(URL.createObjectURL(blob));
  //   // document.getElementById("map_display").src = img_url;
  // });
  // console.log("i am from back" + mapImage);

  // useEffect(() => {
  //   socket.on('map_response_event', (data) => {
  //     setMapImage((list) => [...list, data]);
  //   });
  // }, [socket]);

  const handleResolve = async () => {
    const answerMessage = messageList.at(-1);
    const questionMessage = messageList.at(-2).message;
    const res = await axios.post(
      'https://amharic-chatbot-for-aau-admin.herokuapp.com/savequestion',
      { question: questionMessage }
    );
    const sentData = await axios.put(
      'https://amharic-chatbot-for-aau-admin.herokuapp.com/updatequestionstate',
      { question_id: res.data.question_id, resolved: true }
    );

    // console.log('question' + questionMessage);
    // console.log('answer' + answerMessage);
    console.log(sentData);
  };
  const handleUnresolve = async () => {
    const answerMessage = messageList.at(-1);
    const questionMessage = messageList.at(-2).message;
    const res = await axios.post(
      'https://amharic-chatbot-for-aau-admin.herokuapp.com/savequestion',
      { question: questionMessage }
    );
    const sentData = await axios.put(
      'https://amharic-chatbot-for-aau-admin.herokuapp.com/updatequestionstate',
      { question_id: res.data.question_id, resolved: false }
    );

    // console.log('question' + questionMessage);
    // console.log('answer' + answerMessage);
    console.log(sentData);
  };
  const handleClick = () => {
    setShowChat(!showChat);
    dispatch({ type: 'HIDE' });
  };

  for (var i = 0; i < messageList.length; i++) {
    if (i % 2 !== 0) messageList[i] = messageList[i] + ' '.repeat(3);
  }
  // console.log('lassttttttttt' + messageList.at(-1));
  const clickList = (id) => {
    if (document.getElementById('outer-list') != null) {
      const idPost =
        document.getElementsByClassName('inner-list-item')[id].innerHTML;
      console.log(idPost);
      setCurrentMessage(idPost);
    }
  };

  const question = [
    ' ከማታ ወደ ቀን መቀየር ይቻላል?',
    'ከርቀት ወደ ማታ መቀየር እችላለሁ  ',
    ' ዲፓርትመንት መቀየር ይቻላል',
    'እንዴት ነው ዲፓርትመንት መቀየር የምችለው',
    ' ህዋሳት ጨርቁ አይሶቶፕ የምትይኝ መንደፊያን ፈጥነው አንዲወጣ ለመቀሌ የተላከ ለሞሮኮ',
    'የፀበል ካናደዳት ከአባወራ ለመረጡን እንደእቤቱ ትብብሩ',
  ];

  return (
    <div className="chatmain">
      <Modal showChat={showChat} />
      {showChat && (
        <div className="chatAndRecom">
          {/* <img
            style={{
              width: '100px ',
              height: '30px',
              objectFit: 'contain',
            }}
            id="map_display"
            src={mapImage}
            onerror="this.style.display='none'"
            alt=""
          ></img> */}
          {showRecommendation && (
            <div className="reco">
              <div className="recCont">
                {/* <img id="map_display" src={mapImage} alt=""></img> */}
                <p>ሰዎች እነዚንም ጠይቀዋል </p>
                <p
                  className="cancelX"
                  onClick={() => setShowRecommendation(false)}
                >
                  X
                </p>
              </div>
              <ul id="outer-list">
                {recommendation?.map((index, id) => (
                  <li
                    key={id}
                    className="inner-list-item"
                    onClick={() => clickList(id)}
                  >
                    {index}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="chat-window">
            <div className="chat-header">
              <p>
                <div>AAU Chatbot </div>
                <div className="scon" onClick={() => setShowChat(!showChat)}>
                  X
                </div>
              </p>
            </div>
            <div className="chat-body">
              <ScrollToBottom className={currentImage && showImage} >
                {messageList.map((messageContent, key) => {
                  // console.log(messageContent + typeof(messageContent))

                  if (messageList.at(-1) === messageContent) {
                    console.log("ssssss"+messageContent)
                    if(messageContent.toString().includes('I didnt understand the question')){
                      return (
                        <div
                          className="message"
                          key={key}
                          id={
                            username === messageContent.author ? 'other' : 'you'
                          }
                        >
                          <div>
                            <div className="message-content">
                              <div className="button-Container">
                                {username === messageContent.author ? (
                                  messageContent.message
                                ) : messageContent.toString().includes('blob') ? (
                                  <MapImage forImage={forImage} handleShow={handleShow} han messageContent={messageContent}/>
                                ) : (
                                  <p>{messageContent}</p>
                                )}
  
                                {/* {messageList.at(-1) ===
                                  'ተማሪዎች የውጤት ማሻሻያ ጥያቄ ማቅረብ ይችላሉ' ||
                                username === messageContent.author ? (
                                  <Options
                                    username={username}
                                    style={style}
                                    messageContent={messageContent}
                                    changeStyle={changeStyle}
                                    handleResolve={handleResolve}
                                    handleUnresolve={handleUnresolve}
                                  />
                                ) : (
                                  <p>hello</p>
                                )} */}
                              </div>
                            </div>
                            <div className="message-meta"></div>
                          </div>
                        </div>)
                    }
                    else{
                    return (
                      <div
                        className="message"
                        key={key}
                        id={
                          username === messageContent.author ? 'other' : 'you'
                        }
                      >
                        <div className='mass'>
                          <div className="message-content">
                            <div className="button-Container">
                              <div className="main-message">
                                {username === messageContent.author ? (
                                  messageContent.message
                                ) : messageContent
                                    .toString()
                                    .includes('blob') ? (
                                  <div className="imageContainer">
                                    <MapImage forImage={forImage} currentImage={currentImage} handleShow={handleShow} messageContent={messageContent}/>
                                  </div>
                                ) : (
                                  <p>{messageContent}</p>
                                )}
                              </div>

                              {showOption && (
                                <Options
                                  username={username}
                                  // style={style}
                                  messageContent={messageContent}
                                  // changeStyle={changeStyle}
                                  handleResolve={handleResolve}
                                  handleUnresolve={handleUnresolve}
                                  setShowOption={setShowOption}
                                />
                              )}
                            </div>
                          </div>
                          <div className="message-meta"></div>
                        </div>
                      </div>
                    );}
                  } else {
                    return (
                      <div
                        className="message"
                        key={key}
                        id={
                          username === messageContent.author ? 'other' : 'you'
                        }
                      >
                        <div>
                          <div className="message-content">
                            <div className="button-Container">
                              {username === messageContent.author ? (
                                messageContent.message
                              ) : messageContent.toString().includes('blob') ? (
                                <MapImage forImage={forImage} handleShow={handleShow} han messageContent={messageContent}/>
                              ) : (
                                <p>{messageContent}</p>
                              )}

                              {/* {messageList.at(-1) ===
                                'ተማሪዎች የውጤት ማሻሻያ ጥያቄ ማቅረብ ይችላሉ' ||
                              username === messageContent.author ? (
                                <Options
                                  username={username}
                                  style={style}
                                  messageContent={messageContent}
                                  changeStyle={changeStyle}
                                  handleResolve={handleResolve}
                                  handleUnresolve={handleUnresolve}
                                />
                              ) : (
                                <p>hello</p>
                              )} */}
                            </div>
                          </div>
                          <div className="message-meta"></div>
                        </div>
                      </div>
                    );
                  }
                })}
              </ScrollToBottom>
            </div>
            <div className="chat-footer">
              <input
                type="text"
                value={currentMessage}
                placeholder="ጥያቄ አለዎት..."
                onChange={(event) => {
                  setCurrentMessage(event.target.value);
                }}
                onKeyPress={(event) => {
                  event.key === 'Enter' && sendMessage();
                }}
              />
              <button onClick={sendMessage}>&#9658;</button>
            </div>
            <div style={{ color: 'red' }}>{error && error}</div>
          </div>
        </div>
      )}
      {!showChat && (
        <div className="chatIcon" onClick={handleClick}>
          {' '}
          <MessageIcon />{' '}
        </div>
      )}
    </div>
  );
}

export default Chat;

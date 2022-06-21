import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { IsopenContext } from '../context/isopenContext';
import './modal.css';
export default function Modal({ showChat }) {
  const { isOpen, dispatch } = useContext(IsopenContext);
  const feedback = useRef();
  const [error, setError] = useState(false);
  const [feed,setFeed] = useState()
  // const [feedback,setFeedback] = useState("")
  useEffect(() => {
  }, [error]);
  console.log("hello this is  "+error)
  console.log("an "+feed);

  const handleClick = async (e) => {
    e.preventDefault();
    if (feed !== '') {
      const data = {
        feedback: feed,
      };

      try {
       const res = await axios.post(
          'https://amharic-chatbot-for-aau-admin.herokuapp.com/postfeedback',
          data
        );
        dispatch({ type: 'HIDE' });
        setFeed("")
        console.log(res)
      } catch (error) {
        console.log(error);
        setError(true);
      }
    } else {
      setError(true);
      console.log("errrrrrr")
    }
  };
  const handleChange =(e)=>{
    setError(false)
    setFeed(e.target.value)
  }
  return (
    <div className="modalContainer">
      {/* <input type="text" onChange={(e)=>setFeedback(e.target.value)} placeholder="enter"/> */}
      {/* <button onClick={handleClick}>send</button> */}
      {isOpen && !showChat && (
        <>
          <div className={error ? 'modal errorModal' : 'modal'}>
            <div className="titleContainer">አስተያየት</div>
            <div className="body">
              <textarea value={feed} ref={feedback} onChange={handleChange} type="text" />
            </div>
            <div className="footer">
              <div className="linkContainer">
                <div
                  className="link cancel"
                  onClick={() => dispatch({ type: 'HIDE' }, setError(false),setFeed(""))}
                >
                  ሰርዝ
                </div>
                <div className="link between"></div>
                <div onClick={handleClick} className="link send">
                  አስገባ{' '}
                </div>
              </div>
            </div>
          </div>
          <div style={{ color: 'red', marginTop: '20px' }}>
            {error && 'Please enter your feedback'}
          </div>
        </>
      )}
    </div>
  );
}
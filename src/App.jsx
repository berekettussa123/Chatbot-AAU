import Chatbot from './chatbot/Chatbot';
import Navbar from './Navbar/Navbar';
import ChatBotRobot from './chatbotLibrary/ChatBotRobot'
import Modal from './modal/Modal';


const App = () => {
  return (
    <div >
      <Navbar />
      <div className="mainPage">
      {/* <Modal /> */}
      <Chatbot/>

      </div>
      {/* <ChatBotRobot/> */}
    </div>
  );
};

export default App;




import axios from 'axios';
import React from 'react';
import { Launcher } from 'react-chat-window';
import io from 'socket.io-client';

class ChatBotRobot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messageList: [],
      socket: io('ws://localhost:5000/'),
      room: 'user1',
    };
  }

  UNSAFE_componentWillMount() {
    this._sendMessage('ሰላም ጥያቀዎን ያስገቡ...');
  }

  componentDidMount() {
    this.state.socket.connect(true);

    this.state.socket.on('chatbot_response_event', async (msg) => {
      this.state.messageList.pop();
      await this.setState({
        messageList: [...this.state.messageList],
      });

      this._sendMessage(msg);
    });
    const sendData = async () => {
      const res = await axios.get(
        'https://amharic-chatbot-for-aau-admin.herokuapp.com/getfeedback'
      );
      console.log(res);
    };
    sendData();
    // console.log(this.state.messageList);
  }

  async _onMessageWasSent(message) {
    await this.setState({
      messageList: [...this.state.messageList, message],
    });

    this._sendMessage('••••');
    await this.state.socket.emit('get_answer_event', message.data.text);
  }

  _sendMessage(text) {
    if (text.length > 0) {
      this.setState({
        messageList: [
          ...this.state.messageList,
          {
            author: 'them',
            type: 'text',
            data: { text },
          },
        ],
      });
      console.log(this.state.messageList);
    }
  }

  render() {
    return (
      <div id="chatbox" className="chatbox">
        <Launcher
          agentProfile={{
            teamName: 'AAU Chatbot',
            imageUrl:
              'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
          }}
          onMessageWasSent={this._onMessageWasSent.bind(this)}
          messageList={this.state.messageList}
          showEmoji={false}
        />
      </div>
    );
  }
}

export default ChatBotRobot;

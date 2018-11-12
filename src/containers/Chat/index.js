import React, { Component} from 'react';
import { solidRdflib, sortBy } from '../../utils/';
import moment from 'moment';
import './styles.scss';

const CHAT_URL = 'https://jairo.janeirodigital.exchange/public/inrupt/index.ttl#this';

class ChatComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rdfData: [],
      messages: [],
      message: '',
    };
  }
  componentDidMount() {
    this.loadChat();
  }


  loadChat = async() => {
    await this.synChat();

    const folder = solidRdflib.rdf.sym(CHAT_URL);
    solidRdflib.updateManager.addDownstreamChangeListener(folder.doc(), async () => {
      await this.synChat();
    });

  }

  synChat = async() => {
    await solidRdflib.listData(CHAT_URL);
    const rdfData = await solidRdflib.findByPredicate('message');
    this.setState({ rdfData });
    await this.rdfToChatData();
  }
  

  rdfToChatData = async() => {
    const messages = [];
    let maker;

    await Promise.all(this.state.rdfData.map( async data => {
      if (!data.predicate.value.includes('created') && !data.object.value.includes('#')) {
        maker = this.state.rdfData.find(rdf => rdf.predicate.value.includes('maker') && rdf.subject.value === data.subject.value),

        messages.push({
          content: data.object.value,
          date: this.state.rdfData.find(rdf => rdf.predicate.value.includes('created') && rdf.subject.value === data.subject.value).object.value,
          maker: await solidRdflib.getMarker(maker.object.value),
        });
      }
    }));
    this.setState({ messages: sortBy(messages, { prop: 'date', desc: false }) });
  }

  onInputChange = (e: Object) => {
    this.setState({ message: e.target.value });
  }

  onSubmit = async (e: Object) => {
    e.preventDefault();
    const newMessage = await solidRdflib.sendMessage({ message: this.state.message, chatUrl: CHAT_URL });
    const messages = this.state.messages;
    messages.push(newMessage);
    this.setState({ messages, message: '' });
  }

  
  render(){
    return (
      <div className="app-chat">
        <div className="messages-container">
          {
            this.state.messages.map((msg, index) => 
            <div className="message" key={ index }>
              <h5><span>{ msg.maker }</span> { moment(msg.date).calendar() }</h5>
              <p>{ msg.content }</p>
            </div>)
          }
          <form onSubmit={ this.onSubmit }>
            <input className="message-input" value={ this.state.message } onChange={ this.onInputChange }/>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    );
  }
}

export default ChatComponent;
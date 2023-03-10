import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import InputEmoji from 'react-input-emoji';
import { RiSendPlaneLine } from 'react-icons/ri';
import { AiOutlinePaperClip, AiOutlineGif } from 'react-icons/ai';
import Image from 'next/image';
import Gif from '../../components/gif';
import Avatar from '@mui/material/Avatar';
import File from '../../components/file'
import { setCookie } from 'typescript-cookie';
import { saveAs } from 'file-saver';


function Chat({ socket, username, room }) {
  const [isShown, setIsShown] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const hiddenFileInput = React.useRef(null);
  const [file,setFile] = useState();
  const uploadForm = React.useRef(null);
  function stringToColor(string: string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${Array.from(name)[0].toUpperCase()}`,
    };
  }
  function selectFile(e){
    setCurrentMessage(e.target.files[0].name);
    setFile(e.target.files[0]);
  }
  
  const handleClick1 = event => {
    hiddenFileInput.current.click();
  };
  const sendMessage = async () => {
    if (currentMessage !== '') {

      if(file){
        const messageData = {
        content: file.name,
        belongs_to: room,
        created_at : `${new Date(Date.now()).getHours()}:${new Date(
          Date.now(),
        ).getMinutes()}`,
        created_by: username,
        mimeType: file.type,
        type:"file",
        bodyFile: file,
        }
        await socket.emit('send_message', messageData);
        setMessageList((list) => [...list, messageData]);
        setFile(null);
        setCurrentMessage('');
        fetch('http://localhost:3000/api/messages', {
          method: 'POST',
          body: JSON.stringify({
            created_by: messageData.created_by,
            created_at:messageData.created_at,
            content: messageData.content,
            belongs_to: messageData.belongs_to,
            bodyFile: file.name, // id??ee mettre le body de l'image en local storage :)
            type: messageData.type,
          }),
        })
      }
      else{
      const messageData = {
        content: currentMessage,
        created_at : `${new Date(Date.now()).getHours()}:${new Date(
          Date.now(),
        ).getMinutes()}`,
        belongs_to: room,
        created_by: username,
        id: '',
      }; 
      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');
      fetch('http://localhost:3000/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        created_by: messageData.created_by,
        created_at:messageData.created_at,
        content: messageData.content,
        belongs_to: messageData.belongs_to
      }),
    })
    }}
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });
    const res = fetch(`http://localhost:3000/api/messages/${room}`, {
      }).then((res) => res.json()).then((data) => {data.map((data) => (setMessageList((list) => [...list, data])))})
  }, []);
  const handleClick = (event) => {
    // ??????? toggle shown state
    setIsShown((current) => !current);
  };
  const setGifUrlToChat = (url) => {
    setCurrentMessage(url);
    setIsShown(false);
  };
  function upload(){
    // const form = document.forms['uploadForm'];
    // form.submit();
    
//     var formdata = new FormData();
   
//     var reader = new FileReader();
// reader.readAsDataURL(hiddenFileInput.current.files[0]); 
// reader.onloadend = function() {
//   var base64data = reader.result;                
//   formdata.append('sampleFile', hiddenFileInput.current.files[0]);
//   fetch('http://localhost:3001/upload',{method:'POST', body: JSON.stringify({ img : hiddenFileInput.current.files[0]}) })
//   console.log(formdata);
// }


const formData = new FormData();

formData.append('sampleFile', hiddenFileInput.current.files[0]);

fetch('http://localhost:3001/upload',{method:'POST', body: formData })
  }
  return (
    <div className="chat-window bg-white rounded-lg shadow-lg w-full">
      {/* <div className="chat-header">
        <p>GROUPE {room}</p>
      </div> */}
      <div className="chat-body rounded-lg">
        <ScrollToBottom className="message-container pt-4">
          {messageList.map((messageContent) => ( 
            <div
              className="message"
              id={username === messageContent.created_by ? 'you' : 'other'}
            >
              <div className="">
                <div className="flex">
                  <div className="message-content">
                    {(messageContent.content.startsWith('https://media') && (
                      <Image
                        src={messageContent.content}
                        width={200}
                        height={200}
                        alt="un gif a ??t?? envoyer par //METTRE TITTLE DU GIF ICI"
                      />
                    )) || (messageContent.type && messageContent.type.startsWith('file') &&( <File fileName={messageContent.content} type={messageContent.type}/>)) || <p>{messageContent.content}</p>}
                  </div>
                  <Avatar {...stringAvatar(messageContent.created_by)}></Avatar>
                </div>

                <div className="message-meta">
                  <p id="time">{messageContent.created_at}</p>
                  <p id="author">{messageContent.created_by}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      {isShown && (
        <div className='absolute bottom-[15%] right-[5%]'>
          <Gif sendToChat={(urlgif) => setGifUrlToChat(urlgif)}/>
        </div>
      )}

      <div className="flex border bg-[#f3f3f3] rounded-xl mx-4 break-all bottom-0">
        <InputEmoji
          className="w-3/4"
          value={currentMessage}
          onChange={(currentMessage) => {
            setCurrentMessage(currentMessage);
          }}
          cleanOnEnter
          onEnter={sendMessage}
          placeholder="Type a message"
        />
        <div className="flex w-fit justify-end my-4 gap-2 mx-2">
          <AiOutlineGif size={'30px'} onClick={handleClick} className="" />
            <input id='form' ref={hiddenFileInput} className='hidden' onChange={selectFile} type="file" /> 
            <form ref={uploadForm}
      id='uploadForm' 
      action='http://localhost:3001/upload' 
      method='post' 
      encType="multipart/form-data">
        <input className='hidden' type="file" name="sampleFile" ref={hiddenFileInput}  onChange={(event) => {upload(), selectFile(event)}} />
        <AiOutlinePaperClip ref={hiddenFileInput} onChange={selectFile} onClick={handleClick1} size={'30px'} />
    </form>  
          <RiSendPlaneLine size={'30px'} onClick={sendMessage} /> 
        </div>
      </div>
    </div>
  );
}
export default Chat;

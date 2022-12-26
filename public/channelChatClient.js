const socket = io('/channel-namespace');


socket.on('connectToRoom',(data)=>{
    console.log('Client Side :',data);
});


let userName;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message_area');
let setUserName = document.querySelector('.userData');
let senderNameTextarea = document.querySelector('#senderName');
do {
    userName = prompt('Please Enter your Name : ');
    if (userName !== null) {
        setUserName.innerHTML = userName;
        socket.emit('new-connect-user', userName); //send
        socket.on('inform-to-all', (user) => { //receive
            console.log('inform-to-all')
            appendMessage({
                user,
                message: `New User Join : ${user}`
            }, 'incoming');
        });
    }
} while (!userName);


textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
    }
});
senderNameTextarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        getUserId(e.target.value);
    }
});

function getUserId(value) {
    socket.emit('find-name', value.trim());
}
let userId;
socket.on('send-name', data => {
    userId = data.roomId;
    console.log('userId->', userId);

});
function sendMessage(msg) {

    let userMsg = {
        user: userName,
        message: msg.trim(),
        sendTo:userId
    }
    console.log('userMsg->', userMsg);
    //Append
    appendMessage(userMsg, 'outgoing');

    textarea.value = '';
    scrollToBottom();

    // Send to server
    socket.emit('send-message', userMsg);

}

function appendMessage(msg, type) {

    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');
    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);

}

 // Receive message from server

socket.on('receive-message', (msg) => {
    appendMessage(msg, 'incoming');
    console.log('incoming->', msg);
    scrollToBottom();
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}



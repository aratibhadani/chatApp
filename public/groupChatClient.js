

const socket = io();

let userName;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message_area');
let setUserName = document.querySelector('.userData');
let userListVar = document.querySelector('#user_list_select');
let userList;
do {
    userName = prompt('Please Enter your Name : ');
    if (userName !== null) {
        setUserName.innerHTML = userName;
        socket.emit('new-connect-user', userName); //send
        socket.on('inform-to-all', (user) => { //receive
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

function sendMessage(msg) {
    let userMsg = {
        user: userName,
        message: msg.trim()
    }

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



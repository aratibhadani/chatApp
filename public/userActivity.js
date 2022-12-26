    
    
    let users=[];

    function addUser(userData){
        const userExits=users.find(element => element.user === userData.user);
        if(!userExits){
            users.push(userData)
        }
        // console.log(users,'kjjkhkjhjk');
    }
    function removeUser(id) {
        const index = users.findIndex((user) => {
            user.id === id
        });
        if(index !== -1) {
            return users.splice(index,1)[0];
        }
    }
    function getUser (id) {
        users.find((user) => user.id === id);
    }
    function getAllUsers(){
        return users;
    }

module.exports={addUser,removeUser,getUser,getAllUsers}
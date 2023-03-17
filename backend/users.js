const users = [];

const addUserInRoom = ({ id, name, room }) => {
  if (typeof id !== 'string' || typeof name !== 'string' || typeof room !== 'string') {
    return { error: 'Input type is invalid.' };
  }
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

 
  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (!name || !room) return { error: "Username and room are required." };
  if (existingUser) return { error: "Username is taken." };

  const user = { id, name, room };

  users.push(user);

  return { user };
};

const removeUserFromRoom = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUserDetails = (id) => users.find((user) => user.id === id);

const getAllRooms = () => {
  return users;
};

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {
  addUserInRoom,
  removeUserFromRoom,
  getUserDetails,
  getUsersInRoom,
  getAllRooms,
};

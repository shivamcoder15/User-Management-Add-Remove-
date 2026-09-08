const form = document.querySelector("#userForm");
const usersContainer = document.querySelector("#users");
const userCount = document.querySelector("#userCount");

const fields = {
name: document.querySelector("#name"),
role: document.querySelector("#role"),
bio: document.querySelector("#bio"),
photo: document.querySelector("#photo")
};

const STORAGE_KEY = "users";
const DEFAULT_IMAGE = "https://via.placeholder.com/300x300?text=User";

// ========================================
// LOAD USERS
// ========================================

let users = loadUsers();

// ========================================
// INITIALIZE
// ========================================

renderUsers();

form.addEventListener("submit", handleSubmit);

// ========================================
// ADD USER
// ========================================

function handleSubmit(event) {
event.preventDefault();


const user = {
    id: Date.now(),
    username: fields.name.value.trim(),
    role: fields.role.value.trim(),
    bio: fields.bio.value.trim(),
    photo: fields.photo.value.trim() || DEFAULT_IMAGE
};

if (!validateUser(user)) {
    return;
}

users.push(user);

saveUsers();
renderUsers();

form.reset();
fields.name.focus();

showMessage("User added successfully!", "success");


}

// ========================================
// VALIDATION
// ========================================

function validateUser(user) {


if (!user.username || !user.role || !user.bio) {
    showMessage("Please fill in all required fields.");
    return false;
}

if (user.username.length < 2) {
    showMessage("Name must contain at least 2 characters.");
    return false;
}

if (user.bio.length < 5) {
    showMessage("Bio must contain at least 5 characters.");
    return false;
}

return true;


}

// ========================================
// RENDER USERS
// ========================================

function renderUsers() {


usersContainer.replaceChildren();

updateUserCount();

if (users.length === 0) {
    usersContainer.appendChild(createEmptyState());
    return;
}

const fragment = document.createDocumentFragment();

users.forEach((user) => {
    fragment.appendChild(createUserCard(user));
});

usersContainer.appendChild(fragment);


}

// ========================================
// CREATE USER CARD
// ========================================

function createUserCard(user) {


const card = document.createElement("article");

card.className = `
    group relative overflow-hidden
    rounded-3xl
    border border-white/70
    bg-white/85
    p-6
    text-center
    shadow-lg
    backdrop-blur-xl
    transition duration-300
    hover:-translate-y-2
    hover:shadow-2xl
`;


// Background decoration
const decoration = document.createElement("div");

decoration.className = `
    absolute left-0 top-0
    h-24 w-full
    bg-gradient-to-r
    from-blue-100
    to-purple-100
`;


// Image wrapper
const imageWrapper = document.createElement("div");

imageWrapper.className = `
    relative mx-auto mb-4
    h-28 w-28
`;


// User image
const image = document.createElement("img");

image.className = `
    relative z-10
    h-28 w-28
    rounded-full
    border-4 border-white
    object-cover
    shadow-lg
`;

image.src = user.photo;
image.alt = `${user.username}'s profile photo`;
image.loading = "lazy";

image.onerror = () => {
    image.onerror = null;
    image.src = DEFAULT_IMAGE;
};

imageWrapper.appendChild(image);


// User name
const name = document.createElement("h3");

name.className = `
    relative z-10
    text-xl font-bold
    capitalize
    text-gray-800
`;

name.textContent = user.username;


// User role
const userRole = document.createElement("p");

userRole.className = `
    mt-1
    text-sm font-semibold
    text-purple-600
`;

userRole.textContent = user.role;


// User bio
const description = document.createElement("p");

description.className = `
    mx-auto mt-3
    min-h-[48px]
    max-w-sm
    text-sm
    leading-6
    text-gray-500
`;

description.textContent = user.bio;


// Remove button
const removeButton = document.createElement("button");

removeButton.type = "button";

removeButton.className = `
    mt-5
    rounded-xl
    border border-red-200
    bg-red-50
    px-5 py-2.5
    text-sm font-semibold
    text-red-600
    transition
    hover:bg-red-500
    hover:text-white
    active:scale-95
`;

removeButton.textContent = "Remove User";

removeButton.addEventListener("click", () => {
    removeUser(user.id);
});


// Add card elements
card.append(
    decoration,
    imageWrapper,
    name,
    userRole,
    description,
    removeButton
);

return card;


}

// ========================================
// REMOVE USER
// ========================================

function removeUser(id) {


const user = users.find((item) => item.id === id);

if (!user) {
    return;
}

const confirmed = confirm(`Remove ${user.username}?`);

if (!confirmed) {
    return;
}

users = users.filter((item) => item.id !== id);

saveUsers();
renderUsers();

showMessage("User removed successfully!", "success");


}

// ========================================
// EMPTY STATE
// ========================================

function createEmptyState() {


const emptyState = document.createElement("div");

emptyState.className = `
    col-span-full
    rounded-3xl
    border border-white/70
    bg-white/80
    px-6 py-16
    text-center
    shadow-lg
    backdrop-blur-xl
`;

const icon = document.createElement("div");

icon.className = "text-5xl";
icon.textContent = "👤";


const title = document.createElement("h3");

title.className = `
    mt-4
    text-2xl
    font-bold
    text-gray-700
`;

title.textContent = "No Users Found";


const message = document.createElement("p");

message.className = `
    mt-2
    text-sm
    text-gray-500
`;

message.textContent =
    "Add your first user to see the profile here.";


emptyState.append(
    icon,
    title,
    message
);

return emptyState;


}

// ========================================
// USER COUNT
// ========================================

function updateUserCount() {


const count = users.length;

userCount.textContent =
    `${count} ${count === 1 ? "User" : "Users"}`;


}

// ========================================
// LOCAL STORAGE
// ========================================

function saveUsers() {


localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(users)
);

}

function loadUsers() {


try {

    const savedUsers =
        JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        );

    return Array.isArray(savedUsers)
        ? savedUsers
        : [];

} catch (error) {

    console.error(
        "Failed to load users:",
        error
    );

    return [];
}


}

// ========================================
// TOAST MESSAGE
// ========================================

function showMessage(message, type = "error") {


const toast = document.createElement("div");

const background =
    type === "success"
        ? "bg-green-500"
        : "bg-red-500";

toast.className = `
    fixed
    left-1/2
    top-5
    z-50
    -translate-x-1/2
    ${background}
    rounded-xl
    px-5 py-3
    text-sm
    font-semibold
    text-white
    shadow-2xl
`;

toast.textContent = message;

document.body.appendChild(toast);

setTimeout(() => {
    toast.remove();
}, 2500);


}

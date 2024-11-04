import { db } from './firebase-config.js';
import { collection, addDoc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Handle group creation form submission
const groupForm = document.getElementById('groupForm');
groupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const courseName = document.getElementById('courseName').value;
    const topic = document.getElementById('topic').value;
    const maxParticipants = document.getElementById('maxParticipants').value;
    
    // Simple group object
    const newGroup = {
        courseName,
        topic,
        maxParticipants,
        createdAt: new Date(),
    };
    
    try {
        await addDoc(collection(db, 'groups'), newGroup);
        console.log('Group Created:', newGroup);
        
        // Clear form after submission
        groupForm.reset();
    } catch (error) {
        console.error('Error adding group:', error.message);
    }
});

// Function to display groups
function displayGroups(groups) {
    const groupList = document.getElementById('groupList');
    groupList.innerHTML = ''; // Clear existing groups

    groups.forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('group');
        groupDiv.innerHTML = `
            <h3>${group.courseName}</h3>
            <p>Topic: ${group.topic}</p>
            <p>Max Participants: ${group.maxParticipants}</p>
        `;
        groupList.appendChild(groupDiv);
    });
}

// Real-time listener for groups
const q = query(collection(db, 'groups'));
onSnapshot(q, (querySnapshot) => {
    const groups = [];
    querySnapshot.forEach((doc) => {
        groups.push({ id: doc.id, ...doc.data() });
    });
    displayGroups(groups);
});

// Handle search functionality
const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', (e) => {
    const searchValue = e.target.value.toLowerCase();
    const groupItems = document.querySelectorAll('.group');

    groupItems.forEach(group => {
        const courseName = group.querySelector('h3').textContent.toLowerCase();
        const topic = group.querySelector('p').textContent.toLowerCase();
        if (courseName.includes(searchValue) || topic.includes(searchValue)) {
            group.style.display = 'block';
        } else {
            group.style.display = 'none';
        }
    });
});

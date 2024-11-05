import { db, auth } from './firebase-config.js';
import { collection, addDoc, onSnapshot, query, deleteDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Handle group creation form submission
const groupForm = document.getElementById('groupForm');
groupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const courseName = document.getElementById('courseName').value;
    const topic = document.getElementById('topic').value;
    const maxParticipants = document.getElementById('maxParticipants').value;
    
    const newGroup = {
        courseName,
        topic,
        maxParticipants,
        createdAt: new Date(),
    };
    
    try {
        await addDoc(collection(db, 'groups'), newGroup);
        console.log('Group Created:', newGroup);
        groupForm.reset();
    } catch (error) {
        console.error('Error adding group:', error.message);
    }
});

// Function to display groups based on user role
function displayGroups(groups, userRole) {
    const groupList = document.getElementById('groupList');
    groupList.innerHTML = ''; // Clear existing groups

    if (groups.length === 0) {
        groupList.innerHTML = '<p>No groups available.</p>';
    }

    groups.forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('group');
        groupDiv.innerHTML = `
            <h3>${group.courseName}</h3>
            <p>Topic: ${group.topic}</p>
            <p>Max Participants: ${group.maxParticipants}</p>
        `;

        // Add delete button if user is an admin
        if (userRole === 'admin') {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete Group';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', async () => {
                const groupDocRef = doc(db, 'groups', group.id);
                try {
                    await deleteDoc(groupDocRef);
                    console.log('Group deleted:', group.id);
                } catch (error) {
                    console.error('Error deleting group:', error.message);
                }
            });
            groupDiv.appendChild(deleteButton);
        }

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

    console.log('Fetched groups:', groups);

    // Check user role and display groups accordingly
    const user = auth.currentUser;
    if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        getDoc(userDocRef).then((docSnap) => {
            const userData = docSnap.data();
            console.log('User role:', userData.role);
            displayGroups(groups, userData.role); // Pass the user's role
        }).catch(error => {
            console.error('Error fetching user role:', error);
        });
    } else {
        displayGroups(groups, null);
    }
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

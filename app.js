// app.js

// Handle group creation form submission
const groupForm = document.getElementById('groupForm');
groupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const courseName = document.getElementById('courseName').value;
    const topic = document.getElementById('topic').value;
    const maxParticipants = document.getElementById('maxParticipants').value;
    
    // Simple group object
    const newGroup = {
        courseName,
        topic,
        maxParticipants,
    };
    
    console.log('Group Created:', newGroup);
    
    // Clear form after submission
    groupForm.reset();
    
    // You can save the group to Firebase Firestore if you need persistence
});

// Handle search functionality
const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', (e) => {
    const searchValue = e.target.value.toLowerCase();
    // Implement search logic based on course name or topic
    console.log('Searching for:', searchValue);
});

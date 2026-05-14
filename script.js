// Sample activities data
const activities = [
    {
        id: 1,
        title: 'Debate Club',
        icon: '🗣️',
        description: 'Enhance your public speaking skills and engage in meaningful debates',
        schedule: 'Monday & Wednesday, 4:00 PM',
        capacity: 30,
        enrolled: 22
    },
    {
        id: 2,
        title: 'Basketball',
        icon: '🏀',
        description: 'Join our basketball team for practice and friendly matches',
        schedule: 'Tuesday & Thursday, 5:30 PM',
        capacity: 25,
        enrolled: 18
    },
    {
        id: 3,
        title: 'Photography',
        icon: '📸',
        description: 'Learn photography techniques and explore creative composition',
        schedule: 'Saturday, 10:00 AM',
        capacity: 20,
        enrolled: 15
    },
    {
        id: 4,
        title: 'Coding Bootcamp',
        icon: '💻',
        description: 'Advanced programming skills and web development training',
        schedule: 'Monday, Wednesday & Friday, 6:00 PM',
        capacity: 40,
        enrolled: 35
    },
    {
        id: 5,
        title: 'Music Ensemble',
        icon: '🎵',
        description: 'Perform and collaborate with fellow musicians in various genres',
        schedule: 'Tuesday & Thursday, 7:00 PM',
        capacity: 35,
        enrolled: 28
    },
    {
        id: 6,
        title: 'Environmental Club',
        icon: '🌱',
        description: 'Make a difference for our planet through environmental initiatives',
        schedule: 'Wednesday, 5:00 PM',
        capacity: 50,
        enrolled: 32
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadStudentName();
    renderActivities();
    updateMyActivities();
});

// Save student name
function saveName() {
    const nameInput = document.getElementById('studentName');
    const name = nameInput.value.trim();
    
    if (name === '') {
        alert('Please enter your name');
        return;
    }
    
    localStorage.setItem('studentName', name);
    displayGreeting(name);
    updateMyActivities();
}

// Load student name from localStorage
function loadStudentName() {
    const name = localStorage.getItem('studentName');
    if (name) {
        document.getElementById('studentName').value = name;
        displayGreeting(name);
    }
}

// Display greeting message
function displayGreeting(name) {
    const greeting = document.getElementById('greetingMessage');
    greeting.textContent = `Welcome, ${name}! 👋`;
    greeting.style.animation = 'fadeIn 0.5s ease-in';
}

// Render all activities
function renderActivities() {
    const activitiesList = document.getElementById('activitiesList');
    activitiesList.innerHTML = '';
    
    activities.forEach(activity => {
        const isRegistered = isActivityRegistered(activity.id);
        const card = createActivityCard(activity, isRegistered);
        activitiesList.appendChild(card);
    });
}

// Create activity card element
function createActivityCard(activity, isRegistered) {
    const card = document.createElement('div');
    card.className = 'activity-card';
    
    const capacityPercentage = (activity.enrolled / activity.capacity) * 100;
    const isAlmostFull = capacityPercentage >= 80;
    
    card.innerHTML = `
        <div class="activity-header">
            <div class="activity-icon">${activity.icon}</div>
            <h3 class="activity-title">${activity.title}</h3>
        </div>
        
        <p class="activity-description">${activity.description}</p>
        
        <div class="activity-meta">
            <span>📅 ${activity.schedule}</span>
        </div>
        
        <div class="capacity-container">
            <div class="capacity-label">
                <span>Capacity</span>
                <span>${activity.enrolled}/${activity.capacity}</span>
            </div>
            <div class="capacity-bar">
                <div class="capacity-fill ${isAlmostFull ? 'high' : ''}" 
                     style="width: ${capacityPercentage}%"></div>
            </div>
        </div>
        
        <div class="button-group">
            ${isRegistered ? 
                `<button class="btn btn-danger btn-register" onclick="unregisterActivity(${activity.id})">Unregister</button>` :
                `<button class="btn btn-success btn-register" onclick="registerActivity(${activity.id})">Register</button>`
            }
        </div>
    `;
    
    return card;
}

// Register for activity
function registerActivity(activityId) {
    const studentName = localStorage.getItem('studentName');
    
    if (!studentName) {
        alert('Please enter your name first');
        return;
    }
    
    let registrations = getRegistrations();
    
    if (!registrations.includes(activityId)) {
        registrations.push(activityId);
        localStorage.setItem('registrations', JSON.stringify(registrations));
        
        // Update activity enrollment count
        const activity = activities.find(a => a.id === activityId);
        if (activity && activity.enrolled < activity.capacity) {
            activity.enrolled++;
        }
        
        renderActivities();
        updateMyActivities();
        showNotification(`Successfully registered for ${activity.title}!`);
    }
}

// Unregister from activity
function unregisterActivity(activityId) {
    let registrations = getRegistrations();
    registrations = registrations.filter(id => id !== activityId);
    localStorage.setItem('registrations', JSON.stringify(registrations));
    
    // Update activity enrollment count
    const activity = activities.find(a => a.id === activityId);
    if (activity && activity.enrolled > 0) {
        activity.enrolled--;
    }
    
    renderActivities();
    updateMyActivities();
    showNotification(`Unregistered from ${activity.title}`);
}

// Get registered activities from localStorage
function getRegistrations() {
    const registrations = localStorage.getItem('registrations');
    return registrations ? JSON.parse(registrations) : [];
}

// Check if activity is registered
function isActivityRegistered(activityId) {
    return getRegistrations().includes(activityId);
}

// Update the "Your Activities" section
function updateMyActivities() {
    const myActivitiesList = document.getElementById('myActivitiesList');
    const registrations = getRegistrations();
    
    if (registrations.length === 0) {
        myActivitiesList.innerHTML = '<p class="empty-message">No activities registered yet. Start by registering for an activity!</p>';
        return;
    }
    
    myActivitiesList.innerHTML = '';
    
    registrations.forEach(activityId => {
        const activity = activities.find(a => a.id === activityId);
        if (activity) {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <span class="activity-item-name">${activity.icon} ${activity.title}</span>
                <button class="remove-btn" onclick="unregisterActivity(${activity.id})">Remove</button>
            `;
            myActivitiesList.appendChild(item);
        }
    });
}

// Show notification
function showNotification(message) {
    // Simple alert notification (can be replaced with a toast notification system)
    console.log(message);
    
    // Create a temporary notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-in;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
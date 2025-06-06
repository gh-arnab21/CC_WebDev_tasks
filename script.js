//Constants and Elements
const emailList = document.getElementById('emailList');
const searchInput = document.querySelector('.search-input');
const selectAllCheckbox = document.getElementById('selectAll');
let currentTab = 'primary';
let selectedEmails = new Set();
let fetchedMails = [];

//Fetch Emails from Backend
async function fetchMails() {
  try {
    const response = await fetch("http://localhost:8000/api/mail/getAll");
    const mails = await response.json();
    fetchedMails = mails;
    console.log(fetchedMails); // For debugging
    loadEmails();
  } catch (error) {
    console.error("Error fetching mails:", error); 
    emailList.innerHTML = `<p>Error fetching mails: ${error.message}</p>`;
  }
}

//Load Emails into UI
function loadEmails() {
  if (!fetchedMails.length) {
    emailList.innerHTML = '<p>Loading emails...</p>';
    return;
  }
  emailList.innerHTML = '';
  let visibleMails = fetchedMails.filter(email => email.type === currentTab);
  console.log('Current tab:', currentTab);
  console.log('Visible emails:', visibleMails);
  visibleMails.forEach(email => {
    const emailElement = createEmailElement(email);
    emailList.appendChild(emailElement);
  });
}


//Create Email Element
function createEmailElement(email) {
  const emailElement = document.createElement('div');
  emailElement.className = 'email-row';
  if (email.status === 'unread') emailElement.classList.add('unread');
  emailElement.dataset.id = email._id;
  emailElement.innerHTML = `
    <input type="checkbox" class="email-checkbox" data-id="${email._id}">
    <span class="material-icons star-icon">${email.starred ? 'star' : 'star_border'}</span>
    <span class="email-sender">${email.sender || ''}</span>
    <span class="email-subject">${email.subject || ''}</span>
    <span class="email-snippet">${email.body ? email.body.slice(0, 50) : ''}</span>
    <span class="email-time">${email.createdAt ? new Date(email.createdAt).toLocaleString() : ''}</span>
  `;
  return emailElement;
}

function loadEmails() {
  if (!fetchedMails.length) {
    emailList.innerHTML = '<p>Loading emails...</p>';
    return;
  }
  emailList.innerHTML = '';
  let visibleMails = fetchedMails.filter(email => email.type === currentTab);
  visibleMails.forEach(email => {
    const emailElement = createEmailElement(email);
    emailList.appendChild(emailElement); // <-- Use appendChild
  });
}



//Filtering logic 
let visibleMails = fetchedMails.filter(email => email.type === currentTab);


//Update Select All Checkbox
function updateSelectAllState() {
  const checkboxes = document.querySelectorAll('.email-checkbox');
  if (checkboxes.length === 0) {
    selectAllCheckbox.checked = false;
    return;
  }
  const allChecked = [...checkboxes].every(cb => cb.checked);
  selectAllCheckbox.checked = allChecked;
}

//Update Email Count
function updateEmailCount() {
  const emailCount = document.getElementById('emailCount');
  const visibleMails = fetchedMails.filter(email => email.tab === currentTab);
  emailCount.textContent = `${visibleMails.length} emails`;
}

//Setup Event Listeners
function setupEventListeners() {
  //Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      loadEmails();
    });
  });

  //Search
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      loadEmails();
    });
  }

  //Select all
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
      const checkboxes = document.querySelectorAll('.email-checkbox');
      checkboxes.forEach(cb => {
        cb.checked = e.target.checked;
        const id = cb.dataset.id;
        if (e.target.checked) selectedEmails.add(id);
        else selectedEmails.delete(id);
      });
    });
  }

  //Email checkbox
  emailList.addEventListener('change', (e) => {
    if (e.target.classList.contains('email-checkbox')) {
      const id = e.target.dataset.id;
      if (e.target.checked) selectedEmails.add(id);
      else selectedEmails.delete(id);
      updateSelectAllState();
    }
  });

  //Star icon
  emailList.addEventListener('click', (e) => {
    if (e.target.classList.contains('star-icon')) {
      
    }
  });
}

//Initialize 
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  fetchMails();
});
const cors = require('cors');
app.use(cors());

//function given in the script.js file of the starter template 

/*async function fetchMails() {
  try {
    const response = await fetch("http://localhost:8000/api/mail/getAll");
    const mails = await response.json();
    console.log(mails);
  } catch (error) {
    mailContainer.innerHTML = `<p>Error fetching mails: ${error.message}</p>`;
  }
}
fetchMails();*/




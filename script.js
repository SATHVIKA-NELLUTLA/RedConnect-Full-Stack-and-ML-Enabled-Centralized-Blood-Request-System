// Elements
const startScreen = document.getElementById('start-screen');
const enterBtn = document.getElementById('enter-btn');
const authScreen = document.getElementById('auth-screen');
const mainScreen = document.getElementById('main-screen');

const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const toSignup = document.getElementById('to-signup');
const toLogin = document.getElementById('to-login');

const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const signupName = document.getElementById('signup-name');
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');

const loginError = document.getElementById('login-error');
const signupSuccess = document.getElementById('signup-success');

const menuBtn = document.getElementById('menu-btn');
const sideMenu = document.getElementById('side-menu');
const cards = document.querySelectorAll('.card');
const modals = document.querySelectorAll('.modal');
const modalBtns = document.querySelectorAll('.btn-action');
const closeBtns = document.querySelectorAll('.close-btn');

const donorSearch = document.getElementById('donor-search');
const addDonorForm = document.getElementById('add-donor-form');
const bloodForm = document.getElementById('blood-request-form');
const formSuccess = document.getElementById('form-success');
const requestsTableBody = document.querySelector('#requests-table tbody');

let donors = [];
let requests = [];

// Enter App
enterBtn.addEventListener('click', () => {
  startScreen.classList.remove('active');
  authScreen.classList.add('active');
});

// Toggle Auth Forms
loginBtn.addEventListener('click', () => {
  loginForm.style.display = 'flex';
  signupForm.style.display = 'none';
});
signupBtn.addEventListener('click', () => {
  signupForm.style.display = 'flex';
  loginForm.style.display = 'none';
});
toSignup.addEventListener('click', () => {
  loginForm.style.display = 'none';
  signupForm.style.display = 'flex';
});
toLogin.addEventListener('click', () => {
  signupForm.style.display = 'none';
  loginForm.style.display = 'flex';
});

// Signup
signupForm.addEventListener('submit', e => {
  e.preventDefault();
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.find(u => u.email === signupEmail.value)) {
    alert('Email already registered');
    return;
  }
  users.push({ name: signupName.value, email: signupEmail.value, password: signupPassword.value });
  localStorage.setItem('users', JSON.stringify(users));
  signupForm.reset();
  signupSuccess.style.display = 'block';
  setTimeout(() => signupSuccess.style.display = 'none', 2000);
});

// Login
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === loginEmail.value && u.password === loginPassword.value);
  if (user) {
    loginError.style.display = 'none';
    authScreen.classList.remove('active');
    setTimeout(() => {
      mainScreen.classList.add('active');
      loginBtn.style.display = 'none';
      signupBtn.style.display = 'none';
      loginForm.style.display = 'none';
      signupForm.style.display = 'none';
    }, 500);
  } else {
    loginError.style.display = 'block';
  }
});

// Side Menu Toggle
menuBtn.addEventListener('click', () => sideMenu.classList.toggle('active'));

// Animate Cards
function animateCards() {
  cards.forEach((card, index) => {
    setTimeout(() => card.classList.add('visible'), index * 200);
  });
}
animateCards();

// Modals
modalBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = document.getElementById(btn.dataset.modal);
    if(modal) modal.classList.add('show');
  });
});
closeBtns.forEach(btn => {
  btn.addEventListener('click', () => btn.closest('.modal').classList.remove('show'));
});
modals.forEach(modal => {
  modal.addEventListener('click', e => { if(e.target === modal) modal.classList.remove('show'); });
});

// Add Donor
addDonorForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('donor-name').value;
  const blood = document.getElementById('donor-blood').value;
  const location = document.getElementById('donor-location').value;
  const contact = document.getElementById('donor-contact').value;

  donors.push({ name, blood, location, contact });
  renderDonors();
  updateAnalytics();
  addDonorForm.reset();
});

// Render Donors
function renderDonors() {
  const tbody = document.querySelector('#donors-table tbody');
  tbody.innerHTML = '';
  donors.forEach(d => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${d.name}</td><td>${d.blood}</td><td>${d.location}</td><td>${d.contact}</td>`;
    tbody.appendChild(row);
  });
}

// Donor Search
donorSearch.addEventListener('input', () => {
  const filter = donorSearch.value.toLowerCase();
  const rows = document.querySelectorAll('#donors-table tbody tr');
  rows.forEach(row => { row.style.display = row.textContent.toLowerCase().includes(filter) ? '' : 'none'; });
});

// Blood Request Form
bloodForm.addEventListener('submit', e => {
  e.preventDefault();
  const patient = document.getElementById('patient-name').value;
  const blood = document.getElementById('blood-type').value;
  const units = document.getElementById('units').value;
  const location = document.getElementById('location').value;
  const contact = document.getElementById('contact').value;

  requests.push({ patient, blood, units, location, contact });
  localStorage.setItem('requests', JSON.stringify(requests));

  formSuccess.style.display = 'block';
  setTimeout(() => {
    bloodForm.reset();
    formSuccess.style.display = 'none';
    document.getElementById('modal-request').classList.remove('show');
  }, 2000);
});

// Render Requests
function renderRequests() {
  requestsTableBody.innerHTML = '';
  const storedRequests = JSON.parse(localStorage.getItem('requests') || '[]');
  storedRequests.forEach(r => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${r.patient}</td><td>${r.blood}</td><td>${r.units}</td><td>${r.location}</td><td>${r.contact}</td>`;
    requestsTableBody.appendChild(row);
  });
}

// Open Requesters Modal
const openRequestsBtn = document.getElementById('open-requests-btn');
openRequestsBtn.addEventListener('click', () => {
  renderRequests();
  document.getElementById('modal-requests').classList.add('show');
});

// Side menu requesters link
document.getElementById('side-requests-link').addEventListener('click', e => {
  e.preventDefault();
  renderRequests();
  document.getElementById('modal-requests').classList.add('show');
});

// Analytics Chart
const ctx = document.getElementById('analytics-chart').getContext('2d');
let analyticsChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'],
    datasets: [{ label: 'Blood Units Available', data: [0,0,0,0,0,0,0,0], backgroundColor: '#c0392b' }]
  },
  options: { responsive: true, maintainAspectRatio: false }
});

// Update Analytics based on donors
function updateAnalytics() {
  const bloodCounts = { 'A+':0,'B+':0,'O+':0,'AB+':0,'A-':0,'B-':0,'O-':0,'AB-':0 };
  donors.forEach(d => { if(bloodCounts[d.blood]!==undefined) bloodCounts[d.blood]++; });
  analyticsChart.data.datasets[0].data = Object.values(bloodCounts);
  analyticsChart.update();
}


import { db } from "../js/firebaseConfig.js";  // Import Firebase config
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const form = document.getElementById('createAccountForm');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

// Real-time password validation
password.addEventListener('input', function () {
    const value = this.value;
    document.getElementById('length').classList.toggle('valid', value.length >= 8);
    document.getElementById('uppercase').classList.toggle('valid', /[A-Z]/.test(value));
    document.getElementById('lowercase').classList.toggle('valid', /[a-z]/.test(value));
    document.getElementById('number').classList.toggle('valid', /\d/.test(value));
    document.getElementById('special').classList.toggle('valid', /[@$!%*?&]/.test(value));
});

function validateFullName() {
    const fullName = document.getElementById('fullName');
    if (fullName.value.length < 3) {
        fullName.classList.add('is-invalid');
        return false;
    }
    fullName.classList.remove('is-invalid');
    fullName.classList.add('is-valid');
    return true;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
}

function validatePassword(password) {
    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password) &&
        /[@$!%*?&]/.test(password)
    );
}

function validateForm() {
    let isValid = true;
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const role = document.querySelector('input[name="role"]:checked');

    if (!validateFullName()) isValid = false;
    if (!validateEmail(email.value)) {
        email.classList.add('is-invalid');
        isValid = false;
    } else {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
    }

    if (!validatePhone(phone.value)) {
        phone.classList.add('is-invalid');
        isValid = false;
    } else {
        phone.classList.remove('is-invalid');
        phone.classList.add('is-valid');
    }

    if (!validatePassword(password.value)) {
        password.classList.add('is-invalid');
        isValid = false;
    } else {
        password.classList.remove('is-invalid');
        password.classList.add('is-valid');
    }

    if (password.value !== confirmPassword.value) {
        confirmPassword.classList.add('is-invalid');
        isValid = false;
    } else {
        confirmPassword.classList.remove('is-invalid');
        confirmPassword.classList.add('is-valid');
    }

    if (!role) {
        document.querySelector('.role-selection').classList.add('is-invalid');
        isValid = false;
    } else {
        document.querySelector('.role-selection').classList.remove('is-invalid');
    }

    return isValid;
}

// Function to add user to Firestore
async function addUser(formData) {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            name: formData.fullName,
            password: formData.password,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('user', JSON.stringify({ id: docRef.id, ...formData }));
        alert("User added with ID: " + docRef.id);
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error adding document: ", error);
        showNotification("An error occurred while creating the account", "error");
    }
}

// Form submission
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validateForm()) {
        showNotification('Please fill all required fields correctly', 'error');
        return;
    }

    const button = document.getElementById('createAccountButton');
    button.disabled = true;
    button.querySelector('.button-text').textContent = 'Creating Account...';
    button.querySelector('.spinner-border').classList.remove('d-none');

    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value,
        role: document.querySelector('input[name="role"]:checked').value,
        createdAt: new Date().toISOString()
    };

    console.log("Form Data:", formData);

    try {
        await addUser(formData);

        const toastElement = document.createElement('div');
        toastElement.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastElement.innerHTML = `
        <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-check-circle me-2"></i>
                    Account created successfully! Redirecting to login...
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
        document.body.appendChild(toastElement);
        const toast = new bootstrap.Toast(toastElement.querySelector('.toast'));
        toast.show();

        form.reset();
    } catch (error) {
        console.error("Error:", error);
        showNotification("Account creation failed", "error");
    } finally {
        button.disabled = false;
        button.querySelector('.button-text').textContent = '✨ Create Account';
        button.querySelector('.spinner-border').classList.add('d-none');
    }
});

// Toggle password visibility
document.querySelectorAll('.password-toggle').forEach(button => {
    button.addEventListener('click', function () {
        const input = this.previousElementSibling;
        const icon = this.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});

// Show notifications
function showNotification(message, type) {
    const toastElement = document.createElement('div');
    toastElement.className = `alert alert-${type === "error" ? "danger" : "success"} alert-dismissible fade show`;
    toastElement.role = "alert";
    toastElement.innerHTML = `${message} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;

    document.body.appendChild(toastElement);
    setTimeout(() => {
        toastElement.remove();
    }, 5000);
}

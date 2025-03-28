import { db } from "../js/firebaseConfig.js"; // Ensure Firebase is correctly imported
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const login_function = () => {
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        // Reset previous validation states
        this.classList.remove('was-validated');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const role = document.querySelector('input[name="role"]:checked');

        // Validate inputs
        let isValid = true;

        const validateEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        if (!validateEmail(email.value)) {
            email.classList.add('is-invalid');
            isValid = false;
        } else {
            email.classList.remove('is-invalid');
            email.classList.add('is-valid');
        }

        if (!password.value) {
            password.classList.add('is-invalid');
            isValid = false;
        } else {
            password.classList.remove('is-invalid');
            password.classList.add('is-valid');
        }

        if (!role) {
            document.querySelector('.role-selection .invalid-feedback').style.display = 'block';
            isValid = false;
        } else {
            document.querySelector('.role-selection .invalid-feedback').style.display = 'none';
        }

        if (!isValid) return;

        // Show loading state
        const button = document.getElementById('loginButton');
        button.disabled = true;
        button.querySelector('.button-text').textContent = 'Logging in...';
        button.querySelector('.spinner-border').classList.remove('d-none');

        try {
// Fetch user data
const findUser = async () => {
    const q = query(
        collection(db, "users"),
        where("email", "==", email.value), 
        where("password", "==", password.value) // Separate where clause for password
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        alert('Invalid email or password');
        return null;
    }
   // Store user data in localStorage
   localStorage.setItem('user', JSON.stringify(querySnapshot.docs[0].data()));
    return querySnapshot.docs[0].data(); // Return user data
};

const userData = await findUser();

if (!userData) {
    button.disabled = false;
    button.querySelector('.button-text').textContent = 'Login';
    button.querySelector('.spinner-border').classList.add('d-none');
    return;
}

alert(`User found: Name = ${userData.name}, Email = ${userData.email}`);

// Redirect based on role
if (role.value === 'clinic') {
    window.location.href = 'staff-dashboard.html';
} else {
    window.location.href = 'parent-dashboard.html';
}

} catch (error) {
            console.error("Login error:", error);
            alert('Login failed. Please try again.');
        } finally {
            button.disabled = false;
            button.querySelector('.button-text').textContent = 'Login';
            button.querySelector('.spinner-border').classList.add('d-none');
        }
    });

    // Password visibility toggle for all password fields
    document.querySelectorAll('.password-toggle').forEach(button => {
        button.addEventListener('click', function () {
            const passwordInput = this.previousElementSibling;
            const icon = this.querySelector('i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });
};

login_function();
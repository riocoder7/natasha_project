import { db } from "../js/firebaseConfig.js"; // Ensure Firebase is correctly imported
import { collection, setDoc, doc ,updateDoc, arrayUnion} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// Set minimum date to today
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// Handle drag and drop file upload
const uploadArea = document.querySelector('.upload-area');
const fileInput = document.getElementById('documentUpload');
const fileList = document.getElementById('fileList');


// Check authentication status
document.addEventListener('DOMContentLoaded', function () {
    const vaccinationForm = document.getElementById('vaccinationForm');

    // Pre-fill child name if coming from dashboard
    const urlParams = new URLSearchParams(window.location.search);
    const childName = urlParams.get('child');
    if (childName) {
        document.getElementById('childName').value = childName;
    }

    // access local storage
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        alert("Please log in first.");
        window.location.href = "login.html";
        return;
    }
    else {
        console.log("User logged in:", user.id);
    }

    vaccinationForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const vaccinationId = Date.now().toString();
        const formData = {
            id : vaccinationId,
            childName: document.getElementById('childName').value,
            parentName: document.getElementById('parentName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            vaccine: document.getElementById('vaccine').options[document.getElementById('vaccine').selectedIndex].text,
            date: document.getElementById('date').value,
            time: '10:00 AM',
            status: 'Scheduled',
            parentId: user.id
        };

        try {
            // Store appointment in Firestore
            await setDoc(doc(db, "vaccination", vaccinationId), formData);
            console.log("vaccination booked:", formData);

            // Link appointment ID to user's document
            const userRef = doc(db, "users", user.id);
            await updateDoc(userRef, {
                vaccination: arrayUnion(vaccinationId),
            });
           



            // Update confirmation modal with details
            document.getElementById('confirmChildName').textContent = formData.childName;
            document.getElementById('confirmVaccine').textContent = formData.vaccine;
            document.getElementById('confirmDate').textContent = new Date(formData.date).toLocaleDateString();
            document.getElementById('confirmTime').textContent = formData.time;
            document.getElementById('confirmContact').textContent = formData.phone;
          
             // Redirect to documents page after showing success modal
             const successModal = new bootstrap.Modal(document.getElementById('vaccinationSuccessModal'));
                    successModal.show();
             document.getElementById('vaccinationSuccessModal').addEventListener('hidden.bs.modal', function () {
                        window.location.href = 'parent-dashboard.html';
                    });

            // Reset form
            this.reset();
        } catch (error) {
            console.error("Error adding document: ", error);
            showNotification("An error occurred while creating the account", "error");
        }
    });
});

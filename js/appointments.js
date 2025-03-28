import { db } from "../js/firebaseConfig.js"; // Ensure Firebase is correctly imported
import { collection, setDoc, doc ,updateDoc, arrayUnion} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Check authentication status
document.addEventListener('DOMContentLoaded', function() {
    const appointmentForm = document.getElementById('appointmentForm');
    // Get user ID from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        alert("Please log in first.");
        window.location.href = "login.html";
        return;
    }
    else {
        console.log("User logged in:", user.id);
    }
    
    // Pre-fill child name if coming from dashboard
    const urlParams = new URLSearchParams(window.location.search);
    const childName = urlParams.get('child');
    if (childName) {
        document.getElementById('childName').value = childName;
    }
    
    appointmentForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        // Get user ID from local storage
       
        if (!user) {
            alert("Please log in first.");
            window.location.href = "login.html";
            return;
        }
        else {
            console.log("User logged in:", user.id);
        }
         // Generate a unique appointment ID
         const appointmentId = Date.now().toString()


        const formData = {
            childName: document.getElementById('childName').value,
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            doctor: document.getElementById('doctor-select').options[document.getElementById('doctor-select').selectedIndex].text,
            parentContact: document.getElementById('parentContact').value,
            date: document.getElementById('appointmentDate').value,
            time: document.getElementById('appointmentTime').value,
            reason: document.getElementById('reason').value,
            status: 'Scheduled',
            parentId: user.id,  // Ensure user.id exists
            parentName: user.fullName,  // Ensure user.fullName exists
            createdAt: new Date().toISOString()
        };

        try {
            // Store appointment in Firestore
            await setDoc(doc(db, "appointments", appointmentId), formData);
            console.log("Appointment booked:", formData);

            // Link appointment ID to user's document
            const userRef = doc(db, "users", user.id);
            await updateDoc(userRef, {
                appointments: arrayUnion(appointmentId),
            });



            // Update confirmation modal with details
            document.getElementById('confirmChildName').textContent = formData.childName;
            document.getElementById('confirmDoctor').textContent = formData.doctor;
            document.getElementById('confirmDate').textContent = new Date(formData.date).toLocaleDateString();
            document.getElementById('confirmTime').textContent = formData.time;
            document.getElementById('confirmContact').textContent = formData.parentContact;

            // Show success modal
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();

            // Add event listener for modal hidden to redirect to appropriate dashboard
            document.getElementById('successModal').addEventListener('hidden.bs.modal', function () {
                window.location.href = 'parent-dashboard.html';
            });

            // Reset form
            this.reset();

        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Failed to book appointment. Please try again.');
        }
    });

    // Restrict past dates in date picker
    let today = new Date().toISOString().split("T")[0];
    document.getElementById("appointmentDate").setAttribute("min", today);

    // Validate date selection
    document.getElementById("appointmentDate").addEventListener("change", function() {
        const selectedDate = new Date(this.value);
        const dayOfWeek = selectedDate.getDay();
        
        // Disable weekends (0 = Sunday, 6 = Saturday)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            alert("Please select a weekday for your appointment.");
            this.value = "";
        }
    });
});

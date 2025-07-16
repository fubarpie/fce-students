// File: /widget/widget.js
// This script will find an element with the ID "student-profile-widget-container"
// on your page and load the student profiles into it.

document.addEventListener('DOMContentLoaded', () => {
    // The target element on your website where the widget will be rendered.
    const targetContainer = document.getElementById('student-profile-widget-container');

    // If the target container doesn't exist on the page, we stop the script
    // to avoid errors.
    if (!targetContainer) {
        console.error('Student Profile Widget Error: Could not find the container element with id "student-profile-widget-container". Please make sure this element exists in your HTML.');
        return;
    }

    // The URL to your compiled students.json file.
    // Using jsDelivr CDN is faster and better for production than hitting raw.githubusercontent.com directly.
    const studentsJsonUrl = 'https://cdn.jsdelivr.net/gh/FUBAR-Pie/fce-students@main/public/students.json';
    
    // The base URL for student profile images, also using the CDN.
    const imageBaseUrl = 'https://cdn.jsdelivr.net/gh/FUBAR-Pie/fce-students@main/public/uploads/media/';

    /**
     * Creates the HTML for a single student card.
     * @param {object} student - The student data object.
     * @param {number} index - The index of the student in the array, used for animation delay.
     * @returns {string} The HTML string for the student card.
     */
    const createStudentCard = (student, index) => {
        // Use a placeholder image if a student photo is not available.
        const photoUrl = student.photo 
            ? `${imageBaseUrl}${encodeURIComponent(student.photo)}` 
            : `https://placehold.co/400x400/EBF4FF/7F9CF5?text=${encodeURIComponent(student.studentName.charAt(0))}`;

        // The card's HTML structure. It uses Tailwind CSS classes that will be applied by the host page.
        return `
            <div class="student-card" style="animation-delay: ${index * 50}ms;">
                <div class="relative">
                    <img class="w-full h-56 object-cover object-center" src="${photoUrl}" alt="Profile photo of ${student.studentName}" onerror="this.onerror=null;this.src='https://placehold.co/400x400/EBF4FF/7F9CF5?text=Image+Not+Found';">
                    <div class="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 m-2 rounded-full">${student.major || 'Explorer'}</div>
                </div>
                <div class="p-6">
                    <h2 class="text-xl font-bold text-gray-900 truncate" title="${student.studentName}">${student.studentName}</h2>
                    <p class="mt-2 text-gray-600 text-sm italic h-16 overflow-hidden">"${student.quote || 'No quote provided.'}"</p>
                    <div class="mt-4">
                        <h3 class="text-sm font-semibold text-gray-700">Career Aspirations:</h3>
                        <p class="text-sm text-gray-500 h-12 overflow-hidden">${student.career || 'Exploring future opportunities.'}</p>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <span class="text-xs font-medium text-gray-500">Graduation: ${student.gradYear || 'TBD'}</span>
                        ${student.linkedin ? `<a href="${student.linkedin}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 transition-colors" aria-label="LinkedIn profile for ${student.studentName}">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </a>` : ''}
                    </div>
                </div>
            </div>
        `;
    };

    /**
     * Fetches student data and renders the entire widget.
     */
    const loadWidget = async () => {
        // Display a loading message while fetching data.
        targetContainer.innerHTML = '<p class="text-gray-500 col-span-full text-center">Loading student profiles...</p>';
        try {
            const response = await fetch(studentsJsonUrl);
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }
            
            const students = await response.json();
            if (!students || !Array.isArray(students) || students.length === 0) {
                throw new Error('No valid student data found.');
            }

            // Generate the HTML for all valid student cards.
            const cardsHtml = students
                .filter(student => student && student.studentName) // Filter out any invalid entries.
                .map(createStudentCard)
                .join('');
            
            // Inject the complete HTML into the container.
            targetContainer.innerHTML = cardsHtml;

        } catch (error) {
            // Display an error message if anything goes wrong.
            console.error('Error loading student profiles widget:', error);
            targetContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg col-span-full"><strong>Oops!</strong> Could not load profiles. ${error.message}</div>`;
        }
    };

    // Initial call to load the widget's content.
    loadWidget();
});

/**
 * Student Profile Widget
 *
 * This script fetches student data from a JSON file and renders it
 * as a grid of profile cards. It is designed to be embedded on any website.
 *
 * Author: Web Design Wizard
 * Version: 2.2.0
 */
(() => {
    // --- Configuration ---
    const WIDGET_CONTAINER_ID = 'student-widget-container';
    // --- CORRECTED URL: Fetching the JSON file directly through the jsDelivr CDN ---
    // This URL structure is correct and avoids the need for a third-party proxy.
    const API_URL = 'https://cdn.jsdelivr.net/gh/fubarpie/fce-students/students.json';

    // --- Main function to initialize the widget ---
    const initWidget = () => {
        const container = document.getElementById(WIDGET_CONTAINER_ID);

        if (!container) {
            console.error(`Wizard's Spell Failed: Container with ID #${WIDGET_CONTAINER_ID} was not found!`);
            return;
        }

        // Show a loading message
        container.innerHTML = `<p style="text-align: center; font-size: 1.2rem;">Summoning student profiles...</p>`;

        // Inject the CSS styles into the page
        createStyles();

        // Fetch the data and render the cards
        renderWidget(container);
    };

    // --- Helper function to create SVG icons ---
    const ICONS = {
        github: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
        linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
        portfolio: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`
    };

    // --- Inject CSS styles into the document's head ---
    const createStyles = () => {
        const styleElement = document.createElement('style');
        // Note: We target the container ID to avoid conflicts with the host page's styles.
        styleElement.textContent = `
            #${WIDGET_CONTAINER_ID} {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 2rem;
                padding: 1rem;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }

            #${WIDGET_CONTAINER_ID} .student-card {
                background: #ffffff;
                border-radius: 16px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                overflow: hidden;
                display: flex;
                flex-direction: column;
                opacity: 0;
                transform: translateY(30px);
                animation: card-fade-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            #${WIDGET_CONTAINER_ID} .student-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 10px 20px rgba(0,0,0,0.12);
            }

            @keyframes card-fade-in {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            #${WIDGET_CONTAINER_ID} .card-header {
                position: relative;
                height: 120px;
                background: linear-gradient(45deg, #6D5BBA, #8D58BF);
            }
            
            #${WIDGET_CONTAINER_ID} .card-profile-img {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border: 4px solid #fff;
                background-color: #eee;
                position: absolute;
                bottom: -50px;
                left: 50%;
                transform: translateX(-50%);
                object-fit: cover;
                box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            }

            #${WIDGET_CONTAINER_ID} .card-body {
                padding: 70px 1.5rem 1.5rem;
                text-align: center;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
            }

            #${WIDGET_CONTAINER_ID} .student-name {
                font-size: 1.5rem;
                font-weight: 600;
                margin: 0 0 0.5rem;
                color: #1d2129;
            }

            #${WIDGET_CONTAINER_ID} .student-major {
                color: #65676b;
                margin-bottom: 1rem;
            }

            #${WIDGET_CONTAINER_ID} .student-skills {
                margin: 1rem 0;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 0.5rem;
            }

            #${WIDGET_CONTAINER_ID} .skill-tag {
                background-color: #e7f3ff;
                color: #1877f2;
                padding: 0.25rem 0.75rem;
                border-radius: 99px;
                font-size: 0.8rem;
                font-weight: 500;
            }

            #${WIDGET_CONTAINER_ID} .card-footer {
                margin-top: auto;
                padding-top: 1rem;
                display: flex;
                justify-content: center;
                gap: 1rem;
            }
            
            #${WIDGET_CONTAINER_ID} .social-link {
                color: #65676b;
                transition: color 0.2s ease, transform 0.2s ease;
            }
            
            #${WIDGET_CONTAINER_ID} .social-link:hover {
                color: #1877f2;
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(styleElement);
    };

    // --- Function to create a single student card ---
    const createStudentCard = (student) => {
        const card = document.createElement('div');
        card.className = 'student-card';

        const socialLinks = `
            ${student.github ? `<a href="${student.github}" target="_blank" rel="noopener noreferrer" class="social-link" title="GitHub">${ICONS.github}</a>` : ''}
            ${student.linkedin ? `<a href="${student.linkedin}" target="_blank" rel="noopener noreferrer" class="social-link" title="LinkedIn">${ICONS.linkedin}</a>` : ''}
            ${student.portfolio ? `<a href="${student.portfolio}" target="_blank" rel="noopener noreferrer" class="social-link" title="Portfolio">${ICONS.portfolio}</a>` : ''}
        `;

        card.innerHTML = `
            <div class="card-header">
                <img src="${student.profile_pic_url}" alt="${student.name}'s profile picture" class="card-profile-img" onerror="this.style.display='none'">
            </div>
            <div class="card-body">
                <h3 class="student-name">${student.name}</h3>
                <p class="student-major">${student.major}</p>
                <div class="student-skills">
                    ${student.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                <div class="card-footer">
                    ${socialLinks}
                </div>
            </div>
        `;
        return card;
    };

    // --- Main function to fetch data and render cards ---
    const renderWidget = async (container) => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            
            const { students } = await response.json();

            // Clear loading message
            container.innerHTML = '';

            // Create and append cards with a staggered animation
            students.forEach((student, index) => {
                const card = createStudentCard(student);
                card.style.animationDelay = `${index * 100}ms`;
                container.appendChild(card);
            });

        } catch (error) {
            console.error("Wizard's Spell Backfired:", error);
            container.innerHTML = `<p style="text-align: center; color: #d93025;">Failed to summon student profiles. Please check the ancient scrolls (console) for details.</p>`;
        }
    };

    // --- Let the magic begin! ---
    // We wait for the DOM to be fully loaded before running the script.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

})();

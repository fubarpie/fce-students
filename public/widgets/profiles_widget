/**
 * Student Profile Widget
 *
 * This script fetches student data from the fce-students GitHub repository,
 * parsing individual Markdown files to render profile cards.
 *
 * Author: Web Design Wizard
 * Version: 4.0.0
 */
(() => {
    // --- Configuration ---
    const WIDGET_CONTAINER_ID = 'student-widget-container';
    // Use the GitHub API to get the contents of the correct students directory
    const GITHUB_API_URL = 'https://api.github.com/repos/fubarpie/fce-students/contents/src/content/students';
    // Base URL for constructing image paths via the CDN
    const IMAGE_BASE_URL = 'https://cdn.jsdelivr.net/gh/fubarpie/fce-students@main/public';

    // --- Main function to initialize the widget ---
    const initWidget = () => {
        const container = document.getElementById(WIDGET_CONTAINER_ID);
        if (!container) {
            console.error(`Wizard's Spell Failed: Container with ID #${WIDGET_CONTAINER_ID} was not found!`);
            return;
        }
        container.innerHTML = `<p style="text-align: center; font-size: 1.2rem;">Summoning student profiles...</p>`;
        createStyles();
        renderWidget(container);
    };

    // --- Simple YAML Front Matter Parser ---
    // This extracts the YAML block from the top of a markdown file.
    const parseFrontMatter = (text) => {
        const yamlRegex = /^---\s*\n([\s\S]*?)\n?---/;
        const match = yamlRegex.exec(text);
        if (!match) return {};

        const yaml = match[1];
        const data = {};
        const lines = yaml.split('\n');
        let currentKey = '';
        let isList = false;

        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.length === 0) return;

            if (trimmedLine.startsWith('-')) {
                if (currentKey && !isList) {
                    data[currentKey] = [];
                    isList = true;
                }
                if (isList) {
                    data[currentKey].push(trimmedLine.substring(1).trim().replace(/['"]/g, ''));
                }
            } else {
                const parts = trimmedLine.split(':');
                if (parts.length >= 2) {
                    isList = false;
                    currentKey = parts[0].trim();
                    const value = parts.slice(1).join(':').trim();
                    data[currentKey] = value.replace(/['"]/g, ''); // Remove quotes
                }
            }
        });
        return data;
    };


    // --- Main function to fetch data and render cards ---
    const renderWidget = async (container) => {
        try {
            // 1. Get the list of student .md files from the directory
            const response = await fetch(GITHUB_API_URL);
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            const files = await response.json();

            // 2. Filter for valid markdown files and fetch their content
            const studentFilePromises = files
                .filter(file => file.name && file.name.endsWith('.md') && file.download_url)
                .map(file =>
                    fetch(file.download_url)
                    .then(res => {
                        if (!res.ok) throw new Error(`Failed to download ${file.name}`);
                        return res.text();
                    })
                    .then(text => parseFrontMatter(text))
                );

            // 3. Wait for all student files to be fetched and parsed
            const students = await Promise.all(studentFilePromises);

            // 4. Render the cards
            container.innerHTML = ''; // Clear loading message
            students.forEach((student, index) => {
                // Ensure the student object has data before creating a card
                if (!student.name) return;

                const cardData = {
                    name: student.name,
                    major: student.major,
                    // Construct the full, absolute image URL
                    profile_pic_url: student.profile_pic ? `${IMAGE_BASE_URL}${student.profile_pic}` : '',
                    skills: student.skills || [],
                    github: student.github,
                    linkedin: student.linkedin,
                    portfolio: student.portfolio
                };
                const card = createStudentCard(cardData);
                card.style.animationDelay = `${index * 100}ms`;
                container.appendChild(card);
            });

        } catch (error) {
            console.error("Wizard's Spell Backfired:", error);
            container.innerHTML = `<p style="text-align: center; color: #d93025;">Failed to summon student profiles. The ancient scrolls (console) hold the dark secrets.</p>`;
        }
    };

    // --- All the helper functions for creating styles and cards remain the same ---

    const ICONS = {
        github: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
        linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
        portfolio: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`
    };

    const createStyles = () => {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            #${WIDGET_CONTAINER_ID} {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 2rem;
                padding: 1rem;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }
            #${WIDGET_CONTAINER_ID} .student-card { background: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; display: flex; flex-direction: column; opacity: 0; transform: translateY(30px); animation: card-fade-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; transition: transform 0.3s ease, box-shadow 0.3s ease; }
            #${WIDGET_CONTAINER_ID} .student-card:hover { transform: translateY(-8px); box-shadow: 0 10px 20px rgba(0,0,0,0.12); }
            @keyframes card-fade-in { to { opacity: 1; transform: translateY(0); } }
            #${WIDGET_CONTAINER_ID} .card-header { position: relative; height: 120px; background: linear-gradient(45deg, #6D5BBA, #8D58BF); }
            #${WIDGET_CONTAINER_ID} .card-profile-img { width: 100px; height: 100px; border-radius: 50%; border: 4px solid #fff; background-color: #eee; position: absolute; bottom: -50px; left: 50%; transform: translateX(-50%); object-fit: cover; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
            #${WIDGET_CONTAINER_ID} .card-body { padding: 70px 1.5rem 1.5rem; text-align: center; flex-grow: 1; display: flex; flex-direction: column; }
            #${WIDGET_CONTAINER_ID} .student-name { font-size: 1.5rem; font-weight: 600; margin: 0 0 0.5rem; color: #1d2129; }
            #${WIDGET_CONTAINER_ID} .student-major { color: #65676b; margin-bottom: 1rem; }
            #${WIDGET_CONTAINER_ID} .student-skills { margin: 1rem 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; }
            #${WIDGET_CONTAINER_ID} .skill-tag { background-color: #e7f3ff; color: #1877f2; padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.8rem; font-weight: 500; }
            #${WIDGET_CONTAINER_ID} .card-footer { margin-top: auto; padding-top: 1rem; display: flex; justify-content: center; gap: 1rem; }
            #${WIDGET_CONTAINER_ID} .social-link { color: #65676b; transition: color 0.2s ease, transform 0.2s ease; }
            #${WIDGET_CONTAINER_ID} .social-link:hover { color: #1877f2; transform: scale(1.1); }
        `;
        document.head.appendChild(styleElement);
    };

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
                <img src="${student.profile_pic_url}" alt="${student.name}'s profile picture" class="card-profile-img" onerror="this.onerror=null;this.src='https://placehold.co/100x100/EBF2FF/7F9CF5?text=Image';">
            </div>
            <div class="card-body">
                <h3 class="student-name">${student.name || 'Name not found'}</h3>
                <p class="student-major">${student.major || 'Major not found'}</p>
                <div class="student-skills">
                    ${(student.skills || []).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                <div class="card-footer">
                    ${socialLinks}
                </div>
            </div>
        `;
        return card;
    };

    // --- Let the magic begin! ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }
})();

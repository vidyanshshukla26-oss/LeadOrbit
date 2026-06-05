import { fetchWithAuth, clearTokens } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Fetch user data from backend on page load
        const res = await fetchWithAuth('/auth/me/');
        const userData = await res.json();

        // 2. Generic UI Display updates
        const userDisplays = document.querySelectorAll('.user-display-name');
        userDisplays.forEach(el => el.textContent = userData.email);

        const orgDisplays = document.querySelectorAll('.org-display-name');
        orgDisplays.forEach(el => el.textContent = userData.organization.name);

        // 3. Extract DOM input variables for the settings fields
        const geminiKeyInput = document.getElementById('gemini-api-key');
        const aiPersonalizationToggle = document.getElementById('enable-ai-personalization');
        const orgNameInput = document.getElementById('org-name');
        const orgIdInput = document.getElementById('org-id');

        // 4. Populate values safely into the inputs if the organization exists
        if (userData.organization) {
            if (orgNameInput) orgNameInput.value = userData.organization.name || '';
            if (orgIdInput) orgIdInput.value = userData.organization.id || '';
            if (geminiKeyInput) geminiKeyInput.value = userData.organization.gemini_api_key || '';
            if (aiPersonalizationToggle) aiPersonalizationToggle.checked = userData.organization.enable_ai_personalization !== false;
        }

    } catch (e) {
        // Capture any profile data rendering errors safely
        console.error("Error loading user profile settings:", e);
    }

    // 5. Handle logout attachments
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearTokens();
            window.location.href = '/login.html';
        });
    }
});
    if (orgNameInput) {
        // Find the closest parent card form or button to attach save logic
        const saveBtn = document.querySelector('button[type="submit"]') || orgNameInput.closest('.glass-card');
        
        if (saveBtn) {
            const handleSave = async (e) => {
                e.preventDefault();
                
                const geminiKeyInput = document.getElementById('gemini-api-key');
                const aiPersonalizationToggle = document.getElementById('enable-ai-personalization');
                
                const payload = {
                    organization_name: orgNameInput.value,
                    gemini_api_key: geminiKeyInput ? geminiKeyInput.value : null,
                    enable_ai_personalization: aiPersonalizationToggle ? aiPersonalizationToggle.checked : true
                };

                try {
                    const response = await fetchWithAuth('/auth/me/', {
                        method: 'PATCH',
                        body: JSON.stringify(payload)
                    });

                    if (response.ok) {
                        alert('Settings updated successfully!');
                        window.location.reload();
                    } else {
                        const errData = await response.json();
                        alert('Failed to update settings: ' + JSON.stringify(errData));
                    }
                } catch (err) {
                    console.error('Error saving settings:', err);
                    alert('An error occurred while saving.');
                }
            };

            // Bind to form submission if inside a form, otherwise bind to a button click
            const form = orgNameInput.closest('form');
            if (form) {
                form.addEventListener('submit', handleSave);
            } else {
                // If there isn't a strict <form> tag, look for a save button inside the card
                const innerBtn = saveBtn.querySelector('button') || saveBtn;
                if (innerBtn) innerBtn.addEventListener('click', handleSave);
            }
        }
    }
    }

    // Handle logout attachments
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearTokens();
            window.location.href = '/login.html';
        });
    }
});

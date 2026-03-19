document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Profile Info
    const profilePicture = document.getElementById('profile-picture-input');
    const headerName = document.getElementById('profile-display-name-header');
    const headerUsername = document.getElementById('profile-username-header');

    // DOM Elements - Inputs
    const nameInput = document.getElementById('profile-name-input');
    const usernameInput = document.getElementById('profile-username-input');
    const emailInput = document.getElementById('profile-email-input');
    const phoneInput = document.getElementById('profile-phone-input');
    const bioInput = document.getElementById('profile-bio-input');

    // DOM Elements - Buttons
    const saveBtn = document.getElementById('profile-save-btn');
    const cancelBtn = document.getElementById('profile-cancel-btn');

    // DOM Elements - Modal
    const otpModal = document.getElementById('otp-modal');
    const otpModalTitle = document.getElementById('otp-modal-title');
    const otpModalDesc = document.getElementById('otp-modal-desc');
    const otpModalIcon = document.getElementById('otp-modal-icon');
    const otpModalTarget = document.getElementById('otp-modal-target');
    const otpCodeInput = document.getElementById('otp-code-input');
    const otpErrorMsg = document.getElementById('otp-error-msg');
    const otpVerifyBtn = document.getElementById('otp-verify-btn');
    const otpCancelBtn = document.getElementById('otp-cancel-btn');
    const otpResendBtn = document.getElementById('otp-resend-btn');

    // State tracking
    let initialProfileState = {};
    let pendingVerificationId = null;
    let pendingVerificationType = null; // 'email' or 'phone'

    // Poll for Clerk initialization
    const clerkCheckInterval = setInterval(async () => {
        if (typeof window.Clerk !== 'undefined' && window.Clerk.loaded) {
            clearInterval(clerkCheckInterval);
            
            if (!window.Clerk.isSignedIn) {
                window.location.replace('dashboard_signin.html');
                return;
            }

            await populateProfileData();
        }
    }, 100);

    async function populateProfileData() {
        const user = window.Clerk.user;
        
        // Populate UI
        const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        const username = user.username ? `@${user.username}` : '';
        const email = user.primaryEmailAddress ? user.primaryEmailAddress.emailAddress : '';
        const phone = user.primaryPhoneNumber ? user.primaryPhoneNumber.phoneNumber : '';
        
        // We use unsafeMetadata since publicMetadata is read-only from the frontend
        const bio = user.unsafeMetadata?.bio || '';
        // Same for username in case the Clerk instance doesn't have usernames natively enabled
        let usernameStr = '';
        if (user.username) usernameStr = `@${user.username}`;
        else if (user.unsafeMetadata?.username) usernameStr = `@${user.unsafeMetadata.username}`;

        headerName.textContent = displayName || 'User';
        headerUsername.textContent = usernameStr;
        
        if (profilePicture && user.imageUrl) {
            profilePicture.src = user.imageUrl;
        }

        nameInput.value = displayName;
        usernameInput.value = usernameStr;
        emailInput.value = email;
        phoneInput.value = phone;
        bioInput.value = bio;

        // Store initial state to detect changes
        initialProfileState = {
            name: displayName,
            username: usernameStr,
            email: email,
            phone: phone,
            bio: bio
        };
    }

    // --- Modal Control Functions ---
    function showModal(type, targetStr) {
        otpModalTarget.textContent = targetStr;
        otpCodeInput.value = '';
        otpErrorMsg.classList.add('hidden');
        setLoading(otpVerifyBtn, false);

        if (type === 'email') {
            otpModalIcon.textContent = 'mark_email_read';
            otpModalTitle.textContent = 'Verify your Email';
            otpModalDesc.innerHTML = `We've sent a 6-digit verification code to <span id="otp-modal-target" class="text-white font-medium">${targetStr}</span>. Please enter it below.`;
        } else {
            otpModalIcon.textContent = 'sms';
            otpModalTitle.textContent = 'Verify your Phone';
            otpModalDesc.innerHTML = `We've sent a 6-digit verification code to <span id="otp-modal-target" class="text-white font-medium">${targetStr}</span>. Please enter it below.`;
        }

        otpModal.classList.remove('hidden');
        // Trigger generic reflow
        void otpModal.offsetWidth;
        otpModal.classList.remove('opacity-0');
        otpModal.querySelector('.glass-card').classList.remove('scale-95');
        otpModal.querySelector('.glass-card').classList.add('scale-100');
    }

    function hideModal() {
        otpModal.classList.add('opacity-0');
        otpModal.querySelector('.glass-card').classList.add('scale-95');
        setTimeout(() => {
            otpModal.classList.add('hidden');
            otpModal.querySelector('.glass-card').classList.remove('scale-100');
            pendingVerificationId = null;
            pendingVerificationType = null;
        }, 300); // Wait for transition
    }

    // Utility: Button Loading State
    function setLoading(btn, isLoading) {
        if (!btn) return;
        const textSpan = btn.querySelector('.btn-text');
        const loaderSpan = btn.querySelector('.btn-loader');
        
        if (isLoading) {
            btn.style.pointerEvents = 'none';
            if (textSpan) textSpan.style.opacity = '0';
            if (loaderSpan) loaderSpan.classList.remove('hidden');
        } else {
            btn.style.pointerEvents = 'auto';
            if (textSpan) textSpan.style.opacity = '1';
            if (loaderSpan) loaderSpan.classList.add('hidden');
        }
    }

    // Utility: Success Toast
    function showToast(message) {
        // Create toast element dynamically
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 z-[200] flex items-center gap-3 bg-obsidian border border-electric-blue/30 p-4 rounded-xl shadow-[0_0_20px_rgba(0,82,255,0.2)] transform translate-y-20 opacity-0 transition-all duration-300';
        toast.innerHTML = `
            <span class="material-symbols-outlined text-electric-blue">check_circle</span>
            <p class="text-sm font-medium text-white">${message}</p>
        `;
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.remove('translate-y-20', 'opacity-0');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- Action Handlers ---

    // Cancel Button returns inputs to original fetched state
    cancelBtn.addEventListener('click', () => {
        nameInput.value = initialProfileState.name;
        usernameInput.value = initialProfileState.username;
        emailInput.value = initialProfileState.email;
        phoneInput.value = initialProfileState.phone;
        bioInput.value = initialProfileState.bio;
    });

    otpCancelBtn.addEventListener('click', hideModal);

    saveBtn.addEventListener('click', async () => {
        setLoading(saveBtn, true);
        const user = window.Clerk.user;

        // 1. Gather User Inputs
        const currentName = nameInput.value.trim();
        const currentUsername = usernameInput.value.trim().replace(/^@/, '');
        const currentBio = bioInput.value.trim();

        let metadataUpdates = { ...user.unsafeMetadata };
        let needsMetadataUpdate = false;
        let finalErrorMessage = ""; // Accumulate errors to show at the end if any

        // 2. Process Name Update independently
        if (currentName !== initialProfileState.name) {
            const parts = currentName.split(' ');
            const firstName = parts[0];
            const lastName = parts.slice(1).join(' ');
            
            try {
                await user.update({ firstName, lastName });
            } catch (err) {
                console.error("Failed to update name", err);
                finalErrorMessage += `Name Error: ${err.errors?.[0]?.longMessage || err.message}\n`;
            }
        }

        // 3. Process Username Update independently 
        if (`@${currentUsername}` !== initialProfileState.username && currentUsername !== '') {
            try {
                // Attempt native Clerk username save
                await user.update({ username: currentUsername });
            } catch (err) {
                // If Clerk rejects 'username' because it's disabled in the Dashboard settings, catch it quietly
                const errStr = String(err.message || "").toLowerCase() + String(err.errors?.[0]?.longMessage || "").toLowerCase();
                const isInvalidParam = errStr.includes("invalid parameter") || errStr.includes("not a valid parameter") || err.errors?.some(e => e.code === 'form_param_format_invalid');
                
                if (isInvalidParam) {
                    console.warn("Native username update rejected by Clerk. Saving to unsafeMetadata fallback instead.");
                    metadataUpdates.username = currentUsername;
                    needsMetadataUpdate = true;
                } else {
                    console.error("Failed to update username", err);
                    finalErrorMessage += `Username Error: ${err.errors?.[0]?.longMessage || err.message}\n`;
                }
            }
        }

        // 4. Process Bio / Metadata Update independently
        if (currentBio !== initialProfileState.bio) {
            metadataUpdates.bio = currentBio;
            needsMetadataUpdate = true;
        }

        if (needsMetadataUpdate) {
            try {
                await user.update({ unsafeMetadata: metadataUpdates });
            } catch(err) {
                console.error("Failed to update metadata", err);
                finalErrorMessage += `Bio/Metadata Error: ${err.errors?.[0]?.longMessage || err.message}\n`;
            }
        }

        if (finalErrorMessage) {
            alert("Some changes could not be saved:\n" + finalErrorMessage);
        }

        // 3. Process Email Update (Requires Verification Modal Flow)
        const currentEmail = emailInput.value.trim();
        if (currentEmail !== initialProfileState.email && currentEmail.includes('@')) {
            try {
                // Create an unverified email object
                const newEmailObj = await user.createEmailAddress({ email: currentEmail });
                
                // Trigger the passcode to be sent
                await newEmailObj.prepareVerification({ strategy: "email_code" });
                
                // Store state and display modal
                pendingVerificationId = newEmailObj.id;
                pendingVerificationType = 'email';
                showModal('email', currentEmail);
                setLoading(saveBtn, false);
                return; // Stop here, wait for modal loop to finish
                
            } catch (err) {
                console.error("Email verification preparation failed", err);
                alert("Could not initiate email update: " + (err.errors?.[0]?.longMessage || err.message));
                setLoading(saveBtn, false);
                return;
            }
        }

        // 4. Process Phone Update (Requires Verification Modal Flow)
        const currentPhone = phoneInput.value.trim();
        if (currentPhone !== initialProfileState.phone && currentPhone.length >= 10) {
            try {
                const newPhoneObj = await user.createPhoneNumber({ phoneNumber: currentPhone });
                await newPhoneObj.prepareVerification({ strategy: "phone_code" });
                
                pendingVerificationId = newPhoneObj.id;
                pendingVerificationType = 'phone';
                showModal('phone', currentPhone);
                setLoading(saveBtn, false);
                return; // Stop here

            } catch (err) {
                console.error("Phone verification preparation failed", err);
                alert("Could not initiate phone update: " + (err.errors?.[0]?.longMessage || err.message));
                setLoading(saveBtn, false);
                return;
            }
        }

        // Force Clerk to pull the fresh state from the database before redrawing the UI
        try { await user.reload(); } catch(e) { console.warn("Relisting user failed", e); }
        
        // If no verifiable fields changed, successfully complete
        await populateProfileData();
        if (window.syncGlobalProfileUI) window.syncGlobalProfileUI();
        setLoading(saveBtn, false);
        showToast("Profile successfully updated!");
    });


    // --- OTP Verification Submission ---
    otpVerifyBtn.addEventListener('click', async () => {
        const code = otpCodeInput.value.trim();
        if (code.length < 6) {
            otpErrorMsg.textContent = "Please enter the full 6-digit code";
            otpErrorMsg.classList.remove('hidden');
            return;
        }

        setLoading(otpVerifyBtn, true);
        otpErrorMsg.classList.add('hidden');
        const user = window.Clerk.user;

        try {
            if (pendingVerificationType === 'email') {
                // Find the unverified email object by ID
                const emailObj = user.emailAddresses.find(e => e.id === pendingVerificationId);
                if (!emailObj) throw new Error("Verification target lost");

                // Submit Code
                const verifiedEmail = await emailObj.attemptVerification({ code });
                
                // If successful, set it as the primary email
                if (verifiedEmail.verification.status === "verified") {
                    await user.update({ primaryEmailAddressId: verifiedEmail.id });
                    
                    // Cleanup old emails: remove the old one if it exists to strictly swap
                    const oldEmail = user.emailAddresses.find(e => e.id !== verifiedEmail.id);
                    if (oldEmail) {
                        try { await oldEmail.destroy(); } catch(e) {} // best effort ignore errors
                    }
                }
            } else if (pendingVerificationType === 'phone') {
                const phoneObj = user.phoneNumbers.find(p => p.id === pendingVerificationId);
                if (!phoneObj) throw new Error("Verification target lost");

                const verifiedPhone = await phoneObj.attemptVerification({ code });
                
                if (verifiedPhone.verification.status === "verified") {
                    await user.update({ primaryPhoneNumberId: verifiedPhone.id });
                }
            }

            hideModal();
            // Force Clerk to pull the fresh state from the database before redrawing the UI
            try { await user.reload(); } catch(e) { console.warn("Relisting user failed", e); }
            
            // Data has been saved to Clerk, refresh the UI cache
            await populateProfileData();
            if (window.syncGlobalProfileUI) window.syncGlobalProfileUI();
            
        } catch (err) {
            console.error("OTP verification failed", err);
            otpErrorMsg.textContent = err.errors?.[0]?.longMessage || "Invalid verification code. Please try again.";
            otpErrorMsg.classList.remove('hidden');
        }

        setLoading(otpVerifyBtn, false);
    });

    // Auto-focus logic for 6-digit input ease-of-use
    otpCodeInput.addEventListener('input', (e) => {
        // Enforce numeric only and clear errors on type
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        otpErrorMsg.classList.add('hidden');
    });

    otpResendBtn.addEventListener('click', async () => {
        otpErrorMsg.classList.add('hidden');
        const user = window.Clerk.user;
        
        try {
            if (pendingVerificationType === 'email') {
                const emailObj = user.emailAddresses.find(e => e.id === pendingVerificationId);
                await emailObj.prepareVerification({ strategy: "email_code" });
            } else if (pendingVerificationType === 'phone') {
                const phoneObj = user.phoneNumbers.find(p => p.id === pendingVerificationId);
                await phoneObj.prepareVerification({ strategy: "phone_code" });
            }
            otpErrorMsg.textContent = "Code resent successfully.";
            otpErrorMsg.classList.remove('text-red-500');
            otpErrorMsg.classList.add('text-emerald-500');
            otpErrorMsg.classList.remove('hidden');
            
            // Revert back to error mode after 3 seconds
            setTimeout(() => {
                otpErrorMsg.classList.add('hidden');
                otpErrorMsg.classList.remove('text-emerald-500');
                otpErrorMsg.classList.add('text-red-500');
            }, 3000);
            
        } catch (err) {
            otpErrorMsg.textContent = "Rate limit exceeded. Try again in a minute.";
            otpErrorMsg.classList.remove('hidden');
        }
    });

    // --- Live Typing UI Sync ---
    nameInput.addEventListener('input', () => {
        const newName = nameInput.value.trim() || 'User';
        let newUsername = usernameInput.value.trim() || 'Guest';
        if (newUsername !== 'Guest' && !newUsername.startsWith('@')) newUsername = '@' + newUsername;
        
        // Update local page header
        headerName.textContent = newName;
        
        // Update universal UI headers
        if (window.syncGlobalProfileUI) window.syncGlobalProfileUI(newName, newUsername);
    });

    usernameInput.addEventListener('input', () => {
        let raw = usernameInput.value.trim();
        if (raw && !raw.startsWith('@')) raw = '@' + raw;
        
        const newName = nameInput.value.trim() || 'User';
        const newUsername = raw || 'Guest';
        
        // Update local page header
        headerUsername.textContent = newUsername;
        
        // Update universal UI headers
        if (window.syncGlobalProfileUI) window.syncGlobalProfileUI(newName, newUsername);
    });

    // --- Input Edit Locks ---
    document.querySelectorAll('.edit-icon-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const container = e.target.closest('.relative.group');
            if (!container) return;
            const input = container.querySelector('input, textarea');
            if (input) {
                input.removeAttribute('readonly');
                input.focus();
                
                e.target.classList.add('text-electric-blue');
                e.target.classList.remove('text-slate-500/50', 'hover:text-white');
            }
        });
    });

    document.querySelectorAll('#profile-name-input, #profile-username-input, #profile-email-input, #profile-phone-input, #profile-bio-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            e.target.setAttribute('readonly', 'true');
            
            const container = e.target.closest('.relative.group');
            if (container) {
                const icon = container.querySelector('.edit-icon-btn');
                if (icon) {
                    icon.classList.remove('text-electric-blue');
                    icon.classList.add('text-slate-500/50', 'hover:text-white');
                }
            }
        });
    });
});

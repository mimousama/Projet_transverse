// 1. Define the Scenarios and Dialogue Trees
    const database = {
        mainMenu: {
            text: "Select a simulation to practice:",
            choices: [
                { text: "1. Phishing (Bank Alert)", next: "phishing_start" },
                { text: "2. Smishing (Package Delivery)", next: "smishing_start" },
                { text: "3. Family Impersonation", next: "family_start" },
                { text: "4. AI Voice Cloning (Emergency)", next: "aiclone_start" } // NEW SCENARIO ADDED
            ]
        },

        // --- SCENARIO 1: PHISHING ---
        phishing_start: {
            stranger: "BANK ALERT: Your account ending in 4920 has been locked due to suspicious activity. Reply with your 4-digit PIN immediately to verify your identity and unlock your account.",
            choices: [
                { text: "Reply with my PIN (e.g., 1234)", next: "phishing_lose" },
                { text: "Ask 'Who is this?'", next: "phishing_push" },
                { text: "Ignore the message and call my bank using the number on my card.", next: "phishing_win" }
            ]
        },
        phishing_push: {
            stranger: "This is the Fraud Department. Failure to provide your PIN in the next 5 minutes will result in permanent account closure.",
            choices: [
                { text: "Give them the PIN, I don't want to lose my account.", next: "phishing_lose" },
                { text: "Do not reply. Call the bank directly.", next: "phishing_win" }
            ]
        },

        // --- SCENARIO 2: SMISHING ---
        smishing_start: {
            stranger: "Postal Service: Your package delivery failed due to unpaid customs fees. Please click here to pay the $2.99 fee: http://post-update-info.com/pay",
            choices: [
                { text: "Click the link to pay the small fee.", next: "smishing_lose" },
                { text: "Reply 'I did not order anything.'", next: "smishing_push" },
                { text: "Delete the message.", next: "smishing_win" }
            ]
        },
        smishing_push: {
            stranger: "If the fee is not paid today, the package will be returned to the sender. Click the link to resolve.",
            choices: [
                { text: "Click the link just to see what the package is.", next: "smishing_lose" },
                { text: "Block the number and delete.", next: "smishing_win" }
            ]
        },

        // --- SCENARIO 3: FAMILY IMPERSONATION ---
        family_start: {
            stranger: "Hi Grandma/Grandpa, it's me. I dropped my phone in the toilet and this is my temporary number. I'm in trouble and need to pay a bill urgently. Can you wire me $500?",
            choices: [
                { text: "Oh no! Where do I send the money?", next: "family_lose" },
                { text: "Reply: 'Which grandchild is this?'", next: "family_push" },
                { text: "Call their original, saved phone number to check if they are okay.", next: "family_win" }
            ]
        },
        family_push: {
            stranger: "It's your favorite! Please hurry, my electricity is going to be shut off. I'll send you the wire transfer details now.",
            choices: [
                { text: "Okay, send me the details.", next: "family_lose" },
                { text: "Ask a secret family question: 'What is the name of my first dog?'", next: "family_win" }
            ]
        },

        // --- SCENARIO 4: AI VOICE CLONING (NEW) ---
        aiclone_start: {
            stranger: "[Call connected. You hear a 3-second unnatural silence] ... Hello? Grandma/Grandpa? It's me! I was in a terrible car accident and the police are arresting me! Please, you have to help me!",
            choices: [
                { text: "Oh my goodness! Are you hurt? What do I need to do?", next: "aiclone_push" },
                { text: "Ask: 'What is our family safe word?'", next: "aiclone_win" },
                { text: "Hang up immediately and call their saved phone number.", next: "aiclone_win" }
            ]
        },
        aiclone_push: {
            stranger: "I have a broken nose, I can't talk long! The police say I need $1,000 for bail right now. Please buy Apple gift cards and read me the numbers on the back so I can get out!",
            choices: [
                { text: "Okay, I am going to the store right now, stay on the line.", next: "aiclone_lose" },
                { text: "Gift cards? The police don't ask for gift cards. [Hang up]", next: "aiclone_win" },
                { text: "Give me the police officer's badge number.", next: "aiclone_push2" }
            ]
        },
        aiclone_push2: {
            stranger: "[Voice sounds frantic but lacks breathing pauses] There's no time for that! If you don't give me the gift card numbers in the next 10 minutes, I'm going to prison! Don't you love me?!",
            choices: [
                { text: "Fine, I'll go get the cards.", next: "aiclone_lose" },
                { text: "Hang up and call your loved one directly.", next: "aiclone_win" }
            ]
        }
    };

    // 2. Core Logic Variables
    const chatWindow = document.getElementById('chat-window');
    const choicesArea = document.getElementById('choices-area');
    const header = document.getElementById('header');
    const feedbackScreen = document.getElementById('feedback-screen');
    const feedbackIcon = document.getElementById('feedback-icon');
    const feedbackText = document.getElementById('feedback-text');

    // 3. Functions to control the flow
    function showMainMenu() {
        feedbackScreen.style.display = 'none';
        header.innerText = "Training Menu";
        chatWindow.innerHTML = ""; 
        
        // Add a friendly greeting
        addMessage("Welcome to the Scam Awareness Simulator. Please choose a scenario to practice.", "stranger");
        renderChoices(database.mainMenu.choices);
    }

    function loadNode(nodeId) {
        // Handle Win/Lose states with scenario-specific feedback
        if (nodeId.includes("win")) {
            let winMessage = "Great job! You recognized the scam and protected your personal information. Remember: Banks and legitimate services will never ask for your PIN or rush you over a text message.";
            
            // Custom feedback for the AI Cloning scenario
            if (nodeId.includes("aiclone")) {
                winMessage = "Excellent! You spotted the telltale signs of an AI voice clone (the 3-second delay, untraceable gift cards). Hanging up, verifying, and using a Family Safe Word are your best defenses.";
            }
            
            showFeedback(true, winMessage);
            return;
        }
        
        if (nodeId.includes("lose")) {
            let loseMessage = "Oh no! The scammer tricked you. Remember: Never click unknown links, never share your PIN, and always verify urgent requests for money by calling the person's original number.";
            
            // Custom feedback for the AI Cloning scenario
            if (nodeId.includes("aiclone")) {
                loseMessage = "Oh no! The AI voice tricked you. Remember: Scammers use fake emergencies to create panic. The police will never ask for gift cards, and you should always hang up and call your relative directly to verify.";
            }

            showFeedback(false, loseMessage);
            return;
        }

        // Handle continuing the conversation
        const node = database[nodeId];
        header.innerText = "Unknown Number";
        
        // Show stranger's message
        addMessage(node.stranger, "stranger");
        
        // Render user's options
        renderChoices(node.choices);
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.innerText = text;
        chatWindow.appendChild(msgDiv);
        
        // Auto-scroll to bottom
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function renderChoices(choices) {
        choicesArea.innerHTML = ""; // Clear old choices
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.innerText = choice.text;
            btn.onclick = () => {
                // If we are in a scenario (not main menu), show what the user selected
                if(header.innerText !== "Training Menu") {
                    addMessage(choice.text, "user");
                }
                
                // Add a small delay before loading the next step to simulate reality
                choicesArea.innerHTML = ""; // Hide buttons while "thinking"
                setTimeout(() => {
                    loadNode(choice.next);
                }, 800);
            };
            choicesArea.appendChild(btn);
        });
    }

    function showFeedback(isSuccess, text) {
        feedbackScreen.style.display = 'flex';
        if (isSuccess) {
            feedbackIcon.innerText = "✅";
            feedbackIcon.style.color = "#28a745";
        } else {
            feedbackIcon.innerText = "❌";
            feedbackIcon.style.color = "#dc3545";
        }
        feedbackText.innerText = text;
    }

    // Initialize the app on load
    showMainMenu();
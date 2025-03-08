export const twitterInputs = {
  username: "username-input",
  handle: "handle-input",
  verified: "verified-input",
  text: "text-input",
  hashtags: "hashtags-input",
  date: "date-input",
  os: "os-input",
  retweets: "retweets-input",
  quotes: "quotes-input",
  likes: "likes-input",
  theme: "theme-input",
};

export const instagramInputs = {
  username: "ig-username-input",
  verified: "ig-verified-input",
  caption: "ig-caption-input",
  location: "ig-location-input",
  likes: "ig-likes-input",
  date: "ig-date-input",
  theme: "ig-theme-input",
};

export const facebookInputs = {
  username: "fb-username-input",
  verified: "fb-verified-input",
  text: "fb-text-input",
  privacy: "fb-privacy-input",
  reactions: "fb-reactions-input",
  comments: "fb-comments-input",
  shares: "fb-shares-input",
  date: "fb-date-input",
  theme: "fb-theme-input",
};

export const chatgptInputs = {
  username: "chatgpt-username-input",
  model: "chatgpt-model-input",
  theme: "chatgpt-theme-input"
};

function updatePreview(inputs, platform) {
  const values = {};

  Object.entries(inputs).forEach(([key, id]) => {
    if (key == "verified" && !document.getElementById(id).checked) {
      values[key] = "false";
    }
    const value = document.getElementById(id).value;

    if (key == "os" && value == "iPhone") return;
    if (key == "theme" && value == "light") return;

    if (value) values[key] = value;
  });

  const params = new URLSearchParams(values);
  let url = window.location.origin + `/api${platform ? '-' + platform : ''}`;
  if (Object.keys(values).length > 0) url += "?" + params.toString();

  const preview = document.getElementById(`${platform || 'twitter'}-preview-img`);
  preview.src = url;

  document.getElementById(`${platform || 'twitter'}-text-output`).textContent = url;
  document.getElementById(`${platform || 'twitter'}-markdown-output`).textContent = `![](${url})`;
  document.getElementById(`${platform || 'twitter'}-html-output`).textContent = `<img src="${url}" alt="">`;
}

export function updateChatGPTPreview() {
  const values = {};
  
  // Get basic inputs
  Object.entries(chatgptInputs).forEach(([key, id]) => {
    const value = document.getElementById(id)?.value;
    if (key === "theme" && value === "light") return;
    if (value) values[key] = value;
  });

  // Get messages from dynamic inputs
  const messageInputs = document.querySelectorAll('#chatgpt-messages-container .input-group');
  const messages = Array.from(messageInputs).map(group => ({
    role: group.querySelector('select').value,
    content: group.querySelector('.message-input').value || "Hello!"
  }));
  
  if (messages.length > 0) {
    values.messages = JSON.stringify(messages);
  }

  // Create URL with parameters
  const params = new URLSearchParams(values);
  let url = window.location.origin + "/api-chatgpt";
  if (Object.keys(values).length > 0) url += "?" + params.toString();

  // Update preview and embed codes
  const preview = document.getElementById("chatgpt-preview-img");
  if (preview) {
    preview.src = url;
    
    document.getElementById("chatgpt-text-output").textContent = url;
    document.getElementById("chatgpt-markdown-output").textContent = `![](${url})`;
    document.getElementById("chatgpt-html-output").textContent = `<img src="${url}" alt="">`;
  }
}

export function initializePreviews() {
  // Add event listeners
  Object.values(twitterInputs).forEach((id) => {
    const inputElement = document.getElementById(id);
    inputElement?.addEventListener("input", () => updatePreview(twitterInputs));
  });

  Object.values(instagramInputs).forEach((id) => {
    const inputElement = document.getElementById(id);
    inputElement?.addEventListener("input", () => updatePreview(instagramInputs, 'instagram'));
  });

  Object.values(facebookInputs).forEach((id) => {
    const inputElement = document.getElementById(id);
    inputElement?.addEventListener("input", () => updatePreview(facebookInputs, 'facebook'));
  });

  // Add ChatGPT listeners
  Object.values(chatgptInputs).forEach((id) => {
    const inputElement = document.getElementById(id);
    inputElement?.addEventListener("input", () => updateChatGPTPreview());
  });

  // Add listener for message changes
  const messagesContainer = document.getElementById('chatgpt-messages-container');
  if (messagesContainer) {
    const observer = new MutationObserver(updateChatGPTPreview);
    observer.observe(messagesContainer, { 
      childList: true, 
      subtree: true, 
      characterData: true 
    });
  }

  // Initialize previews
  updatePreview(twitterInputs);
  updatePreview(instagramInputs, 'instagram');
  updatePreview(facebookInputs, 'facebook');
  updateChatGPTPreview();
} 
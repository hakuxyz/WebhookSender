function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab[onclick="switchTab('${tabId}')"]`).classList.add('active');
}

function toggleEmbed() {
    const embedSection = document.getElementById('embed-section');
    const embedToggle = document.getElementById('embed-toggle');
    embedSection.classList.toggle('hidden', !embedToggle.checked);
}


document.getElementById('embed-color').addEventListener('input', function() {
    document.getElementById('color-preview').style.backgroundColor = this.value;
});

document.getElementById('embed-color-tab').addEventListener('input', function() {
    document.getElementById('color-preview-tab').style.backgroundColor = this.value;
});


function addField() {
    const fieldsContainer = document.getElementById('embed-fields');
    const newField = document.createElement('div');
    newField.className = 'embed-field';
    newField.innerHTML = `
        <input type="text" class="field-name" placeholder="Field name">
        <input type="text" class="field-value" placeholder="Field value">
        <select class="field-inline">
            <option value="false">Not inline</option>
            <option value="true">Inline</option>
        </select>
        <button onclick="removeField(this)" class="add-btn">Remove</button>
    `;
    fieldsContainer.appendChild(newField);
}

function addFieldTab() {
    const fieldsContainer = document.getElementById('embed-fields-tab');
    const newField = document.createElement('div');
    newField.className = 'embed-field';
    newField.innerHTML = `
        <input type="text" class="field-name" placeholder="Field name">
        <input type="text" class="field-value" placeholder="Field value">
        <select class="field-inline">
            <option value="false">Not inline</option>
            <option value="true">Inline</option>
        </select>
        <button onclick="removeField(this)" class="add-btn">Remove</button>
    `;
    fieldsContainer.appendChild(newField);
}

function removeField(button) {
    button.parentElement.remove();
}


function previewWebhook() {
    const previewContainer = document.getElementById('preview-content');
    const messageContent = document.getElementById('message-content').value;
    const username = document.getElementById('webhook-username').value;
    const avatarUrl = document.getElementById('webhook-avatar').value;
    const embedEnabled = document.getElementById('embed-toggle').checked;
    
    let previewHTML = '<div class="message-preview">';
    

    previewHTML += '<div class="message-header">';
    if (avatarUrl) {
        previewHTML += `<img src="${avatarUrl}" class="message-avatar" onerror="this.style.display='none'">`;
    }
    previewHTML += `<span class="message-username">${username || 'Webhook'}</span>`;
    previewHTML += '</div>';
    

    if (messageContent) {
        previewHTML += `<div class="message-content">${messageContent.replace(/\n/g, '<br>')}</div>`;
    }
    

    if (embedEnabled) {
        const embedTitle = document.getElementById('embed-title').value;
        const embedDescription = document.getElementById('embed-description').value;
        const embedColor = document.getElementById('embed-color').value;
        const embedUrl = document.getElementById('embed-url').value;
        const embedAuthorName = document.getElementById('embed-author-name').value;
        const embedAuthorUrl = document.getElementById('embed-author-url').value;
        const embedAuthorIcon = document.getElementById('embed-author-icon').value;
        const embedFooterText = document.getElementById('embed-footer-text').value;
        const embedFooterIcon = document.getElementById('embed-footer-icon').value;
        const embedImage = document.getElementById('embed-image').value;
        const embedThumbnail = document.getElementById('embed-thumbnail').value;
        
        previewHTML += '<div class="embed-preview" style="border-left-color: ' + (embedColor || '#00a2ff') + '">';
        
        if (embedTitle) {
            if (embedUrl) {
                previewHTML += `<div class="embed-title"><a href="${embedUrl}" style="color: inherit; text-decoration: none;">${embedTitle}</a></div>`;
            } else {
                previewHTML += `<div class="embed-title">${embedTitle}</div>`;
            }
        }
        
        if (embedDescription) {
            previewHTML += `<div class="embed-description">${embedDescription.replace(/\n/g, '<br>')}</div>`;
        }
        

        const fieldContainers = document.querySelectorAll('#embed-fields .embed-field');
        fieldContainers.forEach(field => {
            const name = field.querySelector('.field-name').value;
            const value = field.querySelector('.field-value').value;
            if (name && value) {
                previewHTML += '<div class="embed-field-preview">';
                previewHTML += `<div class="embed-field-name">${name}</div>`;
                previewHTML += `<div class="embed-field-value">${value.replace(/\n/g, '<br>')}</div>`;
                previewHTML += '</div>';
            }
        });
        
        if (embedFooterText) {
            previewHTML += '<div class="embed-footer">';
            if (embedFooterIcon) {
                previewHTML += `<img src="${embedFooterIcon}" onerror="this.style.display='none'">`;
            }
            previewHTML += `<span>${embedFooterText}</span>`;
            previewHTML += '</div>';
        }
        
        previewHTML += '</div>';
    }
    
    previewHTML += '</div>';
    previewContainer.innerHTML = previewHTML;
}


async function sendWebhook() {
    const webhookUrl = document.getElementById('webhook-url').value;
    if (!webhookUrl) {
        alert('Please enter a webhook URL');
        return;
    }
    
    const messageContent = document.getElementById('message-content').value;
    const username = document.getElementById('webhook-username').value;
    const avatarUrl = document.getElementById('webhook-avatar').value;
    const embedEnabled = document.getElementById('embed-toggle').checked;
    
    const payload = {
        content: messageContent || null,
        username: username || null,
        avatar_url: avatarUrl || null,
        embeds: []
    };
    
    if (embedEnabled) {
        const embed = {
            title: document.getElementById('embed-title').value || null,
            description: document.getElementById('embed-description').value || null,
            url: document.getElementById('embed-url').value || null,
            color: hexToDecimal(document.getElementById('embed-color').value),
            author: null,
            footer: null,
            fields: [],
            image: null,
            thumbnail: null
        };
        
        
        const authorName = document.getElementById('embed-author-name').value;
        if (authorName) {
            embed.author = {
                name: authorName,
                url: document.getElementById('embed-author-url').value || null,
                icon_url: document.getElementById('embed-author-icon').value || null
            };
        }
        

        const footerText = document.getElementById('embed-footer-text').value;
        if (footerText) {
            embed.footer = {
                text: footerText,
                icon_url: document.getElementById('embed-footer-icon').value || null
            };
        }
        

        document.querySelectorAll('#embed-fields .embed-field').forEach(field => {
            const name = field.querySelector('.field-name').value;
            const value = field.querySelector('.field-value').value;
            const inline = field.querySelector('.field-inline').value === 'true';
            
            if (name && value) {
                embed.fields.push({
                    name: name,
                    value: value,
                    inline: inline
                });
            }
        });
        

        const imageUrl = document.getElementById('embed-image').value;
        if (imageUrl) {
            embed.image = {
                url: imageUrl
            };
        }
        

        const thumbnailUrl = document.getElementById('embed-thumbnail').value;
        if (thumbnailUrl) {
            embed.thumbnail = {
                url: thumbnailUrl
            };
        }
        
        payload.embeds.push(embed);
    }
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            const successMessage = document.getElementById('success-message');
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        } else {
            alert(`Failed to send webhook: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        alert(`Error sending webhook: ${error.message}`);
    }
}


function hexToDecimal(hex) {
    if (!hex) return null;
    hex = hex.replace('#', '');
    return parseInt(hex, 16);
}


function changeTheme() {
    const theme = document.getElementById('theme-selector').value;
    document.body.className = `theme-${theme}`;
    localStorage.setItem('selectedTheme', theme);
}


function saveDefaultWebhook() {
    const defaultUrl = document.getElementById('default-webhook-url').value;
    if (defaultUrl) {
        localStorage.setItem('defaultWebhookUrl', defaultUrl);
        alert('Default webhook URL saved!');
    }
}


window.addEventListener('load', function() {

    const savedTheme = localStorage.getItem('selectedTheme') || 'dark';
    document.getElementById('theme-selector').value = savedTheme;
    document.body.className = `theme-${savedTheme}`;
    

    const savedUrl = localStorage.getItem('defaultWebhookUrl');
    if (savedUrl) {
        document.getElementById('webhook-url').value = savedUrl;
        document.getElementById('default-webhook-url').value = savedUrl;
    }
});
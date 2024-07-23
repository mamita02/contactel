document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('addContactBtn').addEventListener('click', showAddContactModal);
    document.getElementById('contactForm').addEventListener('submit', addContact);
    document.getElementById('cancelAdd').addEventListener('click', hideAddContactModal);
    loadContacts();
}

function showAddContactModal() {
    document.getElementById('addContactModal').style.display = 'block';
}

function hideAddContactModal() {
    document.getElementById('addContactModal').style.display = 'none';
}

function addContact(e) {
    e.preventDefault();
    var nom = document.getElementById('nom').value;
    var telephone = document.getElementById('telephone').value;
    
    var contact = {
        "nom": nom,
        "telephone": telephone,
        "avatar": "https://via.placeholder.com/50"
    };

    var contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    contacts.push(contact);
    localStorage.setItem('contacts', JSON.stringify(contacts));

    hideAddContactModal();
    loadContacts();
    document.getElementById('contactForm').reset();
}

function loadContacts() {
    var contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    var contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    contacts.forEach(function(contact, index) {
        var contactElement = document.createElement('div');
        contactElement.className = 'contact';
        contactElement.innerHTML = `
            <img src="${contact.avatar}" alt="Avatar" class="contact-avatar">
            <div class="contact-info">
                <h2 class="contact-name">${contact.nom}</h2>
                <p class="contact-phone">${contact.telephone}</p>
            </div>
            <button class="options-btn" data-index="${index}">⋮</button>
        `;
        contactList.appendChild(contactElement);
    });

    // Ajouter un écouteur d'événements pour les boutons d'options
    var optionsBtns = document.querySelectorAll('.options-btn');
    optionsBtns.forEach(function(btn) {
        btn.addEventListener('click', function(event) {
            var index = event.target.getAttribute('data-index');
            showOptions(index);
        });
    });
}
function showOptions(index) {
    var options = ['Modifier', 'Supprimer', 'Annuler'];
    navigator.notification.confirm(
        'Que voulez-vous faire avec ce contact ?',
        function(buttonIndex) {
            switch(buttonIndex) {
                case 1:
                    editContact(index);
                    break;
                case 2:
                    deleteContact(index);
                    break;
                case 3:
                    // Annuler, ne rien faire
                    break;
            }
        },
        'Options du contact',
        options
    );
}

function editContact(index) {
    var contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    var contact = contacts[index];

    var editForm = `
        <input type="text" id="editNom" value="${contact.nom}" placeholder="Nom" required>
        <input type="tel" id="editTelephone" value="${contact.telephone}" placeholder="Téléphone" required>
    `;

    navigator.notification.confirm(
        editForm,
        function(buttonIndex) {
            if (buttonIndex === 1) {
                var newNom = document.getElementById('editNom').value;
                var newTelephone = document.getElementById('editTelephone').value;
                
                contact.nom = newNom;
                contact.telephone = newTelephone;
                contacts[index] = contact;
                localStorage.setItem('contacts', JSON.stringify(contacts));
                loadContacts();
            }
        },
        'Modifier le contact',
        ['Sauvegarder', 'Annuler']
    );
}
function deleteContact(index) {
    navigator.notification.confirm(
        'Êtes-vous sûr de vouloir supprimer ce contact ?',
        function(buttonIndex) {
            if (buttonIndex === 1) {
                var contacts = JSON.parse(localStorage.getItem('contacts')) || [];
                contacts.splice(index, 1);
                localStorage.setItem('contacts', JSON.stringify(contacts));
                loadContacts();
            }
        },
        'Confirmer la suppression',
        ['Oui', 'Non']
    );
}
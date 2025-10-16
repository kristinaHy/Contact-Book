const API_BASE = "http://127.0.0.1:8000/api/contacts/";

const contactForm = document.getElementById("contactForm");
const contactList = document.getElementById("contactList");
const searchInput = document.getElementById("searchInput");
const orderSelect = document.getElementById("orderSelect");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

let editContactId = null;
let currentPage = 1;
const pageSize = 5;
let totalPages = 1;

// Load contacts
async function loadContacts() {
  const searchQuery = searchInput.value;
  const order = orderSelect.value;

  let url = `${API_BASE}?page=${currentPage}&page_size=${pageSize}`;
  if (searchQuery) url += `&search=${searchQuery}`;
  if (order) url += `&ordering=${order}`;

  const res = await fetch(url);
  const data = await res.json();

  contactList.innerHTML = "";
  data.results.forEach(contact => {
    const li = document.createElement("li");
    li.className = "contact-item";
    // Inside loadContacts()
    li.innerHTML = `
    <div class="contact-info">
        <strong>${contact.name}</strong><br>
        Phone: ${contact.phone || "N/A"}<br>
        Address: ${contact.address || "N/A"}
    </div>
    <div class="contact-buttons">
        <button class="btn-edit" onclick="editContact(${contact.id}, this)">Edit</button>
        <button class="btn-delete" onclick="deleteContact(${contact.id})">Delete</button>
    </div>
    `;

    contactList.appendChild(li);
  });

  totalPages = Math.ceil(data.count / pageSize);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Add or Update contact
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const contactData = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
  };

  if (editContactId) {
    await fetch(`${API_BASE}${editContactId}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
    });
    editContactId = null;
    document.getElementById("form-note").innerText = "Add a new contact";
  } else {
    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
    });
  }

  contactForm.reset();
  loadContacts();
});


// Inline Edit with sliding overlay
async function editContact(id, btn) {
  const res = await fetch(`${API_BASE}${id}/`);
  const data = await res.json();

  const li = btn.closest(".contact-item");

  // Add overlay container
  li.innerHTML = `
    <div class="contact-overlay">
      <form onsubmit="updateContact(event, ${id})" class="edit-form-slide">
        <h4>Edit Contact</h4>
        <label>Name:</label>
        <input type="text" id="editName" value="${data.name}" required>
        <label>Phone:</label>
        <input type="text" id="editPhone" value="${data.phone || ''}">
        <label>Address:</label>
        <input type="text" id="editAddress" value="${data.address || ''}">
        <div class="edit-buttons">
          <button type="submit" class="btn-submit">Update</button>
          <button type="button" class="btn-delete" onclick="loadContacts()">Cancel</button>
        </div>
      </form>
    </div>
  `;
}



// Update contact inline
async function updateContact(e, id) {
  e.preventDefault();
  const li = e.target.closest(".contact-item");
  const contactData = {
    name: li.querySelector("#editName").value,
    phone: li.querySelector("#editPhone").value,
    address: li.querySelector("#editAddress").value,
  };

  await fetch(`${API_BASE}${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contactData),
  });

  loadContacts();
}

// Delete
async function deleteContact(id) {
  if (confirm("Are you sure you want to delete this contact?")) {
    await fetch(`${API_BASE}${id}/`, { method: "DELETE" });
    loadContacts();
  }
}

//Search & ordering
searchInput.addEventListener("input",() => {currentPage =1; loadContacts();});
orderSelect.addEventListener("change", () => {loadContacts(); });

//Pagination
prevPageBtn.addEventListener("click", () => { if(currentPage>1){currentPage--;loadContacts();}});
nextPageBtn.addEventListener("click",()=>{if(currentPage<totalPages){currentPage++; loadContacts();}});


// Initial load
loadContacts();

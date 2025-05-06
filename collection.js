let playerCollection = [];
let selectedCardIndex = null;

// Load saved data and render
document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("playerCollection");
  if (saved) {
    playerCollection = JSON.parse(saved);
    renderCollection();
  }

  const owoCash = parseInt(localStorage.getItem("owoCash")) || 0;
  document.getElementById("coins").textContent = owoCash.toLocaleString();
});

// Render collection cards
function renderCollection() {
  const collectionDiv = document.getElementById("collection");
  collectionDiv.innerHTML = "";

  playerCollection.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.className = "card";
    cardElement.innerHTML = `
      <img src="${card.Image}" alt="${card.Name}" style="width:100px;height:auto;">
      <p><strong>${card.Name}</strong></p>
    `;
    cardElement.addEventListener("click", () => openModal(index));
    collectionDiv.appendChild(cardElement);
  });
}

// Open modal with card details
function openModal(index) {
  selectedCardIndex = index;
  const card = playerCollection[index];
  const modal = document.getElementById("playerModal");
  const details = document.getElementById("modalDetails");

  details.innerHTML = `
    <h3>${card.Name}</h3>
    <img src="${card.Image}" alt="${card.Name}" style="width:150px;"><br>
    <p>Role: ${card.Role || "N/A"}</p>
    <p>Value: ${card.Value?.toLocaleString() || 0} Owo Cash</p>
  `;

  modal.style.display = "flex";
}

// Close modal
function closeModal() {
  document.getElementById("playerModal").style.display = "none";
  selectedCardIndex = null;
}

// Sell card
document.getElementById("sellCardBtn").addEventListener("click", () => {
  if (selectedCardIndex !== null) {
    const card = playerCollection[selectedCardIndex];
    const value = card.Value || 0;

    // Remove from collection
    playerCollection.splice(selectedCardIndex, 1);
    localStorage.setItem("playerCollection", JSON.stringify(playerCollection));

    // Update cash
    let cash = parseInt(localStorage.getItem("owoCash")) || 0;
    cash += value;
    localStorage.setItem("owoCash", cash);
    document.getElementById("coins").textContent = cash.toLocaleString();

    alert(`You sold ${card.Name} for ${value.toLocaleString()} Owo Cash!`);
    closeModal();
    renderCollection();
  }
});

// Search cards
function searchCards() {
  const input = document.getElementById("cardSearch").value.toLowerCase();
  const filtered = playerCollection.filter((card) =>
    card.Name.toLowerCase().includes(input)
  );
  renderFilteredCollection(filtered);
}

// Clear search
function clearSearch() {
  document.getElementById("cardSearch").value = "";
  renderCollection();
}

// Render filtered collection
function renderFilteredCollection(cards) {
  const collectionDiv = document.getElementById("collection");
  collectionDiv.innerHTML = "";

  cards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.className = "card";
    cardElement.innerHTML = `
      <img src="${card.Image}" alt="${card.Name}" style="width:100px;height:auto;">
      <p><strong>${card.Name}</strong></p>
    `;
    cardElement.addEventListener("click", () => openModal(index));
    collectionDiv.appendChild(cardElement);
  });
}

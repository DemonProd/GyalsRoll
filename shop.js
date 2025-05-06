let owoCash = parseInt(localStorage.getItem('owoCash')) || 1000;
let playerCollection = JSON.parse(localStorage.getItem('playerCollection')) || [];
let cardsData = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadCardsData();
  updateCashDisplay();
  setupButtons();
});

function loadCardsData() {
  return fetch('cards.json')
    .then(res => res.json())
    .then(data => {
      cardsData = data;
    })
    .catch(err => {
      console.error("Card data load error:", err);
      showMessage("Failed to load cards.", false);
    });
}

function updateCashDisplay() {
  document.getElementById("owo-cash-display").textContent = `Owo Cash: ${owoCash.toLocaleString()}`;
}

function setupButtons() {
  const buttons = document.querySelectorAll('.owo-buttons button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => purchaseRoll(btn));
  });
}

function getButtonPrice(button) {
  const text = button.textContent.replace(/[^0-9]/g, "");
  return parseInt(text);
}

function purchaseRoll(button) {
  const price = getButtonPrice(button);
  if (owoCash < price) {
    showMessage(`Not enough Owo Cash!`, false);
    return;
  }

  owoCash -= price;
  updateCashDisplay();

  const result = rollCards(price);
  showMessage(`Roll successful!`, true);
  showCardResults(result);

  localStorage.setItem('owoCash', owoCash);
  localStorage.setItem('playerCollection', JSON.stringify(playerCollection));
}

function rollCards(price) {
  const count = 3;
  const result = [];

  let rareChance = 0;
  let rarity = '';

  // Define rarity based on Owo Cash value
  if (price === 1000) {
    rareChance = 0.05;
    rarity = 'Member, OG Member';
  } else if (price === 10000) {
    rareChance = 0.15;
    rarity = 'Mod, Grim';
  } else if (price === 100000) {
    rareChance = 0.5;
    rarity = 'Admin, Mod';
  } else if (price === 1000000) {
    rareChance = 1;
    rarity = 'Co-Owner, The Coder';
  }

  for (let i = 0; i < count; i++) {
    const card = getRandomCard(rareChance, rarity);
    playerCollection.push(card);
    result.push(card);
  }

  return result;
}

function getRandomCard(rareChance, rarity) {
  if (!cardsData.length) {
    return { Name: "Unknown", Image: "unknown.png", Value: 0, Rarity: "Unknown" };
  }

  const index = Math.floor(Math.random() * cardsData.length);
  const card = cardsData[index];
  
  // Add rarity to the card
  card.Rarity = rarity;

  return card;
}

function showMessage(msg, success) {
  const msgDiv = document.getElementById("message");
  msgDiv.textContent = msg;
  msgDiv.style.color = success ? "green" : "red";

  setTimeout(() => {
    msgDiv.textContent = "";
  }, 4000);
}

function showCardResults(cards) {
  const modal = document.getElementById("cardResultModal");
  const container = document.getElementById("cardResultCards");
  container.innerHTML = "";

  cards.forEach(card => {
    const cardDiv = document.createElement("div");
    const img = document.createElement("img");
    img.src = card.Image;
    img.alt = card.Name;

    const rarityText = document.createElement("p");
    rarityText.textContent = `Rarity: ${card.Rarity}`;

    cardDiv.appendChild(img);
    cardDiv.appendChild(rarityText);
    container.appendChild(cardDiv);
  });

  modal.style.display = "flex";
}

document.getElementById("closeCardResult").addEventListener("click", () => {
  document.getElementById("cardResultModal").style.display = "none";
});

/**
 * ============================================================================
 * FRW MÜŞTERİ MEMNUNİYETİ VE REFERANSLAR (musteri.js)
 * Dinamik Yorum Filtreleme ve Canlı Değerlendirme Ekleme
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initTestimonialFilter();
  initFeedbackForm();
});

/**
 * Sektöre Göre Yorum Filtreleme Motoru
 */
function initTestimonialFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const reviewCards = document.querySelectorAll(".review-card");

  if (!filterBtns.length || !reviewCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Aktif buton görünümü
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const selectedSector = btn.getAttribute("data-sector");
      let visibleCount = 0;

      reviewCards.forEach((card) => {
        const cardSector = card.getAttribute("data-sector");
        if (selectedSector === "all" || cardSector === selectedSector) {
          card.style.display = "flex";
          visibleCount++;
        } else {
          card.style.display = "none";
        }
      });

      // DevTools Konsoluna filtreleme logu
      console.log(
        `%c[FRW Müşteri Filtresi]: %c"${selectedSector}" seçildi. Görüntülenen: ${visibleCount} adet yorum.`,
        "color: #0284c7; font-weight: bold;",
        "color: #10b981; font-weight: bold;"
      );
    });
  });
}

/**
 * Canlı Yorum ve Değerlendirme Simülasyon Formu
 */
function initFeedbackForm() {
  const form = document.getElementById("feedback-sim-form");
  const reviewsContainer = document.getElementById("testimonials-grid-container");
  const feedbackMsg = document.getElementById("feedback-success-msg");

  if (!form || !reviewsContainer) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("fb-name");
    const companyInput = document.getElementById("fb-company");
    const sectorInput = document.getElementById("fb-sector");
    const ratingInput = document.getElementById("fb-rating");
    const commentInput = document.getElementById("fb-comment");

    if (!nameInput.value.trim() || !commentInput.value.trim()) {
      alert("Lütfen adınızı ve değerlendirmenizi eksiksiz doldurunuz.");
      return;
    }

    // Yıldızları oluştur
    const starsCount = parseInt(ratingInput.value, 10) || 5;
    const starsStr = "★".repeat(starsCount) + "☆".repeat(5 - starsCount);

    // Yeni yorum kartı elemanı oluştur
    const newCard = document.createElement("article");
    newCard.className = "review-card";
    newCard.setAttribute("data-sector", sectorInput.value);
    newCard.innerHTML = `
      <div>
        <div class="review-stars">${starsStr}</div>
        <p class="review-text">"${escapeHtml(commentInput.value)}"</p>
      </div>
      <div class="review-author">
        <div class="author-avatar">${nameInput.value.trim().charAt(0).toUpperCase()}</div>
        <div class="author-info">
          <h5>${escapeHtml(nameInput.value)}</h5>
          <p>${escapeHtml(companyInput.value || "Bağımsız Kullanıcı")} • ${sectorInput.options[sectorInput.selectedIndex].text}</p>
        </div>
      </div>
    `;

    // Listenin en başına ekle
    reviewsContainer.prepend(newCard);

    // Formu temizle ve başarı mesajı göster
    form.reset();
    if (feedbackMsg) {
      feedbackMsg.style.display = "block";
      setTimeout(() => {
        feedbackMsg.style.display = "none";
      }, 5000);
    }

    // DevTools Konsoluna yeni değerlendirme log kaydı
    console.group("%c⭐ Yeni Müşteri Değerlendirmesi Eklendi", "color: #10b981; font-weight: bold;");
    console.log("Kullanıcı:", nameInput.value);
    console.log("Şirket:", companyInput.value);
    console.log("Puan:", starsCount + " / 5");
    console.log("Yorum:", commentInput.value);
    console.groupEnd();
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[m];
  });
}


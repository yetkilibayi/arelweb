/**
 * ============================================================================
 * FRW İLETİŞİM, DEMO TALEP VE TASARRUF HESAPLAYICI (iletisim.js)
 * Form Doğrulama, Dinamik Tasarruf Simülasyonu, SSS Akordeon
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initContactFormValidation();
  initRoiCalculator();
  initFaqAccordion();
});

/**
 * 1. Form Doğrulama ve Gönderim Simülasyonu
 */
function initContactFormValidation() {
  const form = document.getElementById("demo-contact-form");
  const successAlert = document.getElementById("form-success-alert");

  if (!form) return;

  const fields = {
    fullName: document.getElementById("contact-name"),
    email: document.getElementById("contact-email"),
    phone: document.getElementById("contact-phone"),
    company: document.getElementById("contact-company"),
    module: document.getElementById("contact-module"),
    volume: document.getElementById("contact-volume"),
    message: document.getElementById("contact-message")
  };

  // Blur olayında anlık doğrulama
  if (fields.fullName) {
    fields.fullName.addEventListener("blur", () => validateName(fields.fullName));
  }
  if (fields.email) {
    fields.email.addEventListener("blur", () => validateEmail(fields.email));
  }
  if (fields.phone) {
    fields.phone.addEventListener("blur", () => validatePhone(fields.phone));
  }
  if (fields.company) {
    fields.company.addEventListener("blur", () => validateCompany(fields.company));
  }

  // Gönderim
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const isNameValid = validateName(fields.fullName);
    const isEmailValid = validateEmail(fields.email);
    const isPhoneValid = validatePhone(fields.phone);
    const isCompanyValid = validateCompany(fields.company);

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isCompanyValid) {
      console.warn("%c[FRW Form]: Form doğrulanamadı. Lütfen hatalı alanları düzeltiniz.", "color: #ef4444; font-weight: bold;");
      return;
    }

    const payload = {
      adSoyad: fields.fullName.value.trim(),
      email: fields.email.value.trim(),
      telefon: fields.phone.value.trim(),
      sirket: fields.company.value.trim(),
      secilenModul: fields.module ? fields.module.value : "Tümü",
      aylikHacim: fields.volume ? fields.volume.value : "Belirtilmedi",
      not: fields.message ? fields.message.value.trim() : "",
      talepTarihi: new Date().toISOString()
    };

    // DevTools Konsoluna yapılandırılmış çıktı
    console.group("%c📩 FRW Yeni Canlı Demo & İletişim Talebi Alındı", "background: #0f172a; color: #10b981; font-weight: bold; padding: 4px 8px;");
    console.log("Müşteri Kaydı Başarıyla Doğrulandı:");
    console.table(payload);
    console.info("Simülasyon Durumu: Talep CRM kuyruğuna alındı. Dedike mühendis ataması yapılıyor (SLA: 15 Dk).");
    console.groupEnd();

    // Başarı mesajını göster
    if (successAlert) {
      successAlert.style.display = "block";
      successAlert.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    form.reset();

    // 6 saniye sonra başarı mesajını kaldır
    setTimeout(() => {
      if (successAlert) successAlert.style.display = "none";
    }, 6000);
  });
}

function setFieldError(field, hasError) {
  const group = field.closest(".form-group");
  if (group) {
    if (hasError) {
      group.classList.add("has-error");
    } else {
      group.classList.remove("has-error");
    }
  }
}

function validateName(field) {
  if (!field) return true;
  const isValid = field.value.trim().length >= 3;
  setFieldError(field, !isValid);
  return isValid;
}

function validateEmail(field) {
  if (!field) return true;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = re.test(field.value.trim());
  setFieldError(field, !isValid);
  return isValid;
}

function validatePhone(field) {
  if (!field) return true;
  const cleanPhone = field.value.replace(/\D/g, "");
  const isValid = cleanPhone.length >= 10;
  setFieldError(field, !isValid);
  return isValid;
}

function validateCompany(field) {
  if (!field) return true;
  const isValid = field.value.trim().length >= 2;
  setFieldError(field, !isValid);
  return isValid;
}

/**
 * 2. Dinamik Operasyonel Tasarruf Hesaplayıcı (ROI)
 */
function initRoiCalculator() {
  const slider = document.getElementById("invoice-slider");
  const countLabel = document.getElementById("slider-count-val");
  const timeSavedEl = document.getElementById("calc-time-saved");
  const costSavedEl = document.getElementById("calc-cost-saved");

  if (!slider || !countLabel || !timeSavedEl || !costSavedEl) return;

  function updateCalculations() {
    const count = parseInt(slider.value, 10);
    countLabel.textContent = Number(count).toLocaleString("tr-TR") + " Adet";

    // Manuel fatura işleme süresi: ~5 dakika, FRW Teknoloji ile: ~15 saniye (0.25 dk)
    // Tasarruf edilen süre (dakika) = count * 4.75 dk -> saat = dk / 60
    const hoursSaved = Math.round((count * 4.75) / 60);

    // Ortalama saatlik işgücü + hata önleme maliyeti: ~400 TL/saat
    const financialSavings = Math.round(hoursSaved * 400);

    timeSavedEl.textContent = Number(hoursSaved).toLocaleString("tr-TR") + " Saat / Ay";
    costSavedEl.textContent = "₺" + Number(financialSavings).toLocaleString("tr-TR");
  }

  slider.addEventListener("input", updateCalculations);
  updateCalculations(); // İlk açılışta çalıştır
}

/**
 * 3. SSS (Sıkça Sorulan Sorular) Akordeon Motoru
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (question && answer) {
      question.addEventListener("click", () => {
        const isHidden = answer.style.display === "none";
        
        // Diğerlerini kapat
        faqItems.forEach((other) => {
          const otherAns = other.querySelector(".faq-answer");
          const otherIcon = other.querySelector(".faq-icon");
          if (otherAns) otherAns.style.display = "none";
          if (otherIcon) otherIcon.textContent = "+";
        });

        // Seçileni aç/kapat
        const icon = item.querySelector(".faq-icon");
        if (isHidden) {
          answer.style.display = "block";
          if (icon) icon.textContent = "−";
        } else {
          answer.style.display = "none";
          if (icon) icon.textContent = "+";
        }
      });
    }
  });
}


/**
 * ============================================================================
 * FRW TEKNOLOJİ KURUMSAL PORTAL - ORTAK JAVASCRIPT MOTORU (main.js)
 * Geliştirici & DevTools Desteği, Mobil Menü, Semantik Yapı Kontrolü
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initPageTransitions();
  initMobileNav();
  initActiveNav();
  initDevToolsHelper();
});

/**
 * Sayfalar Arası Tatlı Geçiş & İlerleme Çubuğu (Smooth Page Transitions)
 */
function initPageTransitions() {
  // Tepe İlerleme Çubuğu oluştur
  let progressBar = document.querySelector(".page-progress-bar");
  if (!progressBar) {
    progressBar = document.createElement("div");
    progressBar.className = "page-progress-bar";
    document.body.prepend(progressBar);
  }

  // Sayfa yüklendiğinde tatlı bir şekilde çubuğu tamamla ve gizle
  progressBar.style.opacity = "1";
  progressBar.style.width = "40%";
  requestAnimationFrame(() => {
    progressBar.style.width = "100%";
    setTimeout(() => {
      progressBar.style.opacity = "0";
      setTimeout(() => {
        progressBar.style.width = "0%";
      }, 300);
    }, 200);
  });

  // Sayfalar arası link tıklamalarını yakala
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    const target = link.getAttribute("target");

    // Dış bağlantılar, sayfa içi anchor (#) ve özel protokolleri atla
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      target === "_blank" ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey
    ) {
      return;
    }

    // Sayfa içi dosya geçişlerinde (index.html, hakkimizda.html vb.)
    if (href.endsWith(".html") || href.includes(".html#")) {
      const targetUrl = href.split("#")[0];
      const currentUrl = window.location.pathname.split("/").pop() || "index.html";

      // Aynı sayfadaki bir hash bağlantısıysa geçiş yapma
      if (targetUrl === currentUrl && href.includes("#")) {
        return;
      }

      e.preventDefault();

      // İlerleme çubuğunu canlandır
      progressBar.style.opacity = "1";
      progressBar.style.width = "85%";

      // Sayfadan ayrılma animasyonunu tetikle
      document.body.classList.add("page-leaving");

      // 200ms sonra yumuşakça yeni sayfaya geç
      setTimeout(() => {
        progressBar.style.width = "100%";
        window.location.href = href;
      }, 200);
    }
  });

  // Tarayıcı Geri/İleri butonları (BFCache) ile geri gelindiğinde temizle
  window.addEventListener("pageshow", () => {
    document.body.classList.remove("page-leaving");
    if (progressBar) {
      progressBar.style.width = "0%";
      progressBar.style.opacity = "0";
    }
  });
}

/**
 * Mobil Menü Açma / Kapatma
 */
function initMobileNav() {
  const toggleBtn = document.querySelector(".mobile-toggle");
  const navMenu = document.querySelector(".main-nav");

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Menü dışına tıklandığında menüyü kapat
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove("is-open");
        toggleBtn.setAttribute("aria-expanded", "false");
      }
    });
  }
}

/**
 * Aktif Menü Bağlantısını Otomatik Tespit Etme & Vurgulama
 */
function initActiveNav() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

/**
 * DevTools & Konsol Denetleme Yardımcısı
 * Chrome / Firefox DevTools (F12) Konsolunda inceleme yapmayı kolaylaştırır.
 */
function initDevToolsHelper() {
  const semantics = {
    header: document.querySelectorAll("header").length,
    nav: document.querySelectorAll("nav").length,
    section: document.querySelectorAll("section").length,
    aside: document.querySelectorAll("aside").length,
    footer: document.querySelectorAll("footer").length,
    main: document.querySelectorAll("main").length,
  };

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // DevTools Konsol Başlığı (Dark Still)
  console.group(
    "%c🏢 FRW Teknoloji - Kurumsal Geliştirici & Sistem Konsolu",
    "background: #090e1a; color: #38bdf8; font-size: 13px; font-weight: bold; padding: 6px 12px; border-radius: 4px; border: 1px solid #1e293b;"
  );
  console.log(`%c[Aktif Sayfa]: %c${currentPage}`, "color: #94a3b8; font-weight: bold;", "color: #10b981; font-weight: bold;");
  console.log("%c[Platform]: FRW Teknoloji v3.4 (İş Akışı, Süreç Otomasyonu, Fatura/Finans Entegrasyonu)", "color: #60a5fa;");
  console.log("%c[HTML5 Semantik Denetimi]:", "color: #f59e0b; font-weight: bold;");
  console.table(semantics);
  console.info(
    "%c💡 Geliştirici Komutları: Konsola %cwindow.FRW_DEVTOOLS.inspect()%c veya %cwindow.FRW_DEVTOOLS.toggleOutlines()%c yazabilirsiniz.",
    "color: #94a3b8;",
    "color: #38bdf8; font-weight: bold;",
    "color: #94a3b8;",
    "color: #38bdf8; font-weight: bold;",
    "color: #94a3b8;"
  );
  console.groupEnd();

  // Global Nesne Olarak Tanımlama
  window.FRW_DEVTOOLS = {
    page: currentPage,
    semanticsCount: semantics,
    inspect: function () {
      console.group("🔍 Semantik DOM Analizi");
      ["header", "nav", "main", "section", "aside", "footer"].forEach((tag) => {
        const els = document.querySelectorAll(tag);
        console.log(`<%c${tag}%c> Elemanları (${els.length} adet):`, "color: #3b82f6; font-weight: bold;", "color: inherit;", els);
      });
      console.groupEnd();
      return "Semantik analiz tamamlandı.";
    },
    toggleOutlines: function () {
      let styleTag = document.getElementById("frw-debug-outline-style");
      if (styleTag) {
        styleTag.remove();
        console.log("%c[DevTools]: Görsel semantik çerçeveler kaldırıldı.", "color: #ef4444;");
        return "DevTools Outline: KAPALI";
      } else {
        styleTag = document.createElement("style");
        styleTag.id = "frw-debug-outline-style";
        styleTag.innerHTML = `
          header { outline: 2px dashed #3b82f6 !important; position: relative; }
          nav { outline: 2px dashed #10b981 !important; }
          section { outline: 2px dashed #f59e0b !important; margin-top: 4px; }
          aside { outline: 2px dashed #8b5cf6 !important; }
          footer { outline: 2px dashed #ef4444 !important; }
        `;
        document.head.appendChild(styleTag);
        console.log("%c[DevTools]: Görsel semantik çerçeveler aktif edildi (Mavi=Header, Yeşil=Nav, Turuncu=Section, Mor=Aside, Kırmızı=Footer).", "color: #10b981; font-weight: bold;");
        return "DevTools Outline: AÇIK";
      }
    },
    performanceMetrics: function () {
      if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domReadyTime = perfData.domComplete - perfData.domLoading;
        console.table({
          "Toplam Sayfa Yükleme (ms)": pageLoadTime > 0 ? pageLoadTime : "Hesaplanıyor...",
          "DOM İşleme Süresi (ms)": domReadyTime > 0 ? domReadyTime : "Hesaplanıyor...",
        });
      }
      return "Performans metrikleri listelendi.";
    }
  };
}

/**
 * ============================================================================
 * FRW TEKNOLOJİ - İNTERAKTİF SÜREÇ SİMÜLATÖRÜ (teknoloji.js)
 * Süreç otomasyonu ve fatura entegrasyon adımlarını interaktif canlandırır.
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initTechSimulator();
});

const simulatorStages = {
  step1: {
    title: "1. Adım: E-Belge Girişi & OCR Ön İşleme",
    desc: "GİB portalından veya e-posta servisinden gelen UBL 2.1 e-faturalar ve PDF irsaliyeler FRW kuyruğuna alınır. OCR motoru fatura numarasını, VKN ve satır kalemlerini 12 ms içinde ayrıştırır.",
    stats: "Ortalama İşlem Süresi: 14 ms | Doğruluk Oranı: %99.9",
    json: {
      event: "INVOICE_RECEIVED",
      invoiceNumber: "FRW202600004819",
      supplierVKN: "3849102847",
      totalAmount: "148,250.00 TRY",
      currency: "TRY",
      format: "UBL 2.1 XML",
      status: "PARSED_SUCCESSFULLY"
    }
  },
  step2: {
    title: "2. Adım: 3 Yollu Akıllı Mutabakat",
    desc: "FRW kural motoru; gelen faturadaki kalemleri sistemdeki Satın Alma Siparişi (PO) ve Depo Kabul İrsaliyesi ile eşleştirir. Miktar veya birim fiyat farkı %0.01 toleransı aşarsa otomatik uyarı bayrağı kaldırılır.",
    stats: "Eşleşme Durumu: %100 Uyumlu | Tolerans: 0.00 TRY",
    json: {
      event: "THREE_WAY_MATCHING",
      purchaseOrder: "PO-88412",
      dispatchNote: "IRS-99120",
      toleranceCheck: "PASSED",
      priceVariance: "0.00%",
      matchedItemsCount: 8,
      status: "READY_FOR_APPROVAL"
    }
  },
  step3: {
    title: "3. Adım: Dinamik Onay Zinciri & Delegasyon",
    desc: "Fatura tutarı şirket içi yetki matrisine göre ilgili departman müdürünün ve CFO'nun mobil onayına iletilir. İzinli olan yöneticiler için otomatik vekil atama mekanizması devreye girer.",
    stats: "Onaylayan: Finans Direktörü | Onay Süresi: 2 dakika",
    json: {
      event: "APPROVAL_CHAIN",
      requiredLevel: "TIER_3_EXECUTIVE",
      assignedApprover: "cfo@sirketiniz.com",
      backupApprover: "deputy_cfo@sirketiniz.com",
      approvalTimestamp: "2026-10-15T09:30:00Z",
      decision: "APPROVED_ELECTRONIC_SIGNATURE"
    }
  },
  step4: {
    title: "4. Adım: ERP Aktarımı & Açık Bankacılık",
    desc: "Onaylanan belge otomatik olarak SAP veya Logo ERP sisteminde yevmiye kaydına dönüştürülür. Vade gününde ödenmek üzere açık bankacılık API'si üzerinden otomatik havale/EFT talimatı hazırlanır.",
    stats: "ERP Senkronizasyonu: Başarılı | Banka Talimatı: Kuyrukta",
    json: {
      event: "ERP_POSTING_AND_PAYMENT",
      targetERP: "SAP S/4HANA & Logo Tiger",
      voucherNumber: "YEV-2026-88194",
      paymentScheduleDate: "2026-11-01",
      bankAPI: "OpenBanking_InstantTransfer",
      status: "COMPLETED"
    }
  }
};

function initTechSimulator() {
  const stepBtns = document.querySelectorAll(".sim-step-btn");
  const titleEl = document.getElementById("sim-stage-title");
  const descEl = document.getElementById("sim-stage-desc");
  const statsEl = document.getElementById("sim-stage-stats");
  const codeEl = document.getElementById("sim-stage-code");

  if (!stepBtns.length || !titleEl) return;

  stepBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const stepKey = btn.getAttribute("data-step");
      const data = simulatorStages[stepKey];

      if (!data) return;

      // Buton aktiflik sınıfı
      stepBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // İçerikleri güncelle
      titleEl.textContent = data.title;
      descEl.textContent = data.desc;
      statsEl.textContent = data.stats;
      codeEl.textContent = JSON.stringify(data.json, null, 2);

      // DevTools Konsoluna ayrıntılı bilgi gönderme
      console.group(`%c⚙️ FRW Teknoloji Simülasyonu: ${data.title}`, "color: #0284c7; font-weight: bold;");
      console.log("İşlem Ayrıntısı:", data.desc);
      console.log("Sistem İstatistiği:", data.stats);
      console.table(data.json);
      console.groupEnd();
    });
  });

  console.info("%c[FRW Teknoloji]: Süreç simülatörü hazır. DevTools konsolundan adımları anlık izleyebilirsiniz.", "color: #10b981;");
}


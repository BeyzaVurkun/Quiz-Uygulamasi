const questions = [
  { question: "Dünyanın en yüksek dağı hangisidir", options: ["Everest Dağı", "K2", "Annapurna"], answer: "Everest Dağı" },
  { question: "Türkiye'nin başkenti hangisidir", options: ["Kastamonu", "Rize", "Ankara"], answer: "Ankara" },
  { question: "Mona Lisa tablosu kime aittir", options: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh"], answer: "Leonardo da Vinci" },
  { question: "Aya ayak basan ilk insanın ayak basma tarihi nedir", options: ["1954", "1969", "1983"], answer: "1969" },
  { question: "Hangi ünlü bilim adamı yerçekimini keşfetmiştir", options: ["Albert Einstein", "Galileo Galilei", "Isaac Newton"], answer: "Isaac Newton" },
  { question: "Hangi gezegen Güneş sistemindeki en büyük gezegendir", options: ["Jüpiter", "Mars", "Venüs"], answer: "Jüpiter" },
  { question: "İki Şehrin Hikayesi adlı eserin yazarı kimdir", options: ["Leo Tolstoy", "Charles Dickens", "Jane Austen"], answer: "Charles Dickens" },
  { question: "Hangi gezegenin uydusu Europada su bulunduğu düşünülmektedir", options: ["Mars", "Satürn", "Jüpiter"], answer: "Jüpiter" },
  { question: "Hangi ülkenin bayrağında ay ve yıldız bulunmaktadır", options: ["Türkiye", "Almanya", "İsviçre"], answer: "Türkiye" },
  { question: "La Guernica tablosunun ressamı kimdir", options: ["Salvador Dali", "Vincent Van Gogh", "Pablo Picasso"], answer: "Pablo Picasso" }
];
// HTML elementlerini seçiyoruz
const timeElement = document.querySelector(".time"); // Geri sayım sayacını göstermek için
const countElement = document.querySelector(".count"); // "Soru X / Y" göstergesi
const timerElement = document.querySelector(".timer"); // Zaman çubuğu için
const againBtn = document.querySelector(".again"); // Quiz tekrar başlatma butonu
const result = document.querySelector(".result"); // Quiz sonucu gösterme alanı
const questionElement = document.querySelector(".question"); // Soru metni
const optionsElement = document.querySelectorAll(".option"); // Tüm seçenekler
const resultCorrect = document.querySelector(".result-correct"); // Doğru cevap sayısı
const resultWrong = document.querySelector(".result-wrong"); // Yanlış cevap sayısı
const resultEmpty = document.querySelector(".result-empty"); // Boş bırakılan cevap sayısı
const nextBtn = document.querySelector(".next-btn"); // Sonraki soruya geçiş butonu
const startMessage = document.createElement("div");
startMessage.textContent = "Dikkat! Boş soruları 2. kez boş bırakırsanız quiz bitecek.\n\nBaşlamak için tıklayın.";
startMessage.style.position = "fixed";
startMessage.style.top = "0";
startMessage.style.left = "0";
startMessage.style.width = "100%";
startMessage.style.height = "100%";
startMessage.style.backgroundColor = "rgba(0,0,0,0.8)";
startMessage.style.color = "white";
startMessage.style.display = "flex";
startMessage.style.justifyContent = "center";
startMessage.style.alignItems = "center";
startMessage.style.textAlign = "center";
startMessage.style.fontSize = "24px";
startMessage.style.cursor = "pointer";
startMessage.style.zIndex = "1000";

result.style.display = "none"; // Quiz başlamadan sonucu gizle

document.body.appendChild(startMessage);

// Quiz durumu değişkenleri
let questionsState = questions.map(q => ({ ...q, status: "empty", emptyCount: 0 })); 
// Her soru için: status → correct/wrong/empty, emptyCount → boş bırakılma sayısı

let correctAnswerTotal = 0; // Doğru cevap sayısı
let wrongAnswerTotal = 0;   // Yanlış cevap sayısı
let emptyAnswerTotal = 0;   // Boş bırakılan cevap sayısı
let canSelectOption = true; // Kullanıcının seçenek seçip seçemeyeceğini kontrol eder
let questionNumber = 0;     // Şu anki soru indexi
let interval, sayac, time = 30; // Zaman çubuğu ve geri sayım için değişkenler
let autoTimeout; // Seçenek seçildikten sonra otomatik geçiş için timeout


// Quiz başlatılıyor
startMessage.addEventListener("click", () => {
  startMessage.remove(); // mesajı kaldır
  start();               // quiz başlat
});

// Seçeneklere tıklama olayı
optionsElement.forEach(el => {
  el.addEventListener("click", () => {
    if (!canSelectOption) return; // Seçim yapamazsa çık

    const selectedOption = el.textContent; // Seçilen şık
    const correctAnswer = questions[questionNumber].answer; // Doğru cevap

    // Tüm seçenekleri kontrol edip arka plan rengini ayarla
    optionsElement.forEach(o => {
      if (o.textContent === selectedOption) {
        o.style.backgroundColor = selectedOption === correctAnswer ? "#739072" : "#AF2655";
      }
    });

    // Doğru veya yanlış cevabı say
    selectedOption === correctAnswer ? correctAnswerTotal++ : wrongAnswerTotal++;
    questionsState[questionNumber].status = selectedOption === correctAnswer ? "correct" : "wrong";

    canSelectOption = false; // Tekrar seçim yapılmasın

    // 1.5 saniye sonra otomatik olarak sonraki soruya geç
    autoTimeout = setTimeout(() => {
      newQuestion();
    }, 1500);
  });
});

// "Next" butonuna tıklama
nextBtn.addEventListener("click", () => {
  clearTimeout(autoTimeout); // Otomatik geçişi iptal et
  clearInterval(sayac);      // Geri sayımı durdur
  clearInterval(interval);    // Zaman çubuğunu durdur

  if (!handleEmpty()) {       // Boş bırakma durumunu kontrol et
    newQuestion();            // Devam et
  }
});

// Tekrar başlatma
againBtn.addEventListener("click", () => {
  window.location.reload(); // Sayfayı yenileyerek baştan başlat
});

// Quiz başlatma fonksiyonu
function start() {
  startTimerLine(); // Zaman çubuğunu başlat
  clearInterval(sayac); // Önceki geri sayımı temizle

  // Quiz container görünürlüğü ve etkileşim
  document.querySelector(".container").style.opacity = 1;
  document.querySelector(".container").style.pointerEvents = "all";
  result.style.display = "none"; // Sonuç ekranı gizle

  time = 30;
  timeElement.textContent = time + " sn."; // Geri sayımı başlat
  timeControl();

  countElement.textContent = `${questionNumber + 1}/${questions.length}`; // Soru numarası
  questionElement.textContent = questions[questionNumber].question; // Soru metni

  const status = questionsState[questionNumber].status; // Soru durumu

  // Seçenekleri ayarla ve önceki cevap durumuna göre renk ver
  optionsElement.forEach((option, i) => {
    option.textContent = questions[questionNumber].options[i];

    if (status === "correct") {
      option.style.backgroundColor = option.textContent === questions[questionNumber].answer ? "#739072" : "transparent";
    } else if (status === "wrong") {
      option.style.backgroundColor = option.textContent === questions[questionNumber].answer ? "transparent" : "#AF2655";
    } else {
      option.style.backgroundColor = "transparent"; // Henüz cevap yok
    }
  });

  canSelectOption = (status === "empty"); // Seçim yapabilir mi?
}

// Yeni soru fonksiyonu
function newQuestion() {
  // Önce normal sıradaki soruya git
  let nextIndex = questionNumber + 1;
  while (nextIndex < questions.length && questionsState[nextIndex].status !== "empty") {
    nextIndex++;
  }

  if (nextIndex < questions.length) {
    questionNumber = nextIndex;
    start();
    return;
  }

  // Boş bırakılmış sorular varsa
  const emptyIndexes = questionsState
    .map((q, i) => q.status === "empty" && q.emptyCount < 2 ? i : -1)
    .filter(i => i !== -1);

  if (emptyIndexes.length === 0) {
    end(); // Tüm boş sorular ikinci kez bırakılmış → quiz bitir
    return;
  }

  // Sıradaki boş soruya geç
  questionNumber = emptyIndexes[0];
  start();
}

// Boş bırakma kontrolü
function handleEmpty() {
  questionsState[questionNumber].emptyCount++; // Boş bırakma sayısını artır

  if (questionsState[questionNumber].emptyCount >= 2) {
    // Bu soruyu ikinci kez boş bıraktık → diğer boşlara geç
    const nextEmpty = questionsState.findIndex(
      (q, i) => q.status === "empty" && q.emptyCount < 2 && i !== questionNumber
    );

    if (nextEmpty !== -1) {
      questionNumber = nextEmpty;
      start();
      return true; // Quiz bitmedi
    } else {
      end(); // Artık gösterilecek boş soru yok → quiz bitti
      return true;
    }
  } else {
    // İlk kez boş bırakıldı → quiz devam
    questionsState[questionNumber].status = "empty";
    return false;
  }
}

// Quiz bitişi
function end() {
  clearInterval(sayac); // Geri sayımı durdur
  clearInterval(interval); // Zaman çubuğunu durdur
  document.querySelector(".container").style.opacity = 0.5; // Container'ı gri yap
  document.querySelector(".container").style.pointerEvents = "none"; // Etkileşimi kapat
  result.style.display = "block"; // Sonuç ekranı göster

  emptyAnswerTotal = questionsState.filter(q => q.status === "empty").length; // Boş sayısını hesapla

  // Sonuçları yazdır
  resultCorrect.textContent = `Doğru: ${correctAnswerTotal}`;
  resultWrong.textContent = `Yanlış: ${wrongAnswerTotal}`;
  resultEmpty.textContent = `Boş: ${emptyAnswerTotal}`;
}

// Zaman çubuğu fonksiyonu
function startTimerLine() {
  timerElement.style.width = "0px"; // Çubuğu sıfırla
  clearInterval(interval);

  const targetWidth = 560; // Çubuğun toplam genişliği
  const totalTime = 30000; // Toplam süre 30 saniye
  let currentTime = totalTime;

  interval = setInterval(() => {
    currentTime -= 10; // Her 10 ms'de bir güncelle
    if (currentTime >= 0) {
      const progress = (totalTime - currentTime) / totalTime;
      timerElement.style.width = `${progress * targetWidth}px`; // Çubuğu doldur
    } else {
      clearInterval(interval);
    }
  }, 10);
}

// Geri sayım fonksiyonu
function timeControl() {
  clearInterval(sayac);
  time = 30;
  timeElement.textContent = time + " sn.";

  sayac = setInterval(() => {
    time--;
    timeElement.textContent = time + " sn.";
    if (time <= 0) {
      clearInterval(sayac);
      if (!handleEmpty()) { // Zaman dolunca boş bırakma kontrolü
        newQuestion();
      }
    }
  }, 1000);
}



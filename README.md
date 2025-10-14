# Quiz Uygulaması

HTML, CSS ve JavaScript ile hazırlanmış interaktif bir quiz uygulamasıdır.  
Kullanıcı soruları cevaplayabilir, sonuçlarını görebilir ve testi tekrar başlatabilir.

## Özellikler

### Başlangıç uyarısı
- Quiz başlamadan önce kullanıcıya bir uyarı mesajı gösterilir:  
  > “Dikkat! Boş soruları 2. kez boş bırakırsanız quiz bitecek. Başlamak için tıklayın.”  
- Kullanıcı mesajı tıklayarak quiz’e başlar.

### Seçeneklerle cevaplama
- Her soru 3 seçenek içerir. Kullanıcı bir seçeneğe tıkladığında:  
  - Doğru seçenek **yeşil renkle** vurgulanır.  
  - Yanlış seçenek **kırmızı renkle** vurgulanır.  
  - **1.5 saniye sonra otomatik olarak bir sonraki soruya geçilir.**

### Boş bırakma imkânı
- Eğer kullanıcı soruyu boş bırakmak isterse,“Sonraki Soru” ile geçiş yapabilir.  
- Her soru maksimum 2 kez boş bırakılabilir.  
- İkinci kez boş bırakılan sorular quiz sonunda sayılır.

### Zaman sayacı ve görsel ilerleme çubuğu
- Her soru için **30 saniye** süre vardır.  
- Süre dolduğunda soru otomatik olarak boş sayılır ve bir sonraki soruya geçilir.  
- Ekranda hem saniye cinsinden geri sayım hem de dolan bir çubuk ile süre görsel olarak takip edilebilir.

### Sonuç ekranı
- Quiz sonunda kullanıcıya sonuç paneli gösterilir:  
  - Doğru cevap sayısı  
  - Yanlış cevap sayısı  
  - Boş bırakılan soru sayısı

### Tekrar başlatma
- Quiz bittiğinde kullanıcı **“Tekrar”** butonuna tıklayarak quiz’i baştan başlatabilir.

## Teknolojiler
- HTML  
- CSS  
- JavaScript

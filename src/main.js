import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  console.log('HARAKAT Landing Page Initialized');

  // Language management
  const langBtns = document.querySelectorAll('.lang-btn');
  const translatableElements = document.querySelectorAll('[data-uz]');

  const setLanguage = (lang) => {
    document.documentElement.lang = lang;

    // Update active button
    langBtns.forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update text content
    translatableElements.forEach(el => {
      const translation = el.getAttribute(`data-${lang}`);
      if (translation) {
        // Handle HTML content (like <br>)
        if (translation.includes('<br>')) {
          el.innerHTML = translation;
        } else {
          el.textContent = translation;
        }
      }
    });

    // Save preference
    localStorage.setItem('harakat_lang', lang);
  };

  // Switcher event listeners
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
    });
  });

  // Load language from storage or default to Uzbek
  let currentLang = localStorage.getItem('harakat_lang');
  if (!currentLang) {
    currentLang = 'uz';
  }
  setLanguage(currentLang);

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  // Lead Magnet Quiz Logic
  const quizSteps = document.querySelectorAll('.quiz-step');
  const quizOptions = document.querySelectorAll('.quiz-opt');
  const quizNextBtns = document.querySelectorAll('.quiz-next');
  const submitLeadBtn = document.getElementById('submit-lead');

  let quizData = {
    rooms: '',
    name: '',
    phone: ''
  };

  const showStep = (stepId) => {
    quizSteps.forEach(step => {
      step.classList.remove('active');
      if (step.id === stepId) step.classList.add('active');
    });
  };

  // Step 1: Rooms selection
  quizOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      quizData.rooms = opt.dataset.val;
      showStep('quiz-step-2');
    });
  });

  // Step 2: Name input
  quizNextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const nameInput = document.getElementById('lead-name');
      if (nameInput.value.trim().length > 1) {
        quizData.name = nameInput.value.trim();
        showStep('quiz-step-3');
      } else {
        nameInput.style.borderColor = 'red';
      }
    });
  });

  // Step 3: Phone & Submit
  if (submitLeadBtn) {
    submitLeadBtn.addEventListener('click', async () => {
      const phoneInput = document.getElementById('lead-phone');
      const phoneVal = phoneInput.value.replace(/\D/g, ''); // Get only digits

      // Uzbek phone validation: exactly 9 digits after +998
      if (phoneVal.length === 9) {
        quizData.phone = `+998${phoneVal}`;

        // Telegram Sending Logic (using environment variables)
        const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
        const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

        const message = `🚀 YANGI LEAD (HARAKAT)\n\n🏢 Xonalar: ${quizData.rooms}\n👤 Ism: ${quizData.name}\n📞 Tel: ${quizData.phone}`;

        try {
          if (!CHAT_ID || CHAT_ID === 'YOUR_CHAT_ID') {
            console.warn('Telegram CHAT_ID not configured. Lead:', quizData);
            alert('Rahmat! Ma\'lumotlaringiz qabul qilindi.');
            showStep('quiz-success');
            return;
          }

          const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text: message
            })
          });

          if (response.ok) {
            showStep('quiz-success');
          } else {
            throw new Error('Telegram API error');
          }
        } catch (err) {
          console.error('Lead submission failed:', err);
          alert('Error sending lead. Please try again or call us directly.');
        }
      } else {
        phoneInput.style.borderColor = 'red';
      }
    });
  }

  // Phone input formatting (XX XXX XX XX)
  const phoneInputField = document.getElementById('lead-phone');
  if (phoneInputField) {
    phoneInputField.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 9) val = val.substring(0, 9);

      let formatted = '';
      if (val.length > 0) formatted += val.substring(0, 2);
      if (val.length > 2) formatted += ' ' + val.substring(2, 5);
      if (val.length > 5) formatted += ' ' + val.substring(5, 7);
      if (val.length > 7) formatted += ' ' + val.substring(7, 9);

      e.target.value = formatted;
    });
  }
});


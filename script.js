"use strict";

/* ======================================================================
   اقرأ من أول وجديد — Frontend Prototype (Vanilla HTML/CSS/JS)
   لا يوجد Backend / Database / API / OCR حقيقي / AI حقيقي.
   كل البيانات والمنطق هنا Mock / Simulation فقط، موضّح بوضوح أينما ظهر.
   الصوت وحده حقيقي: يستخدم Web Speech API المدمجة في المتصفح
   (speechSynthesis) — بدون أي خادوم أو اتصال إنترنت.
   ====================================================================== */

/* ----------------------------- Mock data -----------------------------
   مكتبة كتب تجريبية (MOCK). كل كتاب فيه عدة جمل، وكل جملة لها:
   - text:     نص الجملة
   - wod:      كلمة اليوم (الكلمة + إيموجي + المعنى)
   - mistake:  الكلمة اللي بيحاكي "Simulate Mistake" إنها اتنطقت غلط
               + تقسيمها التدريبي
   - accuracy: نسبة النطق الوهمية (Mock) لنتيجة النجاح
   لإضافة جمل أو كتب جديدة: أضف عنصرًا جديدًا في المصفوفة فقط.
------------------------------------------------------------------------- */

const LIBRARY = [
  {
    title: "الأرنب الصغير",
    emoji: "🐇",
    sentences: [
      {
        text: "كان هناك أرنب صغير يعيش في حديقة جميلة.",
        wod: { word: "أرنب", emoji: "🐇", meaning: "حيوان صغير يحب الجزر." },
        mistake: { word: "صغير", parts: ["صـ", "ـغـ", "ـيـ", "ـر"] },
        accuracy: 90,
      },
      {
        text: "يحب الأرنب أكل الجزر الطازج.",
        wod: { word: "جزر", emoji: "🥕", meaning: "خضار برتقالي مفيد للعين." },
        mistake: { word: "الجزر", parts: ["الـ", "ـجـ", "ـزر"] },
        accuracy: 92,
      },
      {
        text: "قفز الأرنب فوق العشب الأخضر.",
        wod: { word: "عشب", emoji: "🌿", meaning: "نبات أخضر ينمو في الحديقة." },
        mistake: { word: "العشب", parts: ["الـ", "ـعـ", "ـشـ", "ـب"] },
        accuracy: 88,
      },
      {
        text: "التقى الأرنب بصديقه السلحفاة.",
        wod: { word: "سلحفاة", emoji: "🐢", meaning: "حيوان بطيء له بيت على ظهره." },
        mistake: { word: "السلحفاة", parts: ["الـ", "ـسـ", "ـلـ", "ـحـ", "ـفـ", "ـاة"] },
        accuracy: 94,
      },
      {
        text: "لعبا معا حتى غابت الشمس.",
        wod: { word: "شمس", emoji: "☀️", meaning: "نجمة تعطينا الضوء والدفء." },
        mistake: { word: "الشمس", parts: ["الـ", "ـشـ", "ـمـ", "ـس"] },
        accuracy: 91,
      },
    ],
  },
  {
    title: "رحلة إلى البحر",
    emoji: "🌊",
    sentences: [
      {
        text: "ذهبت سلمى مع أسرتها إلى البحر.",
        wod: { word: "بحر", emoji: "🌊", meaning: "ماء كبير مالح فيه أمواج." },
        mistake: { word: "سلمى", parts: ["سـ", "ـلـ", "ـمى"] },
        accuracy: 90,
      },
      {
        text: "بنت قلعة كبيرة من الرمل.",
        wod: { word: "رمل", emoji: "🏖️", meaning: "حبات صغيرة ناعمة على الشاطئ." },
        mistake: { word: "قلعة", parts: ["قـ", "ـلـ", "ـعـ", "ـة"] },
        accuracy: 93,
      },
      {
        text: "رأت سمكة ملونة تسبح بين الأمواج.",
        wod: { word: "سمكة", emoji: "🐟", meaning: "حيوان يعيش ويسبح في الماء." },
        mistake: { word: "ملونة", parts: ["مـ", "ـلـ", "ـو", "نـ", "ـة"] },
        accuracy: 89,
      },
      {
        text: "جمعت صدفا جميلة في سلة صغيرة.",
        wod: { word: "صدفة", emoji: "🐚", meaning: "بيت صغير تتركه حيوانات البحر." },
        mistake: { word: "جميلة", parts: ["جـ", "ـمـ", "ـيـ", "ـلـ", "ـة"] },
        accuracy: 95,
      },
      {
        text: "عادت سلمى إلى البيت سعيدة.",
        wod: { word: "سعيدة", emoji: "😊", meaning: "شعور جميل بالفرح." },
        mistake: { word: "سعيدة", parts: ["سـ", "ـعـ", "ـيـ", "ـدة"] },
        accuracy: 92,
      },
    ],
  },
  {
    title: "ليلة النجوم",
    emoji: "⭐",
    sentences: [
      {
        text: "خرج يوسف إلى الشرفة ليلا.",
        wod: { word: "ليل", emoji: "🌙", meaning: "الوقت الذي ينام فيه الناس." },
        mistake: { word: "الشرفة", parts: ["الـ", "ـشـ", "ـر", "فة"] },
        accuracy: 90,
      },
      {
        text: "رفع رأسه ونظر إلى السماء.",
        wod: { word: "سماء", emoji: "☁️", meaning: "ما نراه فوقنا من غيوم وشمس وقمر." },
        mistake: { word: "السماء", parts: ["الـ", "ـسـ", "ـمـ", "ـاء"] },
        accuracy: 91,
      },
      {
        text: "شاهد نجوما كثيرة تلمع.",
        wod: { word: "نجمة", emoji: "⭐", meaning: "نقطة مضيئة تلمع في السماء ليلا." },
        mistake: { word: "نجوما", parts: ["نـ", "ـجـ", "ـو", "ما"] },
        accuracy: 94,
      },
      {
        text: "وكان القمر كبيرا ومضيئا.",
        wod: { word: "قمر", emoji: "🌕", meaning: "يضيء السماء في الليل." },
        mistake: { word: "مضيئا", parts: ["مـ", "ـضـ", "ـيـ", "ـئا"] },
        accuracy: 89,
      },
      {
        text: "تمنى يوسف أن يصبح رائد فضاء.",
        wod: { word: "فضاء", emoji: "🚀", meaning: "مكان واسع فيه النجوم والكواكب." },
        mistake: { word: "رائد", parts: ["را", "ئـ", "ـد"] },
        accuracy: 93,
      },
    ],
  },
];

/* ------------------------------- State -------------------------------- */

const state = {
  book: LIBRARY[0],
  sentenceIndex: 0,
  completed: new Set(), // sentence indexes read successfully (Mock result)
  stats: { correct: 0, total: 0 }, // accumulated word results in this book
};
let uploadCounter = 0; // each simulated upload brings the next book

function currentSentence() {
  return state.book.sentences[state.sentenceIndex];
}
function wordsOf(sentence) {
  return sentence.text.replace(/\.$/, "").split(" ");
}
function toAr(n) {
  return String(n).replace(/\d/g, function (d) {
    return "٠١٢٣٤٥٦٧٨٩"[d];
  });
}

/* --------------------------- Speech utility ---------------------------
   Real, in-browser text-to-speech. No server, no API key, no network call.
   Two known browser quirks are worked around:
   1) Calling speak() in the same tick as cancel() can be silently dropped
      by Chrome — we push the real speak() to the next tick.
   2) Nothing keeping a reference to the utterance can let some browsers
      garbage-collect it mid-speech — we keep a module-level reference.
------------------------------------------------------------------------- */

let currentUtterance = null;

function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickArabicVoice() {
  if (!isSpeechSupported()) return undefined;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find(function (v) { return v.lang && v.lang.toLowerCase().startsWith("ar"); }) ||
    voices.find(function (v) { return v.default; }) ||
    voices[0]
  );
}

/**
 * Speak text aloud. options: { rate, pitch, onBoundary(charIndex), onEnd(), onError() }
 * Returns a stop() function.
 */
function speak(text, options) {
  options = options || {};
  if (!isSpeechSupported()) {
    console.warn("[speech] المتصفح لا يدعم speechSynthesis.");
    if (options.onError) options.onError();
    return function () {};
  }

  window.speechSynthesis.cancel();

  window.setTimeout(function () {
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance; // prevent garbage collection mid-speech

    const voice = pickArabicVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = (voice && voice.lang) || "ar-SA";
    utterance.rate = options.rate != null ? options.rate : 0.95;
    utterance.pitch = options.pitch != null ? options.pitch : 1.05;
    utterance.volume = 1;

    if (options.onBoundary) {
      utterance.onboundary = function (e) {
        options.onBoundary(e.charIndex || 0);
      };
    }
    utterance.onend = function () {
      if (currentUtterance === utterance) currentUtterance = null;
      if (options.onEnd) options.onEnd();
    };
    utterance.onerror = function (e) {
      if (currentUtterance === utterance) currentUtterance = null;
      // "canceled"/"interrupted" just means we stopped it ourselves.
      if (e && (e.error === "canceled" || e.error === "interrupted")) return;
      console.error("[speech] فشل تشغيل الصوت:", e);
      if (options.onError) options.onError();
    };

    window.speechSynthesis.speak(utterance);
  }, 30);

  return function () {
    window.speechSynthesis.cancel();
  };
}

function stopSpeaking() {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}
function pauseSpeaking() {
  if (isSpeechSupported() && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
}
function resumeSpeaking() {
  if (isSpeechSupported() && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}
function warmUpVoices() {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = function () {
    window.speechSynthesis.getVoices();
  };
}

warmUpVoices();

/* ----------------------------- Navigation ----------------------------- */

function showScreen(id) {
  const current = document.querySelector(".screen.is-active");
  if (current && current.id === "screen-reading" && id !== "screen-reading") {
    // Leaving the reading screen: stop any speech/highlight in progress.
    stopReadingPlayback();
  }
  document.querySelectorAll(".screen").forEach(function (el) {
    el.classList.toggle("is-active", el.id === id);
  });
}

document.querySelectorAll("[data-back]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    showScreen(btn.getAttribute("data-back"));
  });
});

/* ------------------------------- Splash -------------------------------- */

document.getElementById("btn-start").addEventListener("click", function () {
  showScreen("screen-upload");
});

const btnTestSound = document.getElementById("btn-test-sound");
btnTestSound.addEventListener("click", function () {
  if (!isSpeechSupported()) {
    btnTestSound.textContent = "⚠️ الصوت غير مدعوم في هذا المتصفح";
    return;
  }
  btnTestSound.textContent = "جارٍ تشغيل الصوت...";
  speak("مرحبًا، الصوت يعمل بنجاح", {
    onEnd: function () {
      btnTestSound.textContent = "✓ الصوت يعمل";
    },
    onError: function () {
      btnTestSound.textContent = "⚠️ الصوت غير مدعوم في هذا المتصفح";
    },
  });
});

/* ---------------------------- Upload Book ------------------------------ */

const uploadIdle = document.getElementById("upload-idle");
const uploadAnalyzing = document.getElementById("upload-analyzing");
const uploadDone = document.getElementById("upload-done");

// MOCK: every simulated upload "extracts" the next book from the library.
function simulateUpload() {
  uploadIdle.classList.add("hidden");
  uploadDone.classList.add("hidden");
  uploadAnalyzing.classList.remove("hidden");
  window.setTimeout(function () {
    const book = LIBRARY[uploadCounter % LIBRARY.length];
    uploadCounter += 1;
    loadBook(book);

    document.getElementById("upload-book-info").textContent =
      "الكتاب: «" + book.title + "» — " + toAr(book.sentences.length) + " جمل";
    document.getElementById("upload-preview").textContent = book.sentences[0].text;

    uploadAnalyzing.classList.add("hidden");
    uploadDone.classList.remove("hidden");
  }, 1600);
}

function resetUploadScreen() {
  uploadAnalyzing.classList.add("hidden");
  uploadDone.classList.add("hidden");
  uploadIdle.classList.remove("hidden");
}

document.getElementById("btn-upload-area").addEventListener("click", simulateUpload);
document.getElementById("btn-camera").addEventListener("click", simulateUpload);
document.getElementById("btn-upload-another").addEventListener("click", resetUploadScreen);

document.getElementById("btn-start-reading").addEventListener("click", function () {
  showScreen("screen-reading");
});

/* ------------------------------ Reading -------------------------------- */

const storyWordsEl = document.getElementById("story-words");
const storyBoxEl = document.getElementById("story-box");
const btnListen = document.getElementById("btn-listen");
const btnPause = document.getElementById("btn-pause");
const btnRepeat = document.getElementById("btn-repeat");
const btnEasy = document.getElementById("btn-easy");
const toggleEasy = document.getElementById("toggle-easy");
const noSpeechWarning = document.getElementById("no-speech-warning");
const btnPrev = document.getElementById("btn-prev-sentence");
const btnNext = document.getElementById("btn-next-sentence");
const dotsEl = document.getElementById("sentence-dots");

if (!isSpeechSupported()) noSpeechWarning.classList.remove("hidden");

let wordSpans = [];
let speechText = "";
let wordStartOffsets = [];

let activeIndex = -1;
let readingPlayState = "idle"; // idle | playing | paused
let boundaryFired = false;
let fallbackTimer = null;

// Easy-reading mode groups the sentence into short chunks (2 words per line).
function chunkWords(words) {
  const chunks = [];
  for (let i = 0; i < words.length; i += 2) chunks.push(words.slice(i, i + 2));
  if (chunks.length > 1 && chunks[chunks.length - 1].length === 1) {
    const last = chunks.pop();
    chunks[chunks.length - 1].push(last[0]);
  }
  return chunks;
}

function renderReading() {
  const sentence = currentSentence();
  const words = wordsOf(sentence);
  const total = state.book.sentences.length;

  // Words (grouped in chunks so easy mode can stack them on short lines)
  storyWordsEl.innerHTML = "";
  wordSpans = [];
  chunkWords(words).forEach(function (chunk) {
    const chunkEl = document.createElement("div");
    chunkEl.className = "chunk";
    chunk.forEach(function (word) {
      const span = document.createElement("span");
      span.className = "word";
      span.textContent = word;
      chunkEl.appendChild(span);
      wordSpans.push(span);
    });
    storyWordsEl.appendChild(chunkEl);
  });

  // Exact text spoken, so character offsets line up with the words.
  speechText = words.join(" ") + ".";
  let pos = 0;
  wordStartOffsets = words.map(function (w) {
    const start = pos;
    pos += w.length + 1;
    return start;
  });

  // Header, counter, dots
  const chip = state.book.emoji + " " + state.book.title;
  const counter = "جملة " + toAr(state.sentenceIndex + 1) + " من " + toAr(total);
  document.getElementById("reading-book-chip").textContent = chip;
  document.getElementById("reading-counter").textContent = counter;

  dotsEl.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("span");
    dot.className =
      "dot" +
      (i === state.sentenceIndex ? " current" : "") +
      (state.completed.has(i) ? " done" : "");
    dotsEl.appendChild(dot);
  }

  btnPrev.disabled = state.sentenceIndex === 0;
  btnNext.disabled = state.sentenceIndex === total - 1;

  // Word of the day (changes with the sentence)
  document.getElementById("wod-emoji").textContent = sentence.wod.emoji;
  document.getElementById("wod-word").textContent = sentence.wod.word;
  document.getElementById("wod-meaning").textContent = sentence.wod.meaning;
}

function charIndexToWordIndex(charIndex) {
  let found = 0;
  for (let i = 0; i < wordStartOffsets.length; i++) {
    if (wordStartOffsets[i] <= charIndex) found = i;
  }
  return found;
}

function setActiveIndex(i) {
  activeIndex = i;
  wordSpans.forEach(function (span, idx) {
    span.classList.toggle("active", idx === i);
  });
}

function clearFallbackTimer() {
  if (fallbackTimer) {
    window.clearInterval(fallbackTimer);
    fallbackTimer = null;
  }
}

// Not every browser/voice reports word-boundary events. If none arrive,
// fall back to an approximate timed highlight.
function startFallbackHighlight(fromIndex) {
  let i = fromIndex || 0;
  setActiveIndex(i);
  fallbackTimer = window.setInterval(function () {
    i += 1;
    if (i >= wordSpans.length) {
      clearFallbackTimer();
      return;
    }
    setActiveIndex(i);
  }, 550);
}

function setReadingPlayState(state_) {
  readingPlayState = state_;
  btnListen.classList.toggle("active", state_ === "playing");
}

function playFromStart() {
  boundaryFired = false;
  clearFallbackTimer();
  setActiveIndex(-1);

  speak(speechText, {
    onBoundary: function (charIndex) {
      boundaryFired = true;
      clearFallbackTimer();
      setActiveIndex(charIndexToWordIndex(charIndex));
    },
    onEnd: function () {
      clearFallbackTimer();
      setReadingPlayState("idle");
    },
    onError: function () {
      clearFallbackTimer();
      setReadingPlayState("idle");
    },
  });

  window.setTimeout(function () {
    if (!boundaryFired && readingPlayState === "playing") startFallbackHighlight(0);
  }, 700);

  setReadingPlayState("playing");
}

function handleListen() {
  if (readingPlayState === "paused") {
    resumeSpeaking();
    if (!boundaryFired) startFallbackHighlight(activeIndex + 1);
    setReadingPlayState("playing");
    return;
  }
  playFromStart();
}

function handlePause() {
  if (readingPlayState === "playing") {
    pauseSpeaking();
    clearFallbackTimer();
    setReadingPlayState("paused");
  }
}

function handleRepeat() {
  setActiveIndex(-1);
  playFromStart();
}

function stopReadingPlayback() {
  stopSpeaking();
  clearFallbackTimer();
  setReadingPlayState("idle");
  setActiveIndex(-1);
}

btnListen.addEventListener("click", handleListen);
btnPause.addEventListener("click", handlePause);
btnRepeat.addEventListener("click", handleRepeat);

let easyModeOn = false;
function setEasyMode(on) {
  easyModeOn = on;
  storyBoxEl.classList.toggle("easy", on);
  btnEasy.classList.toggle("active", on);
  toggleEasy.setAttribute("aria-checked", String(on));
}
btnEasy.addEventListener("click", function () {
  setEasyMode(!easyModeOn);
});
toggleEasy.addEventListener("click", function () {
  setEasyMode(!easyModeOn);
});

document.getElementById("btn-word-of-day").addEventListener("click", function () {
  speak(currentSentence().wod.word);
});

btnPrev.addEventListener("click", function () {
  goToSentence(state.sentenceIndex - 1);
});
btnNext.addEventListener("click", function () {
  goToSentence(state.sentenceIndex + 1);
});

document.getElementById("btn-go-practice").addEventListener("click", function () {
  resetVoice();
  showScreen("screen-voice");
});

/* --------------------- Book / sentence switching ----------------------- */

function goToSentence(index) {
  const total = state.book.sentences.length;
  if (index < 0 || index >= total) return;
  stopReadingPlayback();
  state.sentenceIndex = index;
  renderReading();
  resetVoice();
}

function loadBook(book) {
  stopReadingPlayback();
  state.book = book;
  state.sentenceIndex = 0;
  state.completed = new Set();
  state.stats = { correct: 0, total: 0 };
  renderReading();
  resetVoice();
}

/* --------------------------- Voice Practice ----------------------------- */

const micArea = document.getElementById("mic-area");
const practiceHint = document.getElementById("practice-hint");
const wordResultsEl = document.getElementById("word-results");
const mistakeCard = document.getElementById("mistake-card");
const actionRow = document.getElementById("action-row");
const correctPronLabel = document.getElementById("correct-pron-label");

let voicePhase = "idle"; // idle | recording | analyzing | result
let voiceResultType = "success"; // success | mistake
let pronunciationPlayed = false;
let voiceTimers = [];

function clearVoiceTimers() {
  voiceTimers.forEach(function (t) {
    window.clearTimeout(t);
  });
  voiceTimers = [];
}

function isLastSentence() {
  return state.sentenceIndex === state.book.sentences.length - 1;
}
function bookFinished() {
  return state.completed.size === state.book.sentences.length;
}

function renderVoiceHeader() {
  const sentence = currentSentence();
  const total = state.book.sentences.length;
  document.getElementById("practice-sentence").textContent = sentence.text;
  document.getElementById("voice-book-chip").textContent = state.book.emoji + " " + state.book.title;
  document.getElementById("voice-counter").textContent =
    "جملة " + toAr(state.sentenceIndex + 1) + " من " + toAr(total);

  document.getElementById("mistake-word").textContent = sentence.mistake.word;
  document.getElementById("mistake-breakdown").innerHTML = sentence.mistake.parts
    .map(function (p) {
      return '<span class="chunk-pill">' + p + "</span>";
    })
    .join("");
}

function renderProgress() {
  const total = state.book.sentences.length;
  const percent = Math.round((state.completed.size / total) * 100);
  document.getElementById("progress-percent").textContent = percent + "%";
  document.getElementById("progress-fill").style.width = percent + "%";
  document.getElementById("progress-words").textContent =
    "الكلمات الصحيحة: " + toAr(state.stats.correct) + " / " + toAr(state.stats.total);
}

function renderMicArea(countdown) {
  if (voicePhase === "idle") {
    micArea.innerHTML = '<button class="mic-btn" id="btn-mic" aria-label="ابدأ التسجيل">🎤</button>';
  } else if (voicePhase === "recording") {
    micArea.innerHTML =
      '<button class="mic-btn recording" disabled>🎤</button>' +
      '<p class="recording-label">🔴 Recording...</p>' +
      '<p class="countdown-num">' + String(countdown).padStart(2, "0") + "</p>";
  } else if (voicePhase === "analyzing") {
    micArea.innerHTML =
      '<div class="center-col" style="padding:0">' +
      '<div class="spinner"></div>' +
      '<p class="bold-text">جاري تحليل القراءة...</p>' +
      '<div class="muted-text" style="text-align:center;line-height:1.6">' +
      "<span>AI Reading Analysis</span><br/><span>Analyzing pronunciation...</span></div>" +
      '<span class="mock-tag">محاكاة تجريبية · Demo</span>' +
      "</div>";
  } else if (voicePhase === "result") {
    if (voiceResultType === "success") {
      const finished = bookFinished();
      micArea.innerHTML =
        '<div class="center-col" style="padding:0">' +
        '<p style="font-size:1.75rem;margin:0">⭐ ممتاز!</p>' +
        '<p class="bold-text" style="font-size:1.125rem">نطقك صحيح بنسبة ' +
        currentSentence().accuracy +
        "%</p>" +
        '<p class="muted-text">' +
        (finished ? "🎉 خلّصت الكتاب كله، أنت بطل!" : "استمر، أنت بتتحسن! 👏") +
        "</p></div>";
    } else {
      micArea.innerHTML =
        '<div class="center-col" style="padding:0">' +
        '<p style="font-size:1.5rem;margin:0">🤔 قريب جدًا!</p>' +
        '<p class="muted-text">راجع الكلمة الملونة تحت وحاول تاني.</p>' +
        "</div>";
    }
  }
}

function renderWordResults() {
  if (voicePhase !== "result") {
    wordResultsEl.classList.add("hidden");
    wordResultsEl.innerHTML = "";
    return;
  }
  const mistakeWord = currentSentence().mistake.word;
  wordResultsEl.classList.remove("hidden");
  wordResultsEl.innerHTML = wordsOf(currentSentence())
    .map(function (word) {
      const correct = voiceResultType === "mistake" ? word !== mistakeWord : true;
      const cls = correct ? "correct" : "wrong";
      const mark = correct ? "✓" : "❌";
      return '<span class="word-pill ' + cls + '">' + word + " " + mark + "</span>";
    })
    .join("");
}

function renderMistakeCard() {
  const show = voicePhase === "result" && voiceResultType === "mistake";
  mistakeCard.classList.toggle("hidden", !show);
  correctPronLabel.textContent = pronunciationPlayed ? "تم النطق ✓" : "اسمع النطق الصحيح";
}

function renderActionRow() {
  let html = "";
  const busy = voicePhase === "recording" || voicePhase === "analyzing";
  const successResult = voicePhase === "result" && voiceResultType === "success";

  if (successResult) {
    html +=
      '<button class="btn btn--lg btn--full" id="btn-next-practice">' +
      (isLastSentence() ? "🔄 اقرأ الكتاب من جديد" : "الجملة التالية ←") +
      "</button>";
  }
  if (voicePhase === "result") {
    html += '<button class="btn btn--secondary btn--full" id="btn-try-again">🔁 حاول مرة أخرى</button>';
  }
  if (!busy && voiceResultType !== "mistake") {
    html += '<button class="btn btn--outline-danger btn--full" id="btn-simulate-mistake">Simulate Mistake</button>';
  }
  actionRow.innerHTML = html;
}

function renderVoiceScreen(countdown) {
  renderVoiceHeader();
  renderMicArea(countdown == null ? 0 : countdown);
  renderWordResults();
  renderMistakeCard();
  renderActionRow();
  renderProgress();
  practiceHint.classList.toggle("hidden", voicePhase === "result");
}

// MOCK scoring: counts the words as if a real recognizer had returned them.
function recordResult(isSuccess) {
  const words = wordsOf(currentSentence()).length;
  state.stats.total += words;
  state.stats.correct += isSuccess ? words : words - 1;
  if (isSuccess) state.completed.add(state.sentenceIndex);
}

function resetVoice() {
  clearVoiceTimers();
  pronunciationPlayed = false;
  voiceResultType = "success";
  voicePhase = "idle";
  renderVoiceScreen();
}

function runRecordingFlow() {
  clearVoiceTimers();
  voicePhase = "recording";
  renderVoiceScreen(3);

  [1, 2, 3].forEach(function (step) {
    const id = window.setTimeout(function () {
      renderVoiceScreen(3 - step);
    }, step * 700);
    voiceTimers.push(id);
  });

  const toAnalyzing = window.setTimeout(function () {
    voicePhase = "analyzing";
    renderVoiceScreen();
  }, 2300);

  const toResult = window.setTimeout(function () {
    voiceResultType = "success";
    voicePhase = "result";
    recordResult(true);
    renderVoiceScreen();
    renderReading(); // refresh the "done" dots on the reading screen
  }, 3700);

  voiceTimers.push(toAnalyzing, toResult);
}

function handleSimulateMistake() {
  clearVoiceTimers();
  voiceResultType = "mistake";
  voicePhase = "result";
  recordResult(false);
  renderVoiceScreen();
}

function handleNextPractice() {
  if (isLastSentence()) {
    // Start the same book again from the first sentence.
    state.completed = new Set();
    state.stats = { correct: 0, total: 0 };
    goToSentence(0);
  } else {
    goToSentence(state.sentenceIndex + 1);
  }
}

// Event delegation — mic/action-row contents are rebuilt dynamically.
micArea.addEventListener("click", function (e) {
  if (e.target.closest("#btn-mic")) runRecordingFlow();
});
actionRow.addEventListener("click", function (e) {
  if (e.target.closest("#btn-simulate-mistake")) handleSimulateMistake();
  if (e.target.closest("#btn-try-again")) resetVoice();
  if (e.target.closest("#btn-next-practice")) handleNextPractice();
});

document.getElementById("btn-correct-pronunciation").addEventListener("click", function () {
  pronunciationPlayed = true;
  renderMistakeCard();
  speak(currentSentence().mistake.word, { rate: 0.75 });
});

document.getElementById("btn-listen-practice").addEventListener("click", function () {
  speak(currentSentence().text);
});

/* ------------------------------ Init ----------------------------------- */

renderReading();
renderVoiceScreen();

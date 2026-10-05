"use strict";

/* ======================================================================
   اقرأ من أول وجديد — Frontend Prototype (Vanilla HTML/CSS/JS)
   لا يوجد Backend / Database / API / OCR حقيقي / AI حقيقي.
   كل البيانات والمنطق هنا Mock / Simulation فقط، موضّح بوضوح أينما ظهر.
   الصوت وحده حقيقي: يستخدم Web Speech API المدمجة في المتصفح
   (speechSynthesis) — بدون أي خادوم أو اتصال إنترنت.
   ====================================================================== */

/* ----------------------------- Mock data ----------------------------- */

const MOCK_WORDS = "كان هناك أرنب صغير يعيش في حديقة جميلة".split(" ");
const PRACTICE_WORDS = ["كان", "هناك", "أرنب", "صغير"];
const MISTAKE_WORD = "صغير";
const MOCK_ACCURACY_SUCCESS = 90;

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
    voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("ar")) ||
    voices.find((v) => v.default) ||
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

function simulateUpload() {
  uploadIdle.classList.add("hidden");
  uploadDone.classList.add("hidden");
  uploadAnalyzing.classList.remove("hidden");
  window.setTimeout(function () {
    uploadAnalyzing.classList.add("hidden");
    uploadDone.classList.remove("hidden");
  }, 1600);
}

document.getElementById("btn-upload-area").addEventListener("click", simulateUpload);
document.getElementById("btn-camera").addEventListener("click", simulateUpload);

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

if (!isSpeechSupported()) noSpeechWarning.classList.remove("hidden");

// Build the word spans once.
const wordSpans = MOCK_WORDS.map(function (word) {
  const span = document.createElement("span");
  span.className = "word";
  span.textContent = word;
  storyWordsEl.appendChild(span);
  return span;
});

// Exact text spoken, so character offsets line up with MOCK_WORDS.
const SPEECH_TEXT = MOCK_WORDS.join(" ") + ".";
const wordStartOffsets = (function () {
  let pos = 0;
  return MOCK_WORDS.map(function (word) {
    const start = pos;
    pos += word.length + 1; // +1 for the space between words
    return start;
  });
})();

function charIndexToWordIndex(charIndex) {
  let found = 0;
  for (let i = 0; i < wordStartOffsets.length; i++) {
    if (wordStartOffsets[i] <= charIndex) found = i;
  }
  return found;
}

let activeIndex = -1;
let readingPlayState = "idle"; // idle | playing | paused
let boundaryFired = false;
let fallbackTimer = null;

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

function startFallbackHighlight(fromIndex) {
  let i = fromIndex || 0;
  setActiveIndex(i);
  fallbackTimer = window.setInterval(function () {
    i += 1;
    if (i >= MOCK_WORDS.length) {
      clearFallbackTimer();
      return;
    }
    setActiveIndex(i);
  }, 550);
}

function setReadingPlayState(state) {
  readingPlayState = state;
  btnListen.classList.toggle("active", state === "playing");
}

function playFromStart() {
  boundaryFired = false;
  clearFallbackTimer();
  setActiveIndex(-1);

  speak(SPEECH_TEXT, {
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
    if (!boundaryFired) startFallbackHighlight(0);
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

function setEasyMode(on) {
  storyBoxEl.classList.toggle("easy", on);
  btnEasy.classList.toggle("active", on);
  toggleEasy.setAttribute("aria-checked", String(on));
}
let easyModeOn = false;
btnEasy.addEventListener("click", function () {
  easyModeOn = !easyModeOn;
  setEasyMode(easyModeOn);
});
toggleEasy.addEventListener("click", function () {
  easyModeOn = !easyModeOn;
  setEasyMode(easyModeOn);
});

const btnWordOfDay = document.getElementById("btn-word-of-day");
btnWordOfDay.addEventListener("click", function () {
  speak("أرنب");
});

document.getElementById("btn-go-practice").addEventListener("click", function () {
  showScreen("screen-voice");
});

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
      micArea.innerHTML =
        '<div class="center-col" style="padding:0">' +
        '<p style="font-size:1.75rem;margin:0">⭐ ممتاز!</p>' +
        '<p class="bold-text" style="font-size:1.125rem">نطقك صحيح بنسبة ' +
        MOCK_ACCURACY_SUCCESS +
        "%</p>" +
        '<p class="muted-text">استمر، أنت بتتحسن! 👏</p>' +
        "</div>";
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
  wordResultsEl.classList.remove("hidden");
  wordResultsEl.innerHTML = PRACTICE_WORDS.map(function (word) {
    const correct = voiceResultType === "mistake" ? word !== MISTAKE_WORD : true;
    const cls = correct ? "correct" : "wrong";
    const mark = correct ? "✓" : "❌";
    return '<span class="word-pill ' + cls + '">' + word + " " + mark + "</span>";
  }).join("");
}

function renderMistakeCard() {
  const show = voicePhase === "result" && voiceResultType === "mistake";
  mistakeCard.classList.toggle("hidden", !show);
  correctPronLabel.textContent = pronunciationPlayed ? "تم النطق ✓" : "اسمع النطق الصحيح";
}

function renderActionRow() {
  let html = "";
  if (voicePhase === "result") {
    html += '<button class="btn btn--secondary btn--full" id="btn-try-again">🔁 حاول مرة أخرى</button>';
  }
  if (voicePhase !== "recording" && voicePhase !== "analyzing" && voiceResultType !== "mistake") {
    html += '<button class="btn btn--outline-danger btn--full" id="btn-simulate-mistake">Simulate Mistake</button>';
  }
  actionRow.innerHTML = html;
}

function renderPracticeHint() {
  practiceHint.classList.toggle("hidden", voicePhase === "result");
}

function renderVoiceScreen(countdown) {
  renderMicArea(countdown == null ? 0 : countdown);
  renderWordResults();
  renderMistakeCard();
  renderActionRow();
  renderPracticeHint();
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
    renderVoiceScreen();
  }, 3700);

  voiceTimers.push(toAnalyzing, toResult);
}

function handleSimulateMistake() {
  clearVoiceTimers();
  voiceResultType = "mistake";
  voicePhase = "result";
  renderVoiceScreen();
}

function handleTryAgain() {
  clearVoiceTimers();
  pronunciationPlayed = false;
  voiceResultType = "success";
  voicePhase = "idle";
  renderVoiceScreen();
}

// Event delegation — mic/result/action-row contents are rebuilt dynamically.
micArea.addEventListener("click", function (e) {
  if (e.target.closest("#btn-mic")) runRecordingFlow();
});
actionRow.addEventListener("click", function (e) {
  if (e.target.closest("#btn-simulate-mistake")) handleSimulateMistake();
  if (e.target.closest("#btn-try-again")) handleTryAgain();
});

document.getElementById("btn-correct-pronunciation").addEventListener("click", function () {
  pronunciationPlayed = true;
  renderMistakeCard();
  speak(MISTAKE_WORD, { rate: 0.75 });
});

document.getElementById("btn-listen-practice").addEventListener("click", function () {
  speak(PRACTICE_WORDS.join(" ") + ".");
});

// Reset voice-practice state whenever this screen is (re)entered via the
// Reading screen's "حان دورك" button, so repeated demo runs start clean.
document.getElementById("btn-go-practice").addEventListener("click", function () {
  clearVoiceTimers();
  pronunciationPlayed = false;
  voiceResultType = "success";
  voicePhase = "idle";
  renderVoiceScreen();
});

// Initial render
renderVoiceScreen();

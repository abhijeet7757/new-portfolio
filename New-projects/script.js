/* ========== COUNTER SECTION ========== */
const counters = document.querySelectorAll(".counter");
const duration = 1000;

function runCounter(counter) {
  const target = +counter.getAttribute("data-target");
  const step = target / (duration / 20);
  let count = 0;

  function updateCounter() {
    count += step;
    if (count < target) {
      counter.innerText = Math.floor(count) + "+";
      setTimeout(updateCounter, 20);
    } else {
      counter.innerText = target + "+";
    }
  }
  updateCounter();
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
      } else {
        entry.target.innerText = "0+";
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => observer.observe(counter));

/* ========== SLIDER (Swiper) SECTION ========== */
new Swiper(".card-wrapper", {
  loop: true,
  spaceBetween: 30,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

/* ========== NEW COMMENT SECTION ========== */

/* ========== COMMENT BOX: Add / Edit / Delete / Image ========== */
document.addEventListener("DOMContentLoaded", () => {
  const commentBox = document.querySelector(".comment-box");
  const newCommentWrap = document.querySelector(".new-comment");
  const postBtn = newCommentWrap?.querySelector("button");
  const commentInput = document.getElementById("commentInput");
  const imageInput = document.getElementById("imageInput");

  const DEFAULT_AVATAR = "../img/photo-1.png";
  let tempImageURL = null;

  if (!commentBox || !newCommentWrap || !postBtn || !commentInput) return;

  imageInput?.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    tempImageURL = file ? URL.createObjectURL(file) : null;
  });

  function addComment() {
    const text = (commentInput.value || "").trim();
    if (!text) return;

    const avatar = tempImageURL || DEFAULT_AVATAR;

    const newComment = document.createElement("div");
    newComment.className = "comment";
    newComment.innerHTML = `
      <img src="${avatar}" alt="User" />
      <div class="comment-content">
        <p><b>You:</b> ${escapeHtml(text)}</p>
        <div class="actions">
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </div>
      </div>
    `;

    commentBox.insertBefore(newComment, newCommentWrap);

    commentInput.value = "";
    if (imageInput) imageInput.value = "";
    tempImageURL = null;

    newComment.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function escapeHtml(str) {
    return str.replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        }[m])
    );
  }

  postBtn.addEventListener("click", addComment);

  commentInput.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      addComment();
    }
  });

  commentBox.addEventListener("click", (e) => {
    const target = e.target;

    // Delete
    if (target.classList.contains("delete")) {
      const wrap = target.closest(".comment");
      if (wrap) wrap.remove();
      return;
    }

    // Edit
    if (target.classList.contains("edit")) {
      const wrap = target.closest(".comment");
      const p = wrap?.querySelector("p");
      if (!p) return;

      const currentText = (p.innerText || "").replace(/^You:\s*/, "").trim();
      const newText = prompt("Edit your comment:", currentText);
      if (newText !== null) {
        p.innerHTML = `<b>You:</b> ${escapeHtml(newText.trim())}`;
      }
      return;
    }
  });
});

/* ========== FILTER TABS SECTION ========== */

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("#tabsWrap .tab");
  const cards = document.querySelectorAll("#cardsGrid .card");

  function showFilter(filter) {
    cards.forEach((card) => {
      const cats = card.dataset.category
        ? card.dataset.category.split(/\s+/)
        : [];
      if (filter === "all" || cats.includes(filter)) {
        card.classList.remove("hidden");
        card.style.opacity = "1";
      } else {
        card.classList.add("hidden");
        card.style.opacity = "0";
      }
    });
  }

  function setActiveTab(tabEl) {
    tabs.forEach((t) => t.classList.remove("active"));
    tabEl.classList.add("active");
    showFilter(tabEl.dataset.filter || "all");
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.stopPropagation();
      setActiveTab(tab);
    });

    tab.addEventListener("mouseenter", () => {
      const filter = tab.dataset.filter || "all";
      if (filter === "all") return;
      cards.forEach((card) => {
        const cats = card.dataset.category
          ? card.dataset.category.split(/\s+/)
          : [];
        if (cats.includes(filter)) card.style.opacity = "1";
        else card.style.opacity = "0.3";
      });
    });

    tab.addEventListener("mouseleave", () => {
      cards.forEach((card) => (card.style.opacity = "1"));
    });
  });

  const defaultTab = document.querySelector('[data-filter="Programming"]');
  if (defaultTab) setActiveTab(defaultTab);
});

/* ========== FAQ SECTION ========== */
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  item.addEventListener("click", () => {
    faqItems.forEach((i) => {
      if (i !== item) i.classList.remove("active");
    });
    item.classList.toggle("active");
  });
});

// hamburger menu

const menuIcon = document.querySelector(".hamburger");
const cancelIcon = document.querySelector(".cancle");
const navMenu = document.querySelector("header nav");

// Menu open
menuIcon.addEventListener("click", () => {
  navMenu.classList.add("active");
  menuIcon.style.display = "none";
  cancelIcon.style.display = "block";
});

// Menu close
cancelIcon.addEventListener("click", () => {
  navMenu.classList.remove("active");
  cancelIcon.style.display = "none";
  menuIcon.style.display = "block";
});

function closeMenu() {
  navMenu.classList.remove("active");
  cancelIcon.style.display = "none";
  menuIcon.style.display = "block";
}

// Document
document.addEventListener("click", (e) => {
  if (
    navMenu.classList.contains("active") &&
    !navMenu.contains(e.target) &&
    !menuIcon.contains(e.target) &&
    !cancelIcon.contains(e.target)
  ) {
    closeMenu();
  }
});

// Scroll event
window.addEventListener("scroll", () => {
  if (navMenu.classList.contains("active")) {
    closeMenu();
  }
});

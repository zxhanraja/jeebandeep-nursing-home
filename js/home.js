/**
 * Homepage Slide Navigation Module
 * Handles horizontal slide scrolling navigation, smooth scrolling snapping,
 * and tracks layout scroll events to dynamically update active links.
 * Only runs on the homepage (index.html) which has .viewport-slides.
 */
function initNavigationScroll() {
  // Horizontal slide navigation removed — now a multi-page site
  return;
}

/**
 * Implements mouse-tracking overlay preview card on clinical department lists.
 * Desktop only feature.
 */
function initDepartmentHoverPreviews() {
  const isDesktop = window.innerWidth > 1024;
  if (!isDesktop) return;

  const rows = document.querySelectorAll('.dept-row');
  const previewBox = document.getElementById('hover-preview-container');
  const previewImg = document.getElementById('hover-preview-img');

  if (!previewBox || !previewImg) return;

  rows.forEach(row => {
    const imgUrl = row.getAttribute('data-preview');

    row.addEventListener('mouseenter', () => {
      if (!imgUrl) return;
      previewImg.src = imgUrl;
      previewBox.style.opacity = '1';
      previewBox.style.transform = 'scale(1)';
    });

    row.addEventListener('mousemove', (e) => {
      const offsetX = 25;
      const offsetY = 25;

      let targetX = e.clientX + offsetX;
      let targetY = e.clientY + offsetY;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const boxWidth = previewBox.offsetWidth;
      const boxHeight = previewBox.offsetHeight;

      if (targetX + boxWidth > windowWidth) targetX = e.clientX - boxWidth - offsetX;
      if (targetY + boxHeight > windowHeight) targetY = e.clientY - boxHeight - offsetY;

      previewBox.style.left = `${targetX}px`;
      previewBox.style.top = `${targetY}px`;
    });

    row.addEventListener('mouseleave', () => {
      previewBox.style.opacity = '0';
      previewBox.style.transform = 'scale(0.85)';
    });
  });
}

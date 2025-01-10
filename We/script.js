document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById('uploadForm');
    const imageGallery = document.getElementById('imageGallery');
    const imageInput = document.getElementById('imageInput');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const notification = document.getElementById('notification');

    let uploadedImages = [];
    let currentImageIndex = null;
    let scrollPosition = 0;

    // Show notification function
    function showNotification(message, type = 'success') {
        notification.classList.remove('success', 'error');
        notification.classList.add(type);
        notification.querySelector('.message').textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Handle image upload
    uploadForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const file = imageInput.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('File terlalu besar! Maksimal 5MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const imageUrl = e.target.result;
                addImageToGallery(imageUrl);
                uploadedImages.push(imageUrl);
                localStorage.setItem('galleryImages', JSON.stringify(uploadedImages));
                uploadForm.reset();
                showNotification('Upload Success!');
            };

            reader.onerror = function() {
                showNotification('Gagal mengupload foto!', 'error');
            };

            reader.readAsDataURL(file);
        }
    });

    // Add image to gallery
    function addImageToGallery(imageUrl) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Gallery Image';
        
        galleryItem.appendChild(img);
        imageGallery.insertBefore(galleryItem, imageGallery.firstChild);
    }

    // Load saved images
    function loadSavedImages() {
        const savedImages = localStorage.getItem('galleryImages');
        if (savedImages) {
            uploadedImages = JSON.parse(savedImages);
            uploadedImages.forEach(imageUrl => {
                addImageToGallery(imageUrl);
            });
        }
    }

    // Open modal
    imageGallery.addEventListener('click', function (e) {
        if (e.target.tagName === 'IMG') {
            scrollPosition = window.scrollY;
            currentImageIndex = uploadedImages.indexOf(e.target.src);
            modalImage.src = e.target.src;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    });

    // Close modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollPosition);
    }

    modal.querySelector('.modal-close').addEventListener('click', function(e) {
        e.preventDefault();
        closeModal();
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Previous image
    prevButton.addEventListener('click', function (e) {
        e.stopPropagation();
        if (currentImageIndex !== null && uploadedImages.length > 1) {
            modal.classList.add('changing');
            setTimeout(() => {
                currentImageIndex = (currentImageIndex - 1 + uploadedImages.length) % uploadedImages.length;
                modalImage.src = uploadedImages[currentImageIndex];
                modal.classList.remove('changing');
            }, 300);
        }
    });

    // Next image
    nextButton.addEventListener('click', function (e) {
        e.stopPropagation();
        if (currentImageIndex !== null && uploadedImages.length > 1) {
            modal.classList.add('changing');
            setTimeout(() => {
                currentImageIndex = (currentImageIndex + 1) % uploadedImages.length;
                modalImage.src = uploadedImages[currentImageIndex];
                modal.classList.remove('changing');
            }, 300);
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                prevButton.click();
            } else if (e.key === 'ArrowRight') {
                nextButton.click();
            } else if (e.key === 'Escape') {
                modal.style.display = 'none';
            }
        }
    });

    // Load saved images on page load
    loadSavedImages();
});